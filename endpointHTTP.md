# CineTrack — Auth API Reference

**Base URL:** `https://xgwmburyugpqojvrszim.supabase.co/auth/v1`

**Headers requeridos en todos los endpoints:**
```
apikey: <VITE_SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

## POST `/signup` — Registro

Crea un nuevo usuario en Supabase Auth. El trigger `on_auth_user_created` inserta automáticamente una fila en `public.profiles` con el `username` provisto.

**Request**
```http
POST /auth/v1/signup
```
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "data": {
    "username": "nombre_de_usuario"
  }
}
```

> El campo `data` se guarda como `raw_user_meta_data` en `auth.users`. El trigger lo lee para poblar `profiles.username`.

**Response `200 OK`**
```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "user_metadata": {
    "username": "nombre_de_usuario"
  },
  "created_at": "2026-06-16T00:00:00Z"
}
```

> Si el email ya existe, Supabase devuelve `200` igualmente pero **no** envía el token. Verificar que `access_token` esté presente en la respuesta para confirmar el registro.

---

## POST `/token?grant_type=password` — Inicio de sesión

Autentica al usuario con email y contraseña. Devuelve el JWT necesario para todas las peticiones posteriores a la Data API.

**Request**
```http
POST /auth/v1/token?grant_type=password
```
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response `200 OK`**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1750000000,
  "refresh_token": "string",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com"
  }
}
```

**Response `400 Bad Request`** *(credenciales incorrectas)*
```json
{
  "error": "invalid_grant",
  "error_description": "Invalid login credentials"
}
```

> El `access_token` se debe guardar en memoria (o `localStorage`) y enviarse en el header `Authorization: Bearer <access_token>` en todas las peticiones a `/rest/v1/`.

---

## POST `/recover` — Olvidé mi contraseña

Envía un email con un enlace para restablecer la contraseña. El enlace redirige al usuario a la URL configurada en Supabase → **Authentication → URL Configuration → Redirect URLs**.

**Request**
```http
POST /auth/v1/recover
```
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response `200 OK`**
```json
{}
```

> Supabase siempre responde `200` aunque el email no exista, para no exponer qué cuentas están registradas.

---

## POST `/logout` — Cierre de sesión

Invalida el `access_token` activo del usuario.

**Request**
```http
POST /auth/v1/logout
```
```
Authorization: Bearer <access_token>
```

*(Sin body)*

**Response `204 No Content`**

---

## PUT `/user` — Actualizar datos del usuario

Actualiza los datos de la cuenta del usuario autenticado (nombre de usuario, email o contraseña).

**Request**
```http
PUT /auth/v1/user
```
```
Authorization: Bearer <access_token>
```
```json
{
  "data": {
    "username": "nuevo_nombre_de_usuario"
  }
}
```

> En el mismo body también se pueden enviar `email` y `password` para cambiarlos. Si se cambia el `email`, Supabase envía un correo de confirmación al nuevo y (según configuración) al viejo antes de aplicar el cambio.

**Response `200 OK`**
```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "user_metadata": {
    "username": "nuevo_nombre_de_usuario"
  },
  "updated_at": "2026-08-12T00:00:00Z"
}
```

> El `username` vive en `user_metadata`, el mismo campo que ya devuelven `/signup` y `/token`. Actualizarlo acá **no** sincroniza automáticamente `public.profiles.username` (ese campo solo se pobla una vez, al crear la cuenta, vía el trigger `on_auth_user_created`). Si alguna parte de la UI lee el nombre desde `profiles` en vez del store/JWT, hay que actualizarlo aparte con un `PATCH /rest/v1/profiles?id=eq.{uid}` (Data REST API).

---

## DELETE `/admin/users/{uid}` — Dar de baja una cuenta

Elimina definitivamente al usuario de `auth.users` (la baja hace cascada sobre `auth.sessions` y revoca sus refresh tokens, dejando la cuenta inutilizable).

> ⚠️ Este es un endpoint de la **Admin API** de GoTrue: exige la `service_role key` en lugar del `anon key`, y esa clave **nunca debe exponerse en el frontend** (todo lo que empieza con `VITE_` termina siendo público en el bundle). No se puede llamar directamente desde el cliente con el `access_token` del usuario.

**Request** *(solo desde un entorno server-side, ej. una Supabase Edge Function)*
```http
DELETE /auth/v1/admin/users/{uid}
```
```
Authorization: Bearer <service_role_key>
apikey: <service_role_key>
```

**Response `200 OK`**
```json
{}
```

**Flujo recomendado para "dar de baja" desde la app:**
1. El frontend llama a una Edge Function propia (ej. `POST /functions/v1/delete-account`) mandando el `access_token` del usuario en `Authorization: Bearer <access_token>`.
2. La función valida la identidad del usuario con ese token (`supabase.auth.getUser()`).
3. Recién ahí, usando el `service_role key` guardado como secret del proyecto (nunca en el cliente), la función hace el `DELETE /auth/v1/admin/users/{uid}`.
4. El frontend limpia la sesión local (equivalente a `POST /logout` + borrar `localStorage`) y redirige a `/auth`.

---

## Resumen

| Acción | Método | Endpoint |
|---|---|---|
| Registro | `POST` | `/auth/v1/signup` |
| Inicio de sesión | `POST` | `/auth/v1/token?grant_type=password` |
| Olvidé contraseña | `POST` | `/auth/v1/recover` |
| Cierre de sesión | `POST` | `/auth/v1/logout` |
| Actualizar datos del usuario | `PUT` | `/auth/v1/user` |
| Dar de baja una cuenta *(requiere backend/Edge Function)* | `DELETE` | `/auth/v1/admin/users/{uid}` |
