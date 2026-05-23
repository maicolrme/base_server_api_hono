# Hono API Server

API REST con **Hono.js** + **Prisma ORM** + **PostgreSQL** + **JWT**, migrada desde Laravel.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Hono](https://hono.dev) |
| ORM | [Prisma](https://prisma.io) |
| DB | PostgreSQL (Supabase) |
| Auth | JWT (`hono/jwt`) |
| Validación | [Zod](https://zod.dev) + `@hono/zod-openapi` |
| Docs | Swagger UI (`@hono/swagger-ui`) |
| Runtime | Node.js / tsx |

## Estructura

```
src/
├── index.ts              App + Swagger + home + middleware global
├── server.ts             Entry point Node.js (serve)
├── db.ts                 PrismaClient + adapter Pg
├── routes/
│   └── index.ts          Definición de rutas (createRoute + app.openapi)
├── controllers/          Manejo de request/response
│   ├── auth.ts           register, login, me
│   ├── item.ts           CRUD items
│   ├── user.ts           CRUD users
│   └── notification.ts   FCM push
├── services/             Lógica de negocio
│   ├── auth.ts           hash, JWT, errores custom
│   ├── item.ts
│   ├── user.ts
│   └── notification.ts   FCM accessToken + HTTP v1
├── models/               Queries Prisma (sin lógica)
│   ├── user.ts
│   └── item.ts
├── middleware/
│   └── auth.ts           JWT verification (hono/jwt)
├── lib/
│   └── schemas.ts        Zod + OpenAPI metadata
└── generated/            Prisma client (auto-generado)
```

Flujo: `Route → Controller → Service → Model → DB`

## Requisitos

- Node.js ≥ 18
- PostgreSQL (DATABASE_URL en `.env`)

## Instalación

```bash
npm install
npx prisma generate
```

## Variables de entorno (`.env`)

```env
DATABASE_URL="postgresql://..."
PORT=3001
JWT_SECRET="supersecret-key"
FCM_DEVICE_TOKEN="optional-fcm-token"
GOOGLE_APPLICATION_CREDENTIALS="path/to/firebase-key.json"
```

## Scripts

```bash
npm run dev          # Desarrollo con hot-reload
npm run start        # Producción
npm run build        # Compilar TypeScript
npm run db:generate  # Regenerar Prisma client
npm run db:studio    # Prisma Studio (GUI)
```

## API Endpoints

### Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/auth/me` | Sí | Usuario autenticado |

### Items

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/items` | No | Listar items |
| GET | `/items/:id` | Sí | Obtener item |
| POST | `/items` | Sí | Crear item |
| PUT | `/items/:id` | Sí | Actualizar item |
| DELETE | `/items/:id` | Sí | Eliminar item |

### Users

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/users` | Sí | Listar usuarios |
| GET | `/users/:id` | Sí | Obtener usuario |
| POST | `/users` | Sí | Crear usuario |
| PUT | `/users/:id` | Sí | Actualizar usuario |
| DELETE | `/users/:id` | Sí | Eliminar usuario |

### Notifications

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/notifications/send` | Sí | Enviar push FCM |
| POST | `/notifications/test` | Sí | Test notification |
| POST | `/notifications/register-token` | Sí | Registrar device token |

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Home page |
| GET | `/health` | Health check |
| GET | `/ui` | Swagger UI |
| GET | `/doc` | OpenAPI JSON |

## Autenticación

Usa JWT Bearer token. Incluí el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login o registrar. En Swagger UI (`/ui`) usá el botón **Authorize** y pegá el token.

## Cómo agregar un endpoint nuevo

1. **Schema** en `lib/schemas.ts` — Zod + `.openapi()`
2. **Model** en `models/` — query Prisma si hace falta
3. **Service** en `services/` — lógica de negocio
4. **Controller** en `controllers/` — handler (parse input → service → response)
5. **Route** en `routes/index.ts` — `app.openapi(createRoute({...}), controller.handler)`
6. **Middleware** en `index.ts` si necesita auth
