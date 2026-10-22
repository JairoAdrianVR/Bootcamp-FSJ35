# -----------------------------------------------------------
# Etapa 1: Base & Dependencias
# -----------------------------------------------------------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile no encontrado." && exit 1; \
  fi

# -----------------------------------------------------------
# Etapa 2: Builder
# -----------------------------------------------------------
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# SOLO PARA LOS QUE TIENEN VARIABLES EN UN .ENV
#ARG NEXT_PUBLIC_SUPABASE_URL = "aca_Va_mi_URL"

RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else npm run build; \
  fi

# -----------------------------------------------------------
# Etapa 3: Runner (Entorno de ejecución final en producción)
# -----------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear capa de seguridad a traves de un nuevo usuario con privilegios reducidos
# Solo va a poder ejecutar node server.js y crear carpetas y archivos basicos.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos la carpeta public desde el builder
COPY --from=builder /app/public ./public

# Creamos la carpeta .next en el contenedor
RUN mkdir .next
# Le damos permiso al usuario nextjs del grupo nodejs a la carpeta .next lectura y escritura SOLO a esa carpeta
RUN chown nextjs:nodejs .next

# Copiamos del builder la carpeta standalone y la dejamos en /APP
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copiamos del builder la carpeta static y la dejamos en /APP/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Eligimos el usuario configurado para levantar el proyecto
USER nextjs

# Avisa a docker y al sv que el puerto para recibir peticiones es el 3000
EXPOSE 3000

CMD ["node", "server.js"]