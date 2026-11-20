# Graph Report - frontend-restaurante  (2026-11-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 202 nodes · 439 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa56a518`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AdminPlatos.tsx
- AdminPedidos.tsx
- package.json
- AdminDashboard.tsx
- AuthProvider.tsx
- Plato
- compilerOptions
- platos.service.ts
- env.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Plato` - 15 edges
3. `react` - 15 edges
4. `Categoria` - 11 edges
5. `AdminPedidos()` - 11 edges
6. `apiRequest()` - 10 edges
7. `ApiError` - 9 edges
8. `useAuth()` - 9 edges
9. `next` - 9 edges
10. `AdminCategorias()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `MenuCategoria` --inherits--> `Categoria`  [EXTRACTED]
  src/features/menu/types/index.ts → src/features/categorias/types/index.ts
- `Plato` --references--> `Categoria`  [EXTRACTED]
  src/features/platos/types/index.ts → src/features/categorias/types/index.ts
- `PedidoItem` --references--> `Plato`  [EXTRACTED]
  src/features/pedidos/types/index.ts → src/features/platos/types/index.ts
- `AdminCategoriasPage()` --calls--> `AdminCategorias()`  [EXTRACTED]
  src/app/admin/categorias/page.tsx → src/features/admin/components/AdminCategorias.tsx
- `AdminPlatosPage()` --calls--> `AdminPlatos()`  [EXTRACTED]
  src/app/admin/platos/page.tsx → src/features/admin/components/AdminPlatos.tsx

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "AdminPlatos.tsx"
Cohesion: 0.13
Nodes (17): react, AdminCategoriasPage(), instant, AdminPlatosPage(), instant, AdminCategorias(), AdminPlatos(), CategoriaForm() (+9 more)

### Community 1 - "AdminPedidos.tsx"
Cohesion: 0.12
Nodes (16): AdminPedidosPage(), instant, AdminPedidos(), formatPrice(), PedidoDetailModal(), colors, PedidoEstadoBadge(), PedidoForm() (+8 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (31): eslintConfig, dependencies, next@16.4.6, react@19.3.0, react-dom@19.3.0, devDependencies, eslint@^9, eslint-config-next@16.4.6 (+23 more)

### Community 3 - "AdminDashboard.tsx"
Cohesion: 0.16
Nodes (12): nextConfig, next, AdminLayout(), navItems, AdminPage(), instant, LoginPage(), AdminDashboard() (+4 more)

### Community 4 - "AuthProvider.tsx"
Cohesion: 0.19
Nodes (13): geistMono, geistSans, metadata, RootLayout(), Providers(), AuthContext, AuthContextValue, AuthProvider() (+5 more)

### Community 5 - "Plato"
Cohesion: 0.20
Nodes (13): MenuPage(), Home(), metadata, formatPrice(), HomeView(), formatPrice(), MenuView(), PlatoCard() (+5 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "platos.service.ts"
Cohesion: 0.20
Nodes (12): MenuPlatosParams, PlatosListParams, API_BASE_URL, apiRequest(), buildUrl(), RequestOptions, clearToken(), getToken() (+4 more)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `AdminPlatos.tsx` to `AdminPedidos.tsx`, `package.json`, `AdminDashboard.tsx`, `AuthProvider.tsx`, `Plato`?**
  _High betweenness centrality (0.302) - this node is a cross-community bridge._
- **Should `AdminPlatos.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Why does `next` connect `AdminDashboard.tsx` to `package.json`, `AuthProvider.tsx`, `Plato`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `AdminPedidos.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._
- **Why does `AdminPedidos()` connect `AdminPedidos.tsx` to `AdminDashboard.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07954545454545454 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._