from processing import PDFProcessor
import os

def Process_PDF(folder_path, collection_name):
    pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
    for pdf_file in pdf_files:
        pdf_file_path = os.path.join(folder_path, pdf_file)
        pdf_processor = PDFProcessor(pdf_file_path, collection_name)
        pdf_processor.process_pdf_to_chunks()

PDF_knowledge = "Set_up/Semantic_memory"  # Path to the folder containing PDF files
semantic_memory = "Fire_forest_GPT"

Process_PDF(PDF_knowledge, semantic_memory)