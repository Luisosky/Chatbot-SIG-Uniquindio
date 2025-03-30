# Configuración Docker para Rasa

## Versiones utilizadas
- Rasa: 3.5.14
- Rasa SDK: 3.5.1
- PyMuPDF: 1.21.1
- python-docx: 0.8.11
- pdfplumber: 0.9.0

## Estructura de directorios
- `/app`: Directorio principal de la aplicación Rasa
- `/app/actions`: Código de acciones personalizadas
- `/app/documentos`: Documentos para procesamiento
- `/app/models`: Modelos entrenados
- `/app/data`: Datos de entrenamiento

## Volúmenes configurados
- `./:/app`: Todo el proyecto montado en el contenedor
- `./documentos:/app/documentos`: Documentos compartidos

## Puertos expuestos
- 5005: API de Rasa
- 5055: Servidor de acciones

## Variables de entorno
- `RASA_DOCS_PATH=/app/documentos`: Ruta a los documentos