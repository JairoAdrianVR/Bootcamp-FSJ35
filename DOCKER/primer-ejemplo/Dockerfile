# Este archivo le sirve a docker para entender que tiene que hacer
# CON ESTA CARPETA

# 1er paso en un Dockerfile va a ser DECIRLE DE QUE TECNOLOGIA
# ES NUESTRA IMAGEN PRINCIPAL (con que tecnologia tiene que entender esto)

# --- INSTALA ALPINE PARA QUE ANDE NODE
FROM node:24.21-alpine

# En que carpeta va a estar el proyecto dentro del contenedor
WORKDIR /app

# COPIA LOS ARCHIVOS QUE YO TENGO EL LOCAL, ADENTRO DEL IMAGEN
COPY app.js .

# Crear el comando para ejecutar en la terminal cuando inicie el contenedor
CMD ["node","app.js"]