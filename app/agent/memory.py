from langchain.memory import ConversationBufferMemory


def get_memory(memory_key="chat_history"):
    """Create a conversation memory instance."""
    memory = ConversationBufferMemory(
        memory_key=memory_key,
        return_messages=True,
        output_key="output",
    )
    return memory