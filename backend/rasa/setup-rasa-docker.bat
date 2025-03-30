@echo off
echo Configurando entorno Docker para Rasa...

echo Creando estructura de directorios...
if not exist "actions" mkdir actions
if not exist "documentos" mkdir documentos
if not exist "data" mkdir data
if not exist "models" mkdir models

echo Creando archivos de configuración mínimos si no existen...
if not exist "endpoints.yml" (
  echo action_endpoint: > endpoints.yml
  echo   url: http://actions:5055/webhook >> endpoints.yml
  echo. >> endpoints.yml
  echo telemetry: >> endpoints.yml
  echo   enabled: false >> endpoints.yml
)

if not exist "config.yml" (
  echo language: es >> config.yml
  echo pipeline: >> config.yml
  echo   - name: WhitespaceTokenizer >> config.yml
  echo   - name: RegexFeaturizer >> config.yml
  echo   - name: LexicalSyntacticFeaturizer >> config.yml
  echo   - name: CountVectorsFeaturizer >> config.yml
  echo   - name: CountVectorsFeaturizer >> config.yml
  echo     analyzer: char_wb >> config.yml
  echo     min_ngram: 1 >> config.yml
  echo     max_ngram: 4 >> config.yml
  echo   - name: DIETClassifier >> config.yml
  echo     epochs: 100 >> config.yml
  echo policies: >> config.yml
  echo   - name: MemoizationPolicy >> config.yml
  echo   - name: TEDPolicy >> config.yml
  echo     max_history: 5 >> config.yml
  echo     epochs: 10 >> config.yml
  echo   - name: RulePolicy >> config.yml
)

if not exist "actions\__init__.py" (
  echo. > actions\__init__.py
)

if not exist "actions\actions.py" (
  echo from typing import Any, Text, Dict, List >> actions\actions.py
  echo from rasa_sdk import Action, Tracker >> actions\actions.py
  echo from rasa_sdk.executor import CollectingDispatcher >> actions\actions.py
  echo. >> actions\actions.py
  echo class ActionHelloWorld(Action): >> actions\actions.py
  echo     def name(self) -^> Text: >> actions\actions.py
  echo         return "action_hello_world" >> actions\actions.py
  echo. >> actions\actions.py
  echo     def run(self, dispatcher: CollectingDispatcher, >> actions\actions.py
  echo             tracker: Tracker, >> actions\actions.py
  echo             domain: Dict[Text, Any]) -^> List[Dict[Text, Any]]: >> actions\actions.py
  echo. >> actions\actions.py
  echo         dispatcher.utter_message(text="Hello World!") >> actions\actions.py
  echo         return [] >> actions\actions.py
)

echo Configuración completada. Ejecuta 'docker-compose up' para iniciar Rasa.