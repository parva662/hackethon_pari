from chunking_evaluation.chunking import RecursiveTokenChunker
from langchain_community.document_loaders import PyPDFLoader
from memory import ChromaMemory

class PDFProcessor:
    def __init__(self, pdf_file, collection_name, chunk_size=800, chunk_overlap=0):
        self.pdf_file = pdf_file
        self.collection_name = collection_name
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.memory = ChromaMemory()
        self.loader = PyPDFLoader(pdf_file)
        self.document = self._load_pdf()
        self.chunker = RecursiveTokenChunker(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ".", "?", "!", " ", ""]
        )
    
    def _load_pdf(self):
        """Load the PDF content and combine pages into a single document."""
        pages = [page for page in self.loader.load()]
        return " ".join(page.page_content for page in pages)
    
    def _get_last_chunk_index(self):
        """Get the last chunk index in the collection to avoid overwriting."""
        return self.memory.get_last_entry(self.collection_name)
    
    def process_pdf_to_chunks(self):
        """Process the PDF file into chunks and store them in ChromaDB."""
        recursive_character_chunks = self.chunker.split_text(self.document)
        print(f"Number of chunks to add: {len(recursive_character_chunks)}")
        last_chunk_index = self._get_last_chunk_index()
        
        for i, chunk in enumerate(recursive_character_chunks):
            new_chunk_index = last_chunk_index + i + 1  
            entry = {
                "id": f"{self.collection_name}_chunk_{new_chunk_index}",  # Unique ID for each chunk
                "text": chunk,
                "metadata": {"source": self.pdf_file, "chunk_index": new_chunk_index}  # Add metadata
            }
            self.memory.add_entry(entry, self.collection_name)
        
        print(f"Stored {len(recursive_character_chunks)} chunks in ChromaDB for {self.pdf_file}.")



