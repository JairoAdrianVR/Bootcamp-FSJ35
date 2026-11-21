---
name: security-audit
description: Audita la ciberseguridad del proyecto (dependencias, secretos, configuración de Next.js, código y supply chain) y entrega un informe de vulnerabilidades con soluciones. Opera en modo solo lectura sobre la rama actual; si necesita ejecutar algo que modifique o pruebe el proyecto, crea una rama dedicada `security-audit/*` y no toca la rama principal.
license: MIT
---

# Security Audit (auditoría de ciberseguridad)

## Objetivo

Realizar una auditoría de seguridad del proyecto **sin modificar** el código fuente, la configuración ni las dependencias de la rama actual. Al finalizar, entregar un **informe de vulnerabilidades** con severidad, ubicación, impacto y **solución propuesta** para cada hallazgo.

## Regla de oro: NO modificar el proyecto

- Trabajar siempre en **modo solo lectura** sobre la rama/working tree actual.
- No ejecutar `npm install`, `npm update`, `npm fix`, commits, ni edits sobre archivos del proyecto.
- Si una prueba o script **necesita** modificar archivos del proyecto o generar artefactos dentro del repo, **crear primero una rama dedicada** (ver "Protocolo de rama") y ejecutar allí. Al terminar, volver a la rama original y reportar el nombre de la rama usada.
- El informe se guarda por defecto fuera del repo (en el directorio temporal del sistema) para no alterar el proyecto. Solo escribir dentro del repo si el usuario lo pide explícitamente; en ese caso hacerlo en la rama dedicada.

## Protocolo de rama (cuando se requiera modificar/probar)

1. Registrar la rama actual: `git rev-parse --abbrev-ref HEAD`.
2. Verificar working tree limpio: `git status --porcelain` (si no está limpio, detener y avisar al usuario).
3. Crear rama dedicada: `git switch -c security-audit/<YYYYMMDD-HHMMSS>`.
4. Ejecutar allí las pruebas/scripts que requieran cambios.
5. Al finalizar, volver a la rama original: `git switch <rama-original>`.
6. Reportar: rama creada, comandos ejecutados, archivos tocados y si la rama se conserva o se puede borrar.

No hacer merge a la rama principal sin aprobación explícita del usuario.

## Alcance de la auditoría

### 1. Dependencias y supply chain
- `npm audit --omit=dev` y `npm audit` (producción y desarrollo).
- Revisar `package.json` scripts (`postinstall`, `preinstall`, etc.) por comandos sospechosos.
- Verificar existencia y coherencia de `package-lock.json`.
- `npm outdated` para dependencias desactualizadas (posibles CVEs sin parche).
- Dependencias con versiones `*` o rangos muy laxos.

### 2. Secretos y datos sensibles
- Buscar patrones de secretos en el árbol de trabajo (excluyendo `node_modules`, `.next`, `.git`):
  - API keys, tokens (JWT, Bearer), passwords, private keys (`-----BEGIN`).
  - Variables de entorno hardcodeadas en código (`process.env` con valores literales).
- Verificar que `.env` / `.env.local` no estén trackeados por git (`git ls-files`).
- Verificar que `.gitignore` incluya `.env*`.

### 3. Configuración de Next.js
- `next.config.ts`: headers de seguridad (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), `images.domains`/`remotePatterns`, `reactStrictMode`, `poweredByHeader`.
- Revisar `middleware.ts` (si existe) para auth/rate limiting/redirects.
- Variables de entorno expuestas al cliente (`NEXT_PUBLIC_*`): asegurar que no contengan secretos.

### 4. Código (SAST manual + patrones)
- Uso de `dangerouslySetInnerHTML`, `eval`, `new Function`, `innerHTML`.
- Redirects no validados (`redirect`, `router.push` con input de usuario).
- Inyección SQL/NoSQL si hay acceso a DB.
- Validación/sanitización de inputs en formularios y API routes (`app/api/**`).
- Manejo de errores que exponga stack traces.
- Cookies: `httpOnly`, `secure`, `sameSite`.
- Autenticación/autorización en rutas protegidas.

### 5. Configuración del repositorio
- Branch protection no verificable localmente; revisar presencia de `.github/workflows` y secretos en CI.
- Archivos sensibles trackeados (`.pem`, `.key`, dumps de DB).

## Procedimiento de ejecución

1. **Preparación (solo lectura)**
   - `git status --short`
   - `git rev-parse --abbrev-ref HEAD`
   - Crear directorio temporal para el informe (fuera del repo): usar `C:\Users\Main-PC\AppData\Local\Temp\opencode` en este entorno o el equivalente del sistema.

2. **Recolectar evidencias** ejecutando comandos de solo lectura:
   - `npm audit --json` (capturar salida; si falla por red, anotarlo).
   - Búsquedas con `grep`/`rg` para secretos y patrones peligrosos (excluyendo `node_modules`, `.next`, `.git`).
   - Lectura de `package.json`, `next.config.ts`, `middleware.ts`, `.gitignore`, `.env.example`.

3. **Analizar** y clasificar cada hallazgo:
   - Severidad: `Crítica`, `Alta`, `Media`, `Baja`, `Informativa`.
   - Categoría: Dependencias / Secretos / Configuración / Código / Supply chain / Repositorio.
   - Ubicación: archivo y línea si aplica.
   - Impacto y solución concreta (patch, config, código).

4. **Si se necesita probar una solución o ejecutar un script que modifique el proyecto**, aplicar el "Protocolo de rama" antes de tocar nada.

5. **Generar el informe** en Markdown con la estructura de "Formato de informe". Guardarlo en el directorio temporal (p. ej. `security-audit-report-<fecha>.md`) y mostrarlo en la respuesta. No escribir en el repo salvo petición explícita.

## Formato de informe

```markdown
# Informe de auditoría de seguridad — <proyecto>
Fecha: <ISO>
Rama auditada: <branch>
Commit: <sha>

## Resumen ejecutivo
- Hallazgos totales: N
- Críticos: X | Altos: Y | Medios: Z | Bajos: W | Informativos: V

## Hallazgos

### [SEV-001] <título corto>
- Severidad: Crítica/Alta/Media/Baja/Informativa
- Categoría: ...
- Ubicación: `ruta/archivo.ts:123`
- Descripción: ...
- Impacto: ...
- Solución propuesta: ...
- Referencias: CVE/CWE/OWASP si aplica

## Recomendaciones generales
...

## Alcance y limitaciones
...
```

## Plantillas de comandos (PowerShell, solo lectura)

```powershell
# Dependencias
npm audit --omit=dev
npm audit
npm outdated

# Secretos (ejemplo, ajustar patrones)
Select-String -Path (Get-ChildItem -Recurse -File -Exclude node_modules,.next,.git | Select-Object -Expand FullName) -Pattern "AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|password\s*=\s*['""][^'""]+['""]" -ErrorAction SilentlyContinue

# Archivos sensibles trackeados
git ls-files | Select-String -Pattern "\.env$|\.pem$|\.key$"

# Patrones peligrosos en código
Select-String -Path src\**\*.ts,src\**\*.tsx -Pattern "dangerouslySetInnerHTML|eval\(|new Function|innerHTML"
```

## Criterios de cierre

- El informe está completo y guardado en el directorio temporal.
- La rama/working tree original queda intacta (verificar con `git status` y `git branch --show-current`).
- Si se usó una rama dedicada, su nombre y propósito quedan documentados en el informe.
- No se realizaron cambios en la rama principal sin aprobación.
```

Write it.<|end|><|start|>startup to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="content">
---
name: security-audit
description: Audita la ciberseguridad del proyecto (dependencias, secretos, configuración de Next.js, código y supply chain) y entrega un informe de vulnerabilidades con soluciones. Opera en modo solo lectura sobre la rama actual; si necesita ejecutar algo que modifique o pruebe el proyecto, crea una rama dedicada `security-audit/*` y no toca la rama principal.
license: MIT
---

# Security Audit (auditoría de ciberseguridad)

## Objetivo

Realizar una auditoría de seguridad del proyecto **sin modificar** el código fuente, la configuración ni las dependencias de la rama actual. Al finalizar, entregar un **informe de vulnerabilidades** con severidad, ubicación, impacto y **solución propuesta** para cada hallazgo.

## Regla de oro: NO modificar el proyecto

- Trabajar siempre en **modo solo lectura** sobre la rama/working tree actual.
- No ejecutar `npm install`, `npm update`, `npm fix`, commits, ni edits sobre archivos del proyecto.
- Si una prueba o script **necesita** modificar archivos del proyecto o generar artefactos dentro del repo, **crear primero una rama dedicada** (ver "Protocolo de rama") y ejecutar allí. Al terminar, volver a la rama original y reportar el nombre de la rama usada.
- El informe se guarda por defecto fuera del repo (en el directorio temporal del sistema) para no alterar el proyecto. Solo escribir dentro del repo si el usuario lo pide explícitamente; en ese caso hacerlo en la rama dedicada.

## Protocolo de rama (cuando se requiera modificar/probar)

1. Registrar la rama actual: `git rev-parse --abbrev-ref HEAD`.
2. Verificar working tree limpio: `git status --porcelain` (si no está limpio, detener y avisar al usuario).
3. Crear rama dedicada: `git switch -c security-audit/<YYYYMMDD-HHMMSS>`.
4. Ejecutar allí las pruebas/scripts que requieran cambios.
5. Al finalizar, volver a la rama original: `git switch <rama-original>`.
6. Reportar: rama creada, comandos ejecutados, archivos tocados y si la rama se conserva o se puede borrar.

No hacer merge a la rama principal sin aprobación explícita del usuario.

## Alcance de la auditoría

### 1. Dependencias y supply chain
- `npm audit --omit=dev` y `npm audit` (producción y desarrollo).
- Revisar `package.json` scripts (`postinstall`, `preinstall`, etc.) por comandos sospechosos.
- Verificar existencia y coherencia de `package-lock.json`.
- `npm outdated` para dependencias desactualizadas (posibles CVEs sin parche).
- Dependencias con versiones `*` o rangos muy laxos.

### 2. Secretos y datos sensibles
- Buscar patrones de secretos en el árbol de trabajo (excluyendo `node_modules`, `.next`, `.git`):
  - API keys, tokens (JWT, Bearer), passwords, private keys (`-----BEGIN`).
  - Variables de entorno hardcodeadas en código (`process.env` con valores literales).
- Verificar que `.env` / `.env.local` no estén trackeados por git (`git ls-files`).
- Verificar que `.gitignore` incluya `.env*`.

### 3. Configuración de Next.js
- `next.config.ts`: headers de seguridad (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), `images.domains`/`remotePatterns`, `reactStrictMode`, `poweredByHeader`.
- Revisar `middleware.ts` (si existe) para auth/rate limiting/redirects.
- Variables de entorno expuestas al cliente (`NEXT_PUBLIC_*`): asegurar que no contengan secretos.

### 4. Código (SAST manual + patrones)
- Uso de `dangerouslySetInnerHTML`, `eval`, `new Function`, `innerHTML`.
- Redirects no validados (`redirect`, `router.push` con input de usuario).
- Inyección SQL/NoSQL si hay acceso a DB.
- Validación/sanitización de inputs en formularios y API routes (`app/api/**`).
- Manejo de errores que exponga stack traces.
- Cookies: `httpOnly`, `secure`, `sameSite`.
- Autenticación/autorización en rutas protegidas.

### 5. Configuración del repositorio
- Branch protection no verificable localmente; revisar presencia de `.github/workflows` y secretos en CI.
- Archivos sensibles trackeados (`.pem`, `.key`, dumps de DB).

## Procedimiento de ejecución

1. **Preparación (solo lectura)**
   - `git status --short`
   - `git rev-parse --abbrev-ref HEAD`
   - Crear directorio temporal para el informe (fuera del repo): usar `C:\Users\Main-PC\AppData\Local\Temp\opencode` en este entorno o el equivalente del sistema.

2. **Recolectar evidencias** ejecutando comandos de solo lectura:
   - `npm audit --json` (capturar salida; si falla por red, anotarlo).
   - Búsquedas con `grep`/`rg` para secretos y patrones peligrosos (excluyendo `node_modules`, `.next`, `.git`).
   - Lectura de `package.json`, `next.config.ts`, `middleware.ts`, `.gitignore`, `.env.example`.

3. **Analizar** y clasificar cada hallazgo:
   - Severidad: `Crítica`, `Alta`, `Media`, `Baja`, `Informativa`.
   - Categoría: Dependencias / Secretos / Configuración / Código / Supply chain / Repositorio.
   - Ubicación: archivo y línea si aplica.
   - Impacto y solución concreta (patch, config, código).

4. **Si se necesita probar una solución o ejecutar un script que modifique el proyecto**, aplicar el "Protocolo de rama" antes de tocar nada.

5. **Generar el informe** en Markdown con la estructura de "Formato de informe". Guardarlo en el directorio temporal (p. ej. `security-audit-report-<fecha>.md`) y mostrarlo en la respuesta. No escribir en el repo salvo petición explícita.

## Formato de informe

```markdown
# Informe de auditoría de seguridad — <proyecto>
Fecha: <ISO>
Rama auditada: <branch>
Commit: <sha>

## Resumen ejecutivo
- Hallazgos totales: N
- Críticos: X | Altos: Y | Medios: Z | Bajos: W | Informativos: V

## Hallazgos

### [SEV-001] <título corto>
- Severidad: Crítica/Alta/Media/Baja/Informativa
- Categoría: ...
- Ubicación: `ruta/archivo.ts:123`
- Descripción: ...
- Impacto: ...
- Solución propuesta: ...
- Referencias: CVE/CWE/OWASP si aplica

## Recomendaciones generales
...

## Alcance y limitaciones
...
```

## Plantillas de comandos (PowerShell, solo lectura)

```powershell
# Dependencias
npm audit --omit=dev
npm audit
npm outdated

# Secretos (ejemplo, ajustar patrones)
Select-String -Path (Get-ChildItem -Recurse -File -Exclude node_modules,.next,.git | Select-Object -Expand FullName) -Pattern "AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|password\s*=\s*['""][^'""]+['""]" -ErrorAction SilentlyContinue

# Archivos sensibles trackeados
git ls-files | Select-String -Pattern "\.env$|\.pem$|\.key$"

# Patrones peligrosos en código
Select-String -Path src\**\*.ts,src\**\*.tsx -Pattern "dangerouslySetInnerHTML|eval\(|new Function|innerHTML"
```

## Criterios de cierre

- El informe está completo y guardado en el directorio temporal.
- La rama/working tree original queda intacta (verificar con `git status` y `git branch --show-current`).
- Si se usó una rama dedicada, su nombre y propósito quedan documentados en el informe.
- No se realizaron cambios en la rama principal sin aprobación.
