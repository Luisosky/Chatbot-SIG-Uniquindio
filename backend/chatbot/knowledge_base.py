import os
import pandas as pd
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_mistralai.embeddings import MistralAIEmbeddings
import dotenv

dotenv.load_dotenv()
mistral_api_key = os.getenv("MISTRAL_API_KEY")

class DocumentKnowledgeBase:
    def __init__(self, documents_dir="documents"):
        self.documents_dir = documents_dir
        self.embeddings = MistralAIEmbeddings(
            model="mistral-embed",
            api_key=mistral_api_key
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vector_store = None
        self.calendar_data = None
        
    def load_documents(self):
        """Carga documentos PDF y DOCX del directorio especificado"""
        documents = []
        
        for root, _, files in os.walk(self.documents_dir):
            for file in files:
                if file.lower().endswith('.pdf'):
                    loader = PyPDFLoader(os.path.join(root, file))
                    documents.extend(loader.load())
                elif file.lower().endswith('.docx'):
                    loader = Docx2txtLoader(os.path.join(root, file))
                    documents.extend(loader.load())
                    
        return documents
    
    def load_calendar_data(self, calendar_file="calendario_academico.xlsx"):
        """Carga datos del calendario académico desde Excel"""
        path = os.path.join(self.documents_dir, calendar_file)
        if os.path.exists(path):
            self.calendar_data = pd.read_excel(path)
            return True
        return False
    
    def build_knowledge_base(self):
        """Construye la base de conocimiento vectorial"""
        documents = self.load_documents()
        chunks = self.text_splitter.split_documents(documents)
        
        # Crear base de conocimiento vectorial
        self.vector_store = FAISS.from_documents(chunks, self.embeddings)
        return len(chunks)
    
    def save_knowledge_base(self, path="app/vector_store"):
        """Guarda la base de conocimiento para uso futuro"""
        if self.vector_store:
            self.vector_store.save_local(path)
            
    def load_knowledge_base(self, path="app/vector_store"):
        """Carga una base de conocimiento existente"""
        if os.path.exists(path):
            self.vector_store = FAISS.load_local(path, self.embeddings)
            return True
        return False
    
    def search_relevant_documents(self, query, k=5):
        """Busca documentos relevantes para la consulta"""
        if not self.vector_store:
            raise ValueError("La base de conocimiento no ha sido construida o cargada")
            
        return self.vector_store.similarity_search(query, k=k)
    
    def get_calendar_events(self, keyword=None, date_start=None, date_end=None):
        """Recupera eventos relevantes del calendario académico"""
        if self.calendar_data is None:
            return []
        
        filtered_data = self.calendar_data
        
        if keyword:
            filtered_data = filtered_data[filtered_data['descripcion'].str.contains(keyword, case=False)]
            
        if date_start and date_end:
            filtered_data = filtered_data[(filtered_data['fecha'] >= date_start) & 
                                         (filtered_data['fecha'] <= date_end)]
                                         
        return filtered_data.to_dict('records')