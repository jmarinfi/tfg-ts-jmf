Comando para iniciar la API:

plumber::plumb(file='plumber.R')$run(port=8000)


Comando para montar la imagen docker (desde la carpeta raíz):

docker build -t jmarinfi/api_r:latest .


Comando para iniciar el contenedor:

docker run --name api_r -p 8000:8000 jmarinfi:latest