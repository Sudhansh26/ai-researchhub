"""Multi-agent orchestrator for the AI research system."""

from app.llm.model import load_llm
from app.tools.pdf_search import pdf_search
from app.tools.web_search import web_search
from app.tools.wiki_search import wiki_search
from app.tools.youtube_search import youtube_search


AGENT_DEFINITIONS = {
    'web_researcher': {
        'name': 'Web Researcher',
        'role': 'Searches the internet and Wikipedia for current information',
        'tools': [web_search, wiki_search],
        'prefix': (
            'You are a Web Research Agent. Review the tool findings and produce a factual '
            'markdown summary with sources. Do not invent information beyond the findings.'
        ),
    },
    'youtube_researcher': {
        'name': 'YouTube Researcher',
        'role': 'Finds relevant YouTube videos and educational content',
        'tools': [youtube_search],
        'prefix': (
            'You are a YouTube Research Agent. Review the tool findings and summarize the '
            'most useful videos, key topics, and links in markdown.'
        ),
    },
    'document_analyst': {
        'name': 'Document Analyst',
        'role': 'Analyzes uploaded PDF documents for relevant information',
        'tools': [pdf_search],
        'prefix': (
            'You are a Document Analysis Agent. Review the document search findings and '
            'summarize only what is supported by the retrieved document excerpts.'
        ),
    },
}


def _run_tools(question: str, tools: list) -> list[tuple[str, str]]:
    """Run each tool directly and capture its output."""
    outputs = []
    for tool_fn in tools:
        try:
            output = tool_fn(question)
        except Exception as e:
            output = f'{tool_fn.__name__} failed: {str(e)}'
        outputs.append((tool_fn.__name__, output))
    return outputs


def _format_tool_outputs(tool_outputs: list[tuple[str, str]]) -> str:
    return '\n\n'.join(
        f'### {tool_name}\n{tool_result}' for tool_name, tool_result in tool_outputs
    )


def _fallback_agent_report(agent_name: str, tool_outputs: list[tuple[str, str]]) -> str:
    sections = [f'## {agent_name} Findings', 'Automated summary unavailable. Showing direct tool results instead.', '']
    for tool_name, tool_result in tool_outputs:
        sections.append(f'### {tool_name}')
        sections.append(tool_result)
        sections.append('')
    return '\n'.join(sections).strip()


def _fallback_final_summary(question: str, agent_results: list[dict]) -> str:
    parts = [
        '# Research Summary',
        f'Question: {question}',
        'LLM synthesis unavailable. Showing direct agent results instead.',
        '',
    ]
    for result in agent_results:
        parts.append(f"## {result['agent_name']}")
        parts.append(result['result'])
        parts.append('')
    return '\n'.join(parts).strip()


def run_single_agent(agent_key: str, question: str) -> dict:
    """Run a single sub-agent and return its result."""
    defn = AGENT_DEFINITIONS[agent_key]
    tool_outputs = _run_tools(question, defn['tools'])

    try:
        llm = load_llm(temperature=0.2, max_new_tokens=1024)
        prompt = (
            f"{defn['prefix']}\n\n"
            f'User question: {question}\n\n'
            f"Tool findings:\n{_format_tool_outputs(tool_outputs)}\n\n"
            'Write a concise markdown report grounded only in the findings above. '
            'If a tool returned an error or no results, mention that clearly.'
        )
        result = llm.invoke(prompt)
    except Exception:
        result = _fallback_agent_report(defn['name'], tool_outputs)

    return {
        'agent_name': defn['name'],
        'agent_role': defn['role'],
        'result': result,
        'status': 'success',
    }


def run_all_agents(question: str, agent_keys: list | None = None) -> dict:
    """Run selected agents and synthesize their results."""
    if agent_keys is None:
        agent_keys = list(AGENT_DEFINITIONS.keys())

    agent_results = []
    for key in agent_keys:
        if key in AGENT_DEFINITIONS:
            agent_results.append(run_single_agent(key, question))

    try:
        llm = load_llm(temperature=0.3, max_new_tokens=2048)
        synthesis_prompt = _build_synthesis_prompt(question, agent_results)
        final_summary = llm.invoke(synthesis_prompt)
    except Exception:
        final_summary = _fallback_final_summary(question, agent_results)

    return {
        'question': question,
        'agent_results': agent_results,
        'final_summary': final_summary,
    }


def _build_synthesis_prompt(question: str, agent_results: list) -> str:
    """Build the prompt for the orchestrator to synthesize agent results."""
    results_text = ''
    for result in agent_results:
        status_icon = 'SUCCESS' if result['status'] == 'success' else 'ERROR'
        results_text += (
            f"\n\n### [{status_icon}] {result['agent_name']} ({result['agent_role']}):\n"
            f"{result['result']}"
        )

    return f"""You are an AI Research Orchestrator. Multiple specialized research agents have
investigated the following question. Synthesize their findings into a clear, comprehensive,
well-structured research report.

## Research Question:
{question}

## Agent Findings:
{results_text}

## Instructions:
- Combine all findings into a coherent summary
- Highlight key facts and insights
- Note any conflicting information between agents
- Include relevant video links from the YouTube agent
- Mention document sources if the Document Analyst found relevant content
- Format the report with clear sections using markdown
- Keep the summary informative but concise

## Synthesized Research Report:"""


def get_available_agents() -> list:
    """Return list of available agents and their descriptions."""
    return [
        {
            'key': key,
            'name': defn['name'],
            'role': defn['role'],
            'tools': [tool_fn.__name__ for tool_fn in defn['tools']],
        }
        for key, defn in AGENT_DEFINITIONS.items()
    ]
