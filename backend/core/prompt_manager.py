from langchain_core.messages import SystemMessage
import os



class PromptManager:
    def __init__(self, system_prompt_file: str, episodic_prompt_file: str, semantic_prompt_file: str, reflection_prompt_file: str):
        """
        Initialize the PromptManager by loading system, episodic, and semantic prompt from text files.
        """
        self.system_prompt = self._load_prompt_from_file(system_prompt_file)
        self.episodic_prompt_template = self._load_prompt_from_file(episodic_prompt_file)
        self.semantic_prompt_template = self._load_prompt_from_file(semantic_prompt_file)
        self.reflection_prompt_file = reflection_prompt_file
        
        
    def _load_prompt_from_file(self, file_path: str):
        """Loads the contents of a text file."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"The file {file_path} does not exist.")
        with open(file_path, 'r') as file:
            return file.read().strip()

    def get_episodic_prompt(self, query: str, collection: str, top_k : int):
        from memory import ChromaMemory

        """Generate the episodic prompt using the template and query."""
        database = ChromaMemory()
        memory = database.search(query, collection, top_k)
        if not memory or memory == ["No results found."]:
            return SystemMessage(content=self.system_prompt)
        conversations = []
        what_worked = set()
        what_to_avoid = set()

        for result in memory:
            current_conversation = result.get("conversation", "")
            if current_conversation and current_conversation not in conversations:
                conversations.append(current_conversation)

            what_worked.update(result.get("what_worked", "").split('. ') if result.get("what_worked") else [])
            what_to_avoid.update(result.get("what_to_avoid", "").split('. ') if result.get("what_to_avoid") else [])
        # Get up to 3 previous conversations excluding the most recent
        previous_convos = conversations[-4:]
        previous_convos = [conv for conv in previous_convos if conv != conversations[-1]][-3:]
        #all the format parts have to change based on the episodic prompt file, goal is to make it universalloy changeable (maybe with standard inputs?)
        episodic_prompt = self.episodic_prompt_template.format(
            current_conversation=conversations[-1],
            previous_convos=' | '.join(previous_convos) if previous_convos else "None",
            what_worked=' '.join(what_worked) if what_worked else "No insights yet.",
            what_to_avoid=' '.join(what_to_avoid) if what_to_avoid else "No specific avoidance rules."
        )
        # print(episodic_prompt)
        
        return SystemMessage(episodic_prompt)

    def get_semantic_prompt(self, query: str, collection: str, top_k :int):
        from memory import ChromaMemory

        """Generate the semantic prompt using the template and query."""
        database = ChromaMemory()
        memories = database.search(query, collection, top_k)

        semantic_prompt = self.semantic_prompt_template.format(memories=memories) # will stay the same, users must use memories as an entry. 
        
        return semantic_prompt
