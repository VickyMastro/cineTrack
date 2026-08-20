# CineTrack — Actions API Reference

**Base URL:** `https://xgwmburyugpqojvrszim.supabase.co/rest/v1`

**Headers requeridos en todos los endpoints:**

```
apikey: <VITE_SUPABASE_ANON_KEY>
Content-Type: application/json
Authorization: Bearer <access_token>
```

> La tabla `user_content` tiene RLS activado. **Todos los endpoints requieren** el header `Authorization: Bearer <access_token>` (el JWT del usuario autenticado). Sin él, Supabase devuelve `401`.

---

## user_content — Tabla unificada de acciones del usuario

Reemplaza las antiguas tablas `favorites` y `bookmarks`. Todas las acciones del usuario (favorito, marcador, visto) se almacenan aquí con una columna `action`.

| `action` | Descripción |
|---|---|
| `'favorite'` | El usuario marcó el contenido como favorito (corazón) |
| `'bookmark'` | El usuario guardó el contenido para ver después (marcador) |
| `'watched'` | El usuario marcó el contenido como ya visto (ojo) |

---

## GET `/user_content?user_id=eq.{uid}&select=content_id,action` — Cargar todas las acciones

Una sola request al iniciar sesión para obtener el estado completo del usuario.

```http
GET /rest/v1/user_content?user_id=eq.{uid}&select=content_id,action
```

**Response `200 OK`**

```json
[
  { "content_id": 124364, "action": "favorite" },
  { "content_id": 1399,   "action": "bookmark" },
  { "content_id": 76479,  "action": "favorite" },
  { "content_id": 76479,  "action": "watched"  }
]
```

> Un mismo `content_id` puede tener múltiples `action` distintas (el `UNIQUE` es sobre `(user_id, content_id, action)`).

---

## GET `/user_content?user_id=eq.{uid}&action=eq.{action}&select=content_id,action` — Filtrar por acción

```http
GET /rest/v1/user_content?user_id=eq.{uid}&action=eq.favorite&select=content_id
```

---

## GET `/user_content?user_id=eq.{uid}&select=*,content(*)` — Acciones con datos del contenido

```http
GET /rest/v1/user_content?user_id=eq.{uid}&action=eq.favorite&select=*,content(*)
```

**Response `200 OK`**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "content_id": 124364,
    "action": "favorite",
    "created_at": "2026-07-03T12:00:00Z",
    "content": {
      "id": 124364,
      "type": "serie",
      "title": "FROM",
      "poster_path": "/pRtJagIxpfODzzb0T0NAvZSzErC.jpg",
      "release_date": "2022-02-20",
      "vote_average": 8.5,
      "backdrop_path": "/m7eiSGHFzr584zFmetGqkqaU6BN.jpg"
    }
  }
]
```

---

## POST `/user_content` — Agregar una acción

```http
POST /rest/v1/user_content
```

**Body**

```json
{
  "user_id": "{uid}",
  "content_id": 124364,
  "action": "favorite"
}
```

**Response `201 Created`** — Sin body.

> Si el par `(user_id, content_id, action)` ya existe, Supabase devuelve `409 Conflict`.

---

## DELETE `/user_content?user_id=eq.{uid}&content_id=eq.{id}&action=eq.{action}` — Quitar una acción

```http
DELETE /rest/v1/user_content?user_id=eq.{uid}&content_id=eq.{id}&action=eq.favorite
```

**Response `200 OK`** — Sin body.

---

## Flujo recomendado al iniciar sesión

1. `GET /user_content?user_id=eq.{uid}&select=content_id,action`
2. Separar en tres Sets en el store:
```js
favoriteIds = new Set(data.filter(r => r.action === 'favorite').map(r => r.content_id))
bookmarkIds = new Set(data.filter(r => r.action === 'bookmark').map(r => r.content_id))
watchedIds  = new Set(data.filter(r => r.action === 'watched').map(r => r.content_id))
```
3. Para saber si aplica: `favoriteIds.has(movie.id)`, `bookmarkIds.has(movie.id)`, etc.
4. Al hacer toggle:
   - Si el Set tiene el ID → `DELETE` + `Set.delete(movie.id)`
   - Si no lo tiene → `POST` + `Set.add(movie.id)`

---

## Tabla de referencia rápida

| Acción | Método | Endpoint |
|---|---|---|
| Cargar todas las acciones | `GET` | `/rest/v1/user_content?user_id=eq.{uid}&select=content_id,action` |
| Filtrar por acción | `GET` | `/rest/v1/user_content?user_id=eq.{uid}&action=eq.{action}&select=content_id` |
| Con datos del contenido | `GET` | `/rest/v1/user_content?user_id=eq.{uid}&action=eq.{action}&select=*,content(*)` |
| Agregar acción | `POST` | `/rest/v1/user_content` |
| Quitar acción | `DELETE` | `/rest/v1/user_content?user_id=eq.{uid}&content_id=eq.{id}&action=eq.{action}` |
