<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — frontend-restaurante

Guía para agentes de código que trabajan en este repositorio. Léela antes de tocar cualquier archivo.

## 1. Proyecto

- **Nombre:** `frontend-restaurante`
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · ESLint 9
- **Gestor de paquetes:** npm
- **Directorio de trabajo:** `C:\xampp\htdocs\Bootcamp-FSJ35\frontend-restaurante`
- **Alias de imports:** `@/*` → `src/*`

## 2. Arquitectura: Feature-Based

Este proyecto sigue **arquitectura por features (feature-based / feature-sliced ligero)**. La regla de oro:

> **El código se organiza por funcionalidad de negocio, no por tipo técnico.** Cada feature es un módulo autocontenido con su propia UI, lógica, tipos y acceso a datos.

### 2.1 Estructura de carpetas

```
src/
├── app/                    # Next.js App Router (rutas, layouts, pages)
│   ├── (auth)/             # route groups
│   ├── (dashboard)/
│   ├── layout.tsx
│   └── page.tsx
├── features/               # Módulos de negocio (uno por feature)
│   └── <feature>/
│       ├── components/     # Componentes específicos del feature
│       ├── hooks/          # Hooks específicos del feature
│       ├── services/       # Llamadas a API / data fetching
│       ├── types/          # Tipos e interfaces del feature
│       ├── utils/          # Utilidades del feature
│       ├── constants/      # Constantes del feature
│       └── index.ts        # Barrel: única entrada pública del feature
├── shared/                 # Código compartido entre features
│   ├── components/         # Componentes genéricos reutilizables
│   │   └── ui/             # Primitivos de UI (Button, Input, Modal…)
│   ├── hooks/              # Hooks genéricos
│   ├── lib/                # Clientes, helpers, configuración
│   ├── types/              # Tipos globales compartidos
│   └── constants/
├── core/                   # Infraestructura de la app
│   ├── providers/          # Context providers (Theme, Auth, Query…)
│   ├── config/             # Variables de entorno tipadas, config
│   └── styles/             # Estilos globales adicionales
└── middleware.ts           # (si aplica)
```

### 2.2 Reglas de dependencias (críticas)

- `app/` **solo orquesta**: importa features vía su `index.ts` y compone. No contiene lógica de negocio.
- Un feature **puede** importar de `shared/` y `core/`.
- Un feature **NO puede** importar de otro feature directamente. Si necesitan compartir algo, promuévelo a `shared/` o expónlo por el barrel y consúmelo como dependencia declarada (evitar; preferir `shared/`).
- `shared/` **NO puede** importar de `features/` ni de `app/`.
- `core/` **NO puede** importar de `features/`.
- Las importaciones entre features a través de barrels están permitidas solo cuando el feature A expone explícitamente una API pública y el acoplamiento es intencional y documentado.

### 2.3 Barrel exports

Cada feature expone **únicamente** lo que otros módulos necesitan a través de `features/<feature>/index.ts`. Importar rutas internas de otro feature (deep imports) está prohibido.

```ts
// ✅ Correcto
import { MenuCard, useMenu } from "@/features/menu";

// ❌ Prohibido
import { MenuCard } from "@/features/menu/components/MenuCard";
```

### 2.4 Nombrado de archivos

- Componentes: `PascalCase.tsx` (ej. `MenuCard.tsx`).
- Hooks: `camelCase.ts` con prefijo `use` (ej. `useMenu.ts`).
- Servicios: `camelCase.service.ts` (ej. `menu.service.ts`).
- Tipos: `camelCase.types.ts` o `types.ts` dentro de `types/`.
- Utilidades: `camelCase.ts`.
- Archivos de Next (`page`, `layout`, `loading`, `error`, `not-found`, `route`): minúsculas, según convención de Next.
- Un componente por archivo; el nombre del archivo = nombre del componente.

### 2.5 Server vs Client Components

- Por defecto los componentes son **Server Components**. Solo añade `"use client"` cuando se necesite interactividad, hooks de React o APIs del navegador.
- La lógica de datos vive en `services/` y se consume desde Server Components o hooks (`hooks/`) en Client Components.
- No mezclar fetching de datos con UI: los servicios devuelven datos tipados; los componentes los renderizan.

### 2.6 Data fetching

- Llamadas HTTP centralizadas en `features/<feature>/services/`.
- Cliente HTTP compartido en `shared/lib/` (ej. `apiClient.ts`).
- Tipar request/response en `features/<feature>/types/`.
- Preferir Server Components + fetch con cache/revalidate cuando sea posible; usar React Query/SWR solo si se añade como dependencia (no está instalado por defecto).

### 2.7 Estilos

- Tailwind CSS 4 (configuración en `globals.css` con `@theme`).
- Clases utilitarias en JSX; evitar CSS custom salvo casos justificados.
- Componentes de UI primitivos en `shared/components/ui/` con variantes (usar `cva` si se añade).
- No usar estilos inline salvo valores dinámicos.

### 2.8 TypeScript

- `strict: true` (ya configurado). No usar `any`; preferir `unknown` + narrowing.
- Definir tipos en `types/` del feature; no duplicar tipos entre features (promover a `shared/types/`).
- Exportar tipos desde el barrel del feature cuando sean parte de la API pública.

### 2.9 Linting y formato

- Ejecutar `npm run lint` antes de finalizar cambios.
- Respetar la config de ESLint (`eslint.config.mjs`).
- No deshabilitar reglas con `eslint-disable` salvo justificación en comentario.

### 2.10 Testing (cuando se añada)

- Tests junto al código: `*.test.ts(x)` en la misma carpeta.
- Tests de features no deben importar internals de otros features.

## 3. Comandos

```bash
npm run dev      # desarrollo (http://localhost:3000)
npm run build    # build de producción
npm run start    # servir build
npm run lint     # lint
```

## 4. Reglas para agentes (DO / DON'T)

**DO**
- Leer `node_modules/next/dist/docs/` antes de usar APIs de Next 16 (breaking changes).
- Crear features nuevas bajo `src/features/<nombre>/` con su barrel `index.ts`.
- Mantener `app/` delgado: rutas → importan features.
- Tipar todo; usar alias `@/`.
- Reutilizar primitivos de `shared/components/ui/`.

**DON'T**
- No poner lógica de negocio en `app/`.
- No hacer deep imports entre features.
- No importar `features/` desde `shared/` o `core/`.
- No añadir dependencias sin justificación.
- No modificar el bloque `nextjs-agent-rules` del AGENTS.md (es regenerado por Next).

## 5. Flujo para añadir un feature nuevo

1. Crear `src/features/<feature>/` con subcarpetas (`components`, `hooks`, `services`, `types`).
2. Implementar servicios tipados.
3. Crear componentes (Server por defecto).
4. Exportar API pública en `index.ts`.
5. Consumir desde `app/<ruta>/page.tsx`.
6. Actualizar este documento si se añaden convenciones nuevas.

---

> Mantén este archivo actualizado cuando cambien convenciones o se añadan features importantes.
