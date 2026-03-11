from huggingface_hub import InferenceClient

from app.config import HF_MODEL, HUGGINGFACE_API_KEY


class HuggingFaceLLM:
    """Small wrapper around HuggingFace InferenceClient with an invoke API."""

    def __init__(self, model_id: str, api_key: str, temperature: float = 0.3, max_tokens: int = 1024):
        self.model_id = model_id
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.api_key = api_key.strip().strip('"').strip("'")
        self.client = InferenceClient(api_key=self.api_key) if self.api_key else None

    def invoke(self, prompt: str, stop: list[str] | None = None) -> str:
        """Call the HuggingFace Inference API using a supported generation endpoint."""
        if not self.api_key:
            raise RuntimeError('Missing Hugging Face API key.')
        if not self.api_key.startswith('hf_'):
            raise RuntimeError('Hugging Face API key must start with hf_.')

        try:
            response = self.client.chat_completion(
                model=self.model_id,
                messages=[{'role': 'user', 'content': prompt}],
                max_tokens=self.max_tokens,
                temperature=max(self.temperature, 0.01),
            )
            text = response.choices[0].message.content
        except Exception as e:
            message = str(e)
            if 'not a chat model' not in message.lower() and 'model_not_supported' not in message.lower():
                raise RuntimeError(_clean_error(message)) from e

            try:
                generated = self.client.text_generation(
                    prompt=prompt,
                    model=self.model_id,
                    max_new_tokens=self.max_tokens,
                    temperature=max(self.temperature, 0.01),
                    return_full_text=False,
                )
                text = generated if isinstance(generated, str) else str(generated)
            except Exception as generation_error:
                raise RuntimeError(_clean_error(str(generation_error))) from generation_error

        if stop:
            for token in stop:
                if token in text:
                    text = text[:text.index(token)]
        return text.strip()


def _clean_error(message: str) -> str:
    lowered = message.lower()
    if 'not a chat model' in lowered or 'model_not_supported' in lowered:
        return 'The selected Hugging Face model does not support chat completions.'
    if 'auto-router' in lowered:
        return 'The configured API key cannot be used with the selected Hugging Face routing mode.'
    if 'bad request' in lowered:
        return 'The model request was rejected by Hugging Face.'
    return message.split('(Request ID:')[0].strip()


def load_llm(temperature: float = 0.3, max_new_tokens: int = 1024) -> HuggingFaceLLM:
    """Load the HuggingFace Inference API client wrapper."""
    return HuggingFaceLLM(
        model_id=HF_MODEL,
        api_key=HUGGINGFACE_API_KEY,
        temperature=temperature,
        max_tokens=max_new_tokens,
    )
