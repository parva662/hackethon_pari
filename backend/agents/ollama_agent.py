from langchain_ollama import OllamaLLM


class OllamaAgent:
    def __init__(self, model_name="mistral:latest"):
        self.llm = OllamaLLM(model=model_name)
    
    def query(self, messages) -> str:
        return self.llm.invoke(messages)