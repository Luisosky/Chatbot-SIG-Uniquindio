@echo off
setlocal

if "%1"=="" goto help
if "%1"=="train" goto train
if "%1"=="run" goto run
if "%1"=="shell" goto shell
if "%1"=="interactive" goto interactive
if "%1"=="actions" goto actions
if "%1"=="help" goto help

:train
echo Entrenando modelo Rasa...
docker-compose run rasa train
goto end

:run
echo Iniciando servidores Rasa...
docker-compose up
goto end

:shell
echo Iniciando shell interactivo...
docker-compose run rasa shell
goto end

:interactive
echo Iniciando modo interactivo...
docker-compose run rasa interactive
goto end

:actions
echo Ejecutando servidor de acciones...
docker-compose run actions
goto end

:help
echo.
echo Uso: rasa-commands [comando]
echo.
echo Comandos disponibles:
echo   train       - Entrenar un nuevo modelo
echo   run         - Iniciar todos los servicios
echo   shell       - Abrir un shell interactivo
echo   interactive - Iniciar modo interactivo
echo   actions     - Ejecutar servidor de acciones
echo.
goto end

:end
endlocal