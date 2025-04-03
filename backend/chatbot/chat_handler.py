import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from knowledge_base import DocumentKnowledgeBase
import datetime
import dotenv

dotenv.load_dotenv()

class ChatbotSIG:
    def __init__(self):
        self.mistral_api_key = os.getenv("MISTRAL_API_KEY")
        self.client = MistralClient(api_key=self.mistral_api_key)
        self.knowledge_base = DocumentKnowledgeBase()
        
        # Intentar cargar base de conocimiento existente o crearla si no existe
        if not self.knowledge_base.load_knowledge_base():
            print("Construyendo base de conocimiento de documentos SIG...")
            self.knowledge_base.build_knowledge_base()
            self.knowledge_base.save_knowledge_base()
            
        # Cargar datos de calendario
        self.knowledge_base.load_calendar_data()
        
        # Sistema prompt base
        self.system_prompt = """
        Eres el Asistente Virtual del Sistema Integrado de Gestión (SIG) de la Universidad del Quindío.
        Tu rol es ayudar a estudiantes, profesores y personal administrativo a encontrar, entender 
        y utilizar los documentos oficiales del SIG, guiándolos con un enfoque pedagógico y asistencial.
        
        Hoy es {current_date}.
        
        Información sobre documentos relevantes para la consulta del usuario:
        {relevant_documents}
        
        Eventos del calendario académico relacionados:
        {calendar_events}
        
        Responde de manera formal pero accesible, utilizando un tono adecuado para el entorno universitario.
        Estructura tus respuestas en párrafos cortos y utiliza viñetas cuando sea conveniente.
        Si no tienes información sobre algo, admítelo claramente y sugiere a quién contactar.
        """
    
    def get_relevant_context(self, query):
        """Obtiene contexto relevante para la consulta del usuario"""
        # Buscar documentos relevantes
        relevant_docs = self.knowledge_base.search_relevant_documents(query)
        
        # Detectar posibles términos relacionados con el calendario
        calendar_keywords = ["fecha", "plazo", "límite", "calendario", "inscripción", 
                           "matrícula", "cancelación", "grado"]
                           
        has_calendar_term = any(keyword in query.lower() for keyword in calendar_keywords)
        
        calendar_events = []
        if has_calendar_term:
            # Si hay términos del calendario, buscar eventos relevantes
            today = datetime.date.today()
            three_months = today + datetime.timedelta(days=90)
            
            for keyword in calendar_keywords:
                if keyword in query.lower():
                    events = self.knowledge_base.get_calendar_events(
                        keyword=keyword, 
                        date_start=today,
                        date_end=three_months
                    )
                    calendar_events.extend(events)
        
        # Formatear documentos relevantes como texto
        docs_text = ""
        if relevant_docs:
            docs_text = "\n\n".join([
                f"Documento: {doc.metadata.get('source', 'Sin fuente')}\n"
                f"Contenido: {doc.page_content[:500]}..."
                for doc in relevant_docs
            ])
        else:
            docs_text = "No se encontraron documentos específicos sobre esta consulta."
            
        # Formatear eventos de calendario
        calendar_text = ""
        if calendar_events:
            calendar_text = "\n".join([
                f"- {event['descripcion']}: {event['fecha'].strftime('%d/%m/%Y')}"
                for event in calendar_events
            ])
        else:
            calendar_text = "No hay eventos próximos del calendario académico relacionados con esta consulta."
            
        return docs_text, calendar_text
    
    def generate_response(self, user_message, chat_history=None):
        """Genera una respuesta al mensaje del usuario"""
        if chat_history is None:
            chat_history = []
            
        # Obtener contexto relevante
        relevant_docs, calendar_events = self.get_relevant_context(user_message)
        
        # Crear prompt completo con el contexto actual
        current_date = datetime.date.today().strftime("%d/%m/%Y")
        complete_system_prompt = self.system_prompt.format(
            current_date=current_date,
            relevant_documents=relevant_docs,
            calendar_events=calendar_events
        )
        
        # Preparar mensajes para la API
        messages = [ChatMessage(role="system", content=complete_system_prompt)]
        
        # Añadir historia de chat (limitada a los últimos 5 intercambios)
        for msg in chat_history[-10:]:
            messages.append(msg)
            
        # Añadir mensaje actual
        messages.append(ChatMessage(role="user", content=user_message))
        
        # Generar respuesta
        response = self.client.chat(
            model="mistral-large-latest",
            messages=messages,
            temperature=0.3,  # Bajo para mayor precisión en información técnica
            max_tokens=1024
        )
        
        return response.choices[0].message