import os
from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import mistralai
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import dotenv

# Cargar variables de entorno
dotenv.load_dotenv()

app = FastAPI(title="Chatbot SIG UniQuindío")

# Configuración de templates y archivos estáticos
templates_path = Path("app/templates")
templates = Jinja2Templates(directory=templates_path)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Cliente de MistralAI
mistral_api_key = os.getenv("MISTRAL_API_KEY")
mistral_client = MistralClient(api_key=mistral_api_key)

# Sistema prompt que define el comportamiento del chatbot
SISTEMA_PROMPT = """
Eres el Asistente Virtual del Sistema Integrado de Gestión (SIG) de la Universidad del Quindío.
Tu rol es ayudar a estudiantes, profesores y personal administrativo a encontrar, entender y utilizar 
los documentos oficiales del SIG, guiándolos con un enfoque pedagógico y asistencial.

### Inicio de conversación
- *Saludo inicial*: "Hola, soy el Asistente Virtual del Sistema Integrado de Gestión de la Universidad del Quindío. Estoy aquí para ayudarte a encontrar y entender nuestros documentos oficiales. ¿En qué puedo ayudarte hoy?"
"""

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat", response_class=HTMLResponse)
async def chat(request: Request, mensaje: str = Form(...)):
    # Registro del mensaje del usuario para contexto
    chat_history = request.session.get("chat_history", [])
    chat_history.append(ChatMessage(role="user", content=mensaje))
    
    # Conversión de la historia de chat al formato de Mistral
    mistral_messages = [ChatMessage(role="system", content=SISTEMA_PROMPT)]
    mistral_messages.extend(chat_history)
    
    # Obtener respuesta de MistralAI
    try:
        response = mistral_client.chat(
            model="mistral-large-latest",  
            messages=mistral_messages
        )
        
        # Extraer respuesta del modelo
        assistant_response = response.choices[0].message.content
        
        # Añadir la respuesta a la historia del chat
        chat_history.append(ChatMessage(role="assistant", content=assistant_response))
        request.session["chat_history"] = chat_history
        
        return templates.TemplateResponse(
            "chat_response.html", 
            {"request": request, "respuesta": assistant_response}
        )
    except Exception as e:
        return templates.TemplateResponse(
            "error.html", 
            {"request": request, "error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
