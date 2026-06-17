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

## Resumen

| Acción | Método | Endpoint |
|---|---|---|
| Registro | `POST` | `/auth/v1/signup` |
| Inicio de sesión | `POST` | `/auth/v1/token?grant_type=password` |
| Olvidé contraseña | `POST` | `/auth/v1/recover` |
| Cierre de sesión | `POST` | `/auth/v1/logout` |
