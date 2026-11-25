# Graph Report - chatgrupal  (2026-11-25)

## Corpus Check
- Corpus is ~13,644 words - fits in a single context window. You may not need a graph.

## Summary
- 341 nodes · 511 edges · 27 communities (9 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Database Migrations
- Chat Domain Models
- Composer Dependencies
- API Controllers
- Chat Architecture
- Form Requests
- Frontend Tooling
- Database Seeders
- Config and Factories
- Realtime Broadcasting
- App Bootstrap
- Composer Config
- Service Providers
- Feature Tests
- Unit Tests

## God Nodes (most connected - your core abstractions)
1. `User` - 20 edges
2. `Chat` - 19 edges
3. `ChatGrupal application` - 17 edges
4. `Message` - 11 edges
5. `ProfileController` - 10 edges
6. `Profile` - 10 edges
7. `Controller` - 9 edges
8. `MessageSent` - 8 edges
9. `ChatController` - 8 edges
10. `MessageController` - 8 edges

## Surprising Connections (you probably didn't know these)
- `{closure#1}()` --references--> `Chat`  [EXTRACTED]
  database/seeders/ChatSeeder.php → app/Models/Chat.php
- `robots.txt (allow all)` --describes_crawl_policy_for--> `ChatGrupal application`  [EXTRACTED]
  public/robots.txt → AGENTS.md
- `ChatGrupal application` --implements--> `Real-time chat`  [EXTRACTED]
  AGENTS.md → README.md
- `Message model` --emits--> `MessageSent event`  [INFERRED]
  AGENTS.md → README.md
- `REST API /api` --includes--> `POST /api/login`  [EXTRACTED]
  AGENTS.md → README.md

## Import Cycles
- None detected.

## Communities (27 total, 18 thin omitted)

### Community 0 - "Database Migrations"
Cohesion: 0.08
Nodes (15): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}() (+7 more)

### Community 1 - "Chat Domain Models"
Cohesion: 0.09
Nodes (7): Chat, Message, Profile, User, ChatFactory, MessageFactory, ProfileFactory

### Community 2 - "Composer Dependencies"
Cohesion: 0.05
Nodes (41): autoload, autoload-dev, psr-4, psr-4, dev-master, description, extra, branch-alias (+33 more)

### Community 3 - "API Controllers"
Cohesion: 0.12
Nodes (5): AuthController, ChatController, MessageController, ProfileController, Controller

### Community 4 - "Chat Architecture"
Cohesion: 0.08
Nodes (29): AdminUserSeeder, chat.{id} private channel, Chat model, chat_user pivot table, ChatGrupal application, GET/POST/PUT/DELETE /api/chats, Eloquent ORM, Form Requests (+21 more)

### Community 5 - "Form Requests"
Cohesion: 0.09
Nodes (6): StoreChatRequest, StoreMessageRequest, StoreProfileRequest, UpdateChatRequest, UpdateMessageRequest, UpdateProfileRequest

### Community 6 - "Frontend Tooling"
Cohesion: 0.11
Nodes (18): devDependencies, axios@^1.7.4, concurrently@^9.0.1, laravel-vite-plugin@^1.2.0, tailwindcss@^4.0.0, @tailwindcss/vite@^4.0.0, vite@^6.0.11, private (+10 more)

### Community 7 - "Database Seeders"
Cohesion: 0.13
Nodes (7): AdminUserSeeder, ChatSeeder, {closure#1}(), DatabaseSeeder, MessageSeeder, ProfileSeeder, RandomUserSeeder

### Community 11 - "Composer Config"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

## Knowledge Gaps
- **19 isolated node(s):** `Laravel 12`, `PHP 8.2+`, `SQLite`, `Eloquent ORM`, `Form Requests` (+14 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 144 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Chat` connect `Chat Domain Models` to `API Controllers`, `Form Requests`, `Database Seeders`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `Laravel 12`, `PHP 8.2+`, `SQLite` to the rest of the system?**
  _19 weakly-connected nodes found - possible missing edges._
- **Should `Database Migrations` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._
- **Why does `User` connect `Chat Domain Models` to `Config and Factories`, `API Controllers`, `Database Seeders`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `Chat Domain Models` be split into smaller, more focused modules?**
  _Cohesion score 0.08826945412311266 - nodes in this community are weakly interconnected._
- **Why does `ChatGrupal application` connect `Chat Architecture` to `Composer Dependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Composer Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._