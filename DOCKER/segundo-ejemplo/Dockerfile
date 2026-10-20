# 1era ETAPA -> Crear toda la base y eliminar las dependecias de dev
# Creamos la base y LIMPIAMOS de cosas innecesarias

#Preparamos el entorno
FROM node:22-alpine AS deps

#Crear carpeta dentro del contenedor para los archivos
WORKDIR /app

# Copiamos los package
COPY package.json package-lock.json ./

# Instalar las dependencias con cache
RUN npm ci

# (opcional) ELIMINAR LAS DEPENDENCIAS DE DESARROLLO - DevDependencies
RUN npm prune --production


# 2da ETAPA -> Generar la imagen limpia lista para ser un contenedor

#Generamos la base
FROM node:22-alpine AS runner

#Crear carpeta dentro del contenedor para los archivos
WORKDIR /app

#Copiamos de la imagen anterior (etapa 1) la carpeta node_modules sin las devDep
COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY app.js ./

#Exponer el puerto directamente desde el Dockerfile
EXPOSE 3050

CMD ["node","app.js"]