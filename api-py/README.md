## Instrucciones relativas al servicio FastAPI

- Activar entorno virtual:

`source .venv/bin/activate`

- Arrancar el servidor de desarrollo:

`uvicorn main:app --port 5000 --reload`


- Construir imagen de Docker:

`docker build -t jmarinfi/api_py:latest .`


- Ejecutar contenedor de Docker:

`docker run --name api_py -p 5000:5000 jmarinfi/api_py:latest`