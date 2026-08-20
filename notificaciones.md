# CineTrack — Notificaciones y errores de API

Los `if` van en la **store** (identifican el error y hacen `throw new Error('mensaje')`).
El **composable** `useNotify` se llama en el **componente** (`catch` → `error(titulo, e.message)`).

Formato de error según el origen:

| Origen | Campo para el `if` | Ejemplo |
|---|---|---|
| Auth (`/auth/v1/...`) | `data.error_code` | `"invalid_credentials"` |
| Data API / PostgREST (`/rest/v1/...`) | `data.code` | `"23505"`, `"PGRST301"` |
| Edge Function (`/functions/v1/...`) | `data.error` | `"Token inválido o expirado"` |
| Gateway de Functions | `data.code` | `"UNAUTHORIZED_NO_AUTH_HEADER"` |
| Sin red | `fetch` lanza `TypeError` | no hay body |

Error de red (todas las acciones):

```js
try {
  const res = await fetch(...)
  const data = await res.json()
  // ifs de API
} catch (e) {
  if (e instanceof TypeError) {
    throw new Error('Sin conexión. Intentá de nuevo.')
  }
  throw e
}
```

---

## Estado

| # | Archivo | Acción | Store | Notify |
|---|---|---|---|---|
| 1 | `src/components/AuthForm.vue` | Login | `login` — ifs listos | Error listo. Éxito no (redirige a `/`) |
| 2 | `src/components/RegistrationForm.vue` | Registro | `registerUser` — **faltan ifs** | Error UI listo, mensajes incorrectos hasta que la store lance bien |
| 3 | `src/components/profile/PersonalInformation.vue` | Actualizar username | `updateUsername` — throw genérico | **Falta** éxito y error |
| 4 | `src/components/profile/ProfileButtons.vue` | Cerrar sesión | `logout` — no chequea `res.ok` | **Falta** (hoy `console.log`) |
| 5 | `src/components/profile/ProfileButtons.vue` | Eliminar cuenta | `deleteAccount` — throw genérico | **Falta toast** (hoy texto en el modal) |
| 6 | `src/components/header/UserMenu.vue` | Cerrar sesión | misma `logout` | **Falta** (hoy `console.log`) |
| 7 | `src/components/filters/FavoriteFilter.vue` | Agregar / quitar favorito | `addActionToMovie` / `deleteActionToMovie` — no chequean `res.ok` | **Falta error**. Éxito no (el ícono ya cambia) |
| 8 | `src/components/filters/BookmarkFilter.vue` | Agregar / quitar pendiente | mismas actions | **Falta error** |
| 9 | `src/components/filters/WatchedFilter.vue` | Marcar / desmarcar visto | mismas actions | **Falta error** |

No llevan notify (cargas en segundo plano): `App.vue`, `router.js`, `SearchBar.vue`.

---

## 1. Login — LISTO (referencia)

- **Componente:** `src/components/AuthForm.vue`
- **Store:** `userStore.login`
- **Endpoint:** `POST /auth/v1/token?grant_type=password`

**Éxito `200`:** tiene `access_token`.

**Errores reales de este proyecto:**

```json
{ "code": 400, "error_code": "invalid_credentials", "msg": "Invalid login credentials" }
```

| `error_code` | HTTP | Cuándo | Mensaje |
|---|---|---|---|
| `invalid_credentials` | 400 | Email no existe **o** contraseña mal. Supabase no los separa | Email o contraseña incorrectos |
| `email_not_confirmed` | 400 | Cuenta sin confirmar el mail | Confirmá tu email antes de iniciar sesión |
| `user_banned` | 400 | Usuario baneado | Esta cuenta está suspendida |
| `over_request_rate_limit` | 429 | Demasiados intentos | Esperá un momento e intentá de nuevo |
| `validation_failed` | 400 | Email con formato inválido | El email no es válido |
| *(otro)* | * | Caída del servicio, etc. | No se pudo iniciar sesión. Intentá de nuevo |

```js
if (!res.ok) {
  if (data.error_code === 'invalid_credentials') {
    throw new Error('Email o contraseña incorrectos')
  }
  if (data.error_code === 'email_not_confirmed') {
    throw new Error('Confirmá tu email antes de iniciar sesión')
  }
  if (data.error_code === 'over_request_rate_limit') {
    throw new Error('Esperá un momento e intentá de nuevo')
  }
  throw new Error('No se pudo iniciar sesión. Intentá de nuevo.')
}
```

> `endpointHTTP.md` documenta `{ error: "invalid_grant" }`. Ese formato **ya no llega**. Usar `error_code`.

---

## 2. Registro — FALTA ifs en store

- **Componente:** `src/components/RegistrationForm.vue` (el `catch` ya llama a `error(...)`)
- **Store:** `userStore.registerUser` (hoy no mira `res.ok`; si falla, explota en `data.user.id`)
- **Endpoint:** `POST /auth/v1/signup`

**Éxito `200`:** viene `access_token`. Si no hay token, no dar la sesión por válida.

**Errores reales de este proyecto:**

```json
{ "code": 422, "error_code": "user_already_exists", "msg": "User already registered" }
```

```json
{ "code": 422, "error_code": "weak_password", "msg": "Password should be at least 6 characters.", "weak_password": { "reasons": ["length"] } }
```

```json
{ "code": 400, "error_code": "validation_failed", "msg": "Unable to validate email address: invalid format" }
```

| `error_code` | HTTP | Cuándo | Mensaje |
|---|---|---|---|
| `user_already_exists` | 422 | El email ya tiene cuenta | Ese email ya está registrado |
| `email_exists` | 422 | Variante del anterior | Ese email ya está registrado |
| `weak_password` | 422 | Contraseña más corta que la política de Auth (mín. 6; el form pide 8) | La contraseña es demasiado débil |
| `validation_failed` | 400 | Email inválido | El email no es válido |
| `signup_disabled` / `email_provider_disabled` | 403/422 | Registro apagado en el dashboard | El registro no está disponible |
| `over_request_rate_limit` / `over_email_send_rate_limit` | 429 | Rate limit | Esperá un momento e intentá de nuevo |
| *(otro)* | * | | No se pudo crear la cuenta. Intentá de nuevo |

```js
if (!res.ok) {
  if (data.error_code === 'user_already_exists' || data.error_code === 'email_exists') {
    throw new Error('Ese email ya está registrado')
  }
  if (data.error_code === 'weak_password') {
    throw new Error('La contraseña es demasiado débil')
  }
  if (data.error_code === 'validation_failed') {
    throw new Error('El email no es válido')
  }
  if (data.error_code === 'over_request_rate_limit' || data.error_code === 'over_email_send_rate_limit') {
    throw new Error('Esperá un momento e intentá de nuevo')
  }
  throw new Error('No se pudo crear la cuenta. Intentá de nuevo.')
}

if (!data.access_token) {
  throw new Error('No se pudo crear la cuenta. Intentá de nuevo.')
}
```

---

## 3. Actualizar username — FALTA notify

- **Componente:** `src/components/profile/PersonalInformation.vue`
- **Store:** `userStore.updateUsername`
- **Endpoint:** `PUT /auth/v1/user`
- **Notify:** éxito sí (`Nombre actualizado`) y error sí.

**Éxito `200`:** user con `user_metadata.username`.

**Errores reales:**

```json
{ "code": 401, "error_code": "no_authorization", "msg": "This endpoint requires a valid Bearer token" }
```

```json
{ "code": 403, "error_code": "bad_jwt", "msg": "invalid JWT: ..." }
```

| `error_code` | HTTP | Cuándo | Mensaje |
|---|---|---|---|
| `no_authorization` | 401 | No hay Bearer | Tu sesión expiró. Volvé a iniciar sesión |
| `bad_jwt` | 403 | Token inválido o vencido | Tu sesión expiró. Volvé a iniciar sesión |
| `validation_failed` | 400 | Payload inválido | No se pudo actualizar el nombre |
| *(otro)* | * | | No se pudo actualizar el nombre de usuario |

```js
if (!res.ok) {
  if (data.error_code === 'no_authorization' || data.error_code === 'bad_jwt') {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión')
  }
  throw new Error('No se pudo actualizar el nombre de usuario')
}
```

---

## 4 y 6. Cerrar sesión — FALTA notify

- **Componentes:** `ProfileButtons.vue` y `UserMenu.vue` (misma action)
- **Store:** `userStore.logout`
- **Endpoint:** `POST /auth/v1/logout`
- **Notify:** éxito no (redirige a `/auth`). Error sí, pero igual conviene limpiar la sesión local.

**Éxito `204`:** sin body.

**Errores reales:**

```json
{ "code": 401, "error_code": "no_authorization", "msg": "This endpoint requires a valid Bearer token" }
```

| `error_code` | HTTP | Cuándo | Mensaje |
|---|---|---|---|
| `no_authorization` | 401 | Sin token | (limpiar local igual; no hace falta toast) |
| `bad_jwt` | 403 | Token inválido | (limpiar local igual) |
| red / 5xx | * | No se pudo avisar al servidor | No se pudo cerrar sesión en el servidor |

Hoy `logout` no mira `res.ok`. Si el token ya está vencido, igual hay que borrar `localStorage` y mandar a `/auth`. El toast de error solo tiene sentido si `fetch` falla por red.

```js
const res = await authFetch('/logout', { method: 'POST' }, this.accessToken)

this.accessToken = null
this.user = { username: '' }
localStorage.removeItem('refresh_token')
localStorage.removeItem('user')

if (!res.ok && res.status >= 500) {
  throw new Error('No se pudo cerrar sesión en el servidor')
}
```

---

## 5. Eliminar cuenta — FALTA toast

- **Componente:** `src/components/profile/ProfileButtons.vue`
- **Store:** `userStore.deleteAccount`
- **Endpoint:** `POST /functions/v1/delete-account`
- **Notify:** éxito sí (al ir a `/auth`) y error sí (reemplaza `deleteError` del modal).

La store ya hace `throw new Error(body.error || '...')`. El `if` puede afinar según status / `error` / `code`.

**Éxito `200`:** `{ "success": true }`

**Errores reales:**

Función (token vacío):

```json
{ "error": "Falta el token de autenticación" }
```

Función (token inválido):

```json
{ "error": "Token inválido o expirado" }
```

Gateway (sin header):

```json
{ "code": "UNAUTHORIZED_NO_AUTH_HEADER", "message": "Missing authorization header" }
```

Gateway (JWT malformado):

```json
{ "code": "UNAUTHORIZED_INVALID_JWT_FORMAT", "message": "Invalid JWT" }
```

Función (fallo interno):

```json
{ "error": "<mensaje del catch>" }
```

HTTP `405`: `{ "error": "Método no permitido" }`

| Qué llega | HTTP | Mensaje |
|---|---|---|
| `error` / `code` de auth faltante o JWT malo | 401 | Tu sesión expiró. Volvé a iniciar sesión |
| `error` de la función en 500 | 500 | No se pudo eliminar la cuenta |
| *(otro)* | * | No se pudo eliminar la cuenta |

```js
if (!res.ok) {
  const body = await res.json().catch(() => ({}))

  if (res.status === 401 || body.code === 'UNAUTHORIZED_NO_AUTH_HEADER' || body.code === 'UNAUTHORIZED_INVALID_JWT_FORMAT') {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión')
  }
  throw new Error(body.error || 'No se pudo eliminar la cuenta')
}
```

---

## 7, 8 y 9. Favorito / pendiente / visto — FALTA notify de error

- **Componentes:** `FavoriteFilter.vue`, `BookmarkFilter.vue`, `WatchedFilter.vue`
- **Store:** `movieStore.addActionToMovie` y `movieStore.deleteActionToMovie`
- **Endpoints:**
  - Agregar: `POST /rest/v1/user_content`
  - Quitar: `DELETE /rest/v1/user_content?user_id=eq.{uid}&content_id=eq.{id}&action=eq.{action}`
- **Notify:** solo error. El botón ya muestra el estado.

Hoy la store **cambia el Set aunque falle la API**. Primero hay que `throw` si `!res.ok` y **después** actualizar el Set.

Errores de PostgREST (campo `code`, no `error_code`):

**Sin token / RLS** (`POST`):

```json
{ "code": "42501", "details": null, "hint": null, "message": "new row violates row-level security policy for table \"user_content\"" }
```

HTTP: `401`

**JWT inválido:**

```json
{ "code": "PGRST301", "details": null, "hint": null, "message": "Expected 3 parts in JWT; got 1" }
```

HTTP: `401`

**Duplicado** (ya estaba marcado) — constraint `UNIQUE (user_id, content_id, action)`:

```json
{
  "code": "23505",
  "details": "Key (user_id, content_id, action)=(…) already exists.",
  "hint": null,
  "message": "duplicate key value violates unique constraint \"user_content_user_id_content_id_action_key\""
}
```

HTTP: `409`

**`content_id` que no existe** — FK a `content(id)`:

```json
{ "code": "23503", "message": "insert or update on table \"user_content\" violates foreign key constraint …" }
```

HTTP: `409`

**`action` inválida** — CHECK `favorite | bookmark | watched`:

```json
{ "code": "23514", "message": "new row for relation \"user_content\" violates check constraint …" }
```

HTTP: `400`

### POST — agregar

| `code` | HTTP | Cuándo | Mensaje |
|---|---|---|---|
| `42501` | 401 | RLS: sin sesión o `user_id` ajeno | Iniciá sesión para guardar esto |
| `PGRST301` | 401 | JWT inválido | Tu sesión expiró. Volvé a iniciar sesión |
| `23505` | 409 | Ya estaba marcado | Ya estaba en tu lista |
| `23503` | 409 | Película/serie inexistente | Ese contenido ya no está disponible |
| `23514` | 400 | `action` distinta de favorite/bookmark/watched | No se pudo guardar |
| *(otro)* | * | | No se pudo guardar. Intentá de nuevo |

```js
if (!res.ok) {
  const data = await res.json().catch(() => ({}))

  if (data.code === '42501' || data.code === 'PGRST301') {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión')
  }
  if (data.code === '23505') {
    throw new Error('Ya estaba en tu lista')
  }
  if (data.code === '23503') {
    throw new Error('Ese contenido ya no está disponible')
  }
  throw new Error('No se pudo guardar. Intentá de nuevo.')
}
```

### DELETE — quitar

Mismos `42501` y `PGRST301`.

Si la fila no existe, PostgREST igual responde **200/204 sin body**. No hay error de API. No hace falta toast.

```js
if (!res.ok) {
  const data = await res.json().catch(() => ({}))

  if (data.code === '42501' || data.code === 'PGRST301') {
    throw new Error('Tu sesión expiró. Volvé a iniciar sesión')
  }
  throw new Error('No se pudo actualizar. Intentá de nuevo.')
}
```

En los tres filtros:

```js
try {
  if (yaMarcado) {
    await movieStore.deleteActionToMovie(id, action)
  } else {
    await movieStore.addActionToMovie(id, action)
  }
} catch (e) {
  error('No se pudo actualizar', e.message)
}
```

---

## Orden sugerido para implementar

1. `registerUser` — ifs (el toast del form ya está)
2. `PersonalInformation.vue` — éxito + error
3. `logout` en `ProfileButtons.vue` y `UserMenu.vue`
4. `deleteAccount` — pasar el error del modal a toast
5. `addActionToMovie` / `deleteActionToMovie` + los tres filtros (solo error)
