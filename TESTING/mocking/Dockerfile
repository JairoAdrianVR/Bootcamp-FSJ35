#Instrucciones para que docker genere la imagen correctamente (y su contenedor)

# Desde alpine (linux base) con node vas a poder ejecutar este archivo
FROM node:22-alpine

# Carpeta del contenedor que va a tener este proyecto
WORKDIR /app

# Copiar los ARCHIVOS json para instalar dependencias
COPY package.json package-lock.json ./

#Instalar las dependencias para este proyecto
#RUN ejecuta un comando antes de levantar el contenedor
RUN npm ci

# Copiar los ARCHIVOS
COPY . .

#Comando que se va a ejecutar al levantar el contenedor
CMD ["npm","run","test"]