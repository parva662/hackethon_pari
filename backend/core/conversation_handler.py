import json
class ConversationHandler:
    def __init__(self, prompt_manager, agent, collection_episodic: str, collection_semantic: str, top_k_episodic: int, top_k_semantic: int, name: str):
        self.prompt_manager = prompt_manager
        self.agent = agent
        self.collection_episodic = collection_episodic
        self.collection_semantic = collection_semantic
        self.top_k_episodic = top_k_episodic
        self.top_k_semantic = top_k_semantic
        self.messages = []
        self.name=name

    def format_conversation(self, messages):
        """"Create conversation summary for the episodic memory """
        conversation = []
        for message in messages:
            if message['role'] in ['assistant', 'user']:
                conversation.append(f"{message['role'].capitalize()}: {message['content']}")
        return "\n".join(conversation)

    def run_conversation(self,prompt):
        """'Runs the conversation with the user"""
        user_message = {"role": "user", "content": prompt}
        if prompt.lower() == "exit":
            if self.messages == []:
                return print("no messages to store")
            else:
                from core import ConversationReflection
                from memory import ChromaMemory
                memory = ChromaMemory()
                reflection_generator = ConversationReflection(self.agent, self.prompt_manager.reflection_prompt_file)
                conversation = self.format_conversation(self.messages)
                reflection = reflection_generator.reflect_on_conversation(conversation)
                memory.add_entry(reflection, self.collection_episodic)
                return print(reflection)
        elif prompt.lower() == "exit_quiet":
            return print("\n == Conversation Exited ==")
        self.messages.append(user_message)
        system_prompt = self.prompt_manager.get_episodic_prompt(prompt, self.collection_episodic, self.top_k_episodic) #get 
        system_message = {"role": "system", "content": system_prompt.content}
        self.messages = [system_message] + [msg for msg in self.messages if msg["role"] != "system"]
        context_message = self.prompt_manager.get_semantic_prompt(prompt, self.collection_semantic, self.top_k_semantic)
        # combined_string = json.dumps(self.messages, ensure_ascii=False, indent=2) + "\n\nCONTEXT:\n" + context_message
        # print(combined_string)
        placeholder = [*self.messages, context_message, user_message]
        response = self.agent.query(placeholder)
        # message_id = response.id
        # prompt_id={"message_id": message_id, "expert_prompt": placeholder}
        content = response.content
        self.messages.append({"role": "assistant", "content": content})
        last_message=self.messages[-1]["content"]
        final_response={"last_message": last_message}
        # end_message={"prompt":prompt_id, "response": final_response}
        # print(end_message)
        return last_message
