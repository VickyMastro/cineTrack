# CineTrack — Content & Genres API Reference

**Base URL:** `https://xgwmburyugpqojvrszim.supabase.co/rest/v1`

**Headers requeridos en todos los endpoints:**

```
apikey: <VITE_SUPABASE_ANON_KEY>
Content-Type: application/json
```

> Las tablas `content` y `genres` tienen RLS activado con política de **lectura pública**, por lo que **no se requiere** `Authorization: Bearer` para los `GET`. Las operaciones de escritura (INSERT, UPDATE, DELETE) sí requieren el token del usuario.

---

## GET `/content` — Obtener todo el contenido

Devuelve todos los elementos (películas y series) con paginación.

**Request**

```http
GET /rest/v1/content?select=*&order=vote_average.desc&limit=20&offset=0
```

**Response `200 OK`**

```json
[
  {
    "id": 124364,
    "type": "serie",
    "title": "FROM",
    "overview": "Desvela el misterio de una pesadillesca ciudad...",
    "poster_path": "/pRtJagIxpfODzzb0T0NAvZSzErC.jpg",
    "release_date": "2022-02-20",
    "vote_average": 8.5,
    "genre_ids": [21, 15, 5]
  }
]
```

**Parámetros de query disponibles**

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `select` | `select=id,title,poster_path` | Seleccionar columnas específicas |
| `order` | `order=vote_average.desc` | Ordenar. Añadir `.asc` o `.desc` |
| `limit` | `limit=20` | Cantidad de resultados por página |
| `offset` | `offset=20` | Saltar N registros (para paginar) |

---

## GET `/content?type=eq.movie` — Solo películas

```http
GET /rest/v1/content?type=eq.movie&order=release_date.desc
```

**Response `200 OK`** — Array con solo los elementos de `type: "movie"`.

---

## GET `/content?type=eq.serie` — Solo series

```http
GET /rest/v1/content?type=eq.serie&order=release_date.desc
```

**Response `200 OK`** — Array con solo los elementos de `type: "serie"`.

---

## GET `/content?id=eq.{id}` — Obtener un elemento por ID

```http
GET /rest/v1/content?id=eq.124364
```

> Para obtener un objeto único en lugar de un array, agregar el header `Accept: application/vnd.pgrst.object+json`. Si no hay resultado, devuelve `406`.

**Response `200 OK`**

```json
[
  {
    "id": 124364,
    "type": "serie",
    "title": "FROM",
    "overview": "...",
    "poster_path": "/pRtJagIxpfODzzb0T0NAvZSzErC.jpg",
    "release_date": "2022-02-20",
    "vote_average": 8.5,
    "genre_ids": [21, 15, 5]
  }
]
```

---

## GET `/content?title=ilike.*{query}*` — Buscar por título

Búsqueda case-insensitive por texto parcial en el título.

```http
GET /rest/v1/content?title=ilike.*dragon*
```

**Response `200 OK`** — Array con los elementos cuyo título contiene "dragon".

> El `*` en PostgREST equivale al `%` de SQL LIKE. La búsqueda no distingue mayúsculas ni minúsculas.

---

## GET `/content?genre_ids=cs.{id}` — Filtrar por género

Devuelve los elementos cuyo array `genre_ids` **contiene** el ID de género indicado.

```http
GET /rest/v1/content?genre_ids=cs.{15}
```

> `cs` = _contains_ en PostgREST. El valor debe estar entre llaves: `{15}`.

Para filtrar por múltiples géneros a la vez (que tenga **todos**):

```http
GET /rest/v1/content?genre_ids=cs.{15,21}
```

**Response `200 OK`** — Array de elementos que incluyen ese/esos género/s.

---

## GET `/content?type=eq.movie&genre_ids=cs.{id}` — Películas por género

Combinación de filtros: solo películas de un género específico.

```http
GET /rest/v1/content?type=eq.movie&genre_ids=cs.{19}&order=vote_average.desc
```

**Response `200 OK`** — Películas de Horror (id 19) ordenadas por puntuación.

---

## GET `/content_with_genres` — Contenido con géneros expandidos

Usa la vista `content_with_genres` que hace el JOIN automáticamente. Devuelve los géneros como objetos en lugar de un array de IDs.

```http
GET /rest/v1/content_with_genres?order=vote_average.desc
```

**Response `200 OK`**

```json
[
  {
    "id": 124364,
    "type": "serie",
    "title": "FROM",
    "overview": "...",
    "poster_path": "/pRtJagIxpfODzzb0T0NAvZSzErC.jpg",
    "release_date": "2022-02-20",
    "vote_average": 8.5,
    "genres": [
      { "id": 5,  "name": "Sci-Fi & Fantasy" },
      { "id": 15, "name": "Drama" },
      { "id": 21, "name": "Mystery" }
    ]
  }
]
```

> Admite los mismos filtros que `/content` (`type=eq.movie`, `order`, `limit`, etc.).

---

## GET `/genres` — Obtener todos los géneros

```http
GET /rest/v1/genres?order=id.asc
```

**Response `200 OK`**

```json
[
  { "id": 1,  "name": "Action & Adventure" },
  { "id": 2,  "name": "Kids" },
  { "id": 5,  "name": "Sci-Fi & Fantasy" },
  { "id": 9,  "name": "Action" },
  { "id": 15, "name": "Drama" }
]
```

---

## GET `/genres?id=eq.{id}` — Obtener un género por ID

```http
GET /rest/v1/genres?id=eq.15
```

**Response `200 OK`**

```json
[
  { "id": 15, "name": "Drama" }
]
```

---

## Errores posibles (todos los endpoints)

**`401 Unauthorized`** _(falta el header `apikey`)_

```json
{
  "message": "No API key found in request",
  "hint": "No `apikey` request header or url param was found."
}
```

> Verificar que el header `apikey` esté presente en todas las peticiones.

**`406 Not Acceptable`** _(se usó `Accept: application/vnd.pgrst.object+json` y no hay resultado)_

```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

> Ocurre cuando se pide un objeto único y no existe el registro. Manejar mostrando una vista de "no encontrado".

**`400 Bad Request`** _(filtro o columna inexistente)_

```json
{
  "code": "42703",
  "details": null,
  "hint": null,
  "message": "column content.columna_inexistente does not exist"
}
```

> Revisar el nombre de la columna en el parámetro `select` u `order`.

---

## Resumen

| Acción | Método | Endpoint |
|---|---|---|
| Todo el contenido | `GET` | `/rest/v1/content?select=*&order=vote_average.desc` |
| Solo películas | `GET` | `/rest/v1/content?type=eq.movie` |
| Solo series | `GET` | `/rest/v1/content?type=eq.serie` |
| Item por ID | `GET` | `/rest/v1/content?id=eq.{id}` |
| Buscar por título | `GET` | `/rest/v1/content?title=ilike.*{query}*` |
| Filtrar por género | `GET` | `/rest/v1/content?genre_ids=cs.{id}` |
| Contenido + géneros expandidos | `GET` | `/rest/v1/content_with_genres` |
| Todos los géneros | `GET` | `/rest/v1/genres?order=id.asc` |
| Género por ID | `GET` | `/rest/v1/genres?id=eq.{id}` |

---

## Patrón de fetch recomendado

```js
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function fetchContent(params = '') {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/content?${params}`, {
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      const error = await res.json()
      throw { status: res.status, code: error.code, message: error.message }
    }

    return await res.json()
  } catch (err) {
    if (err instanceof TypeError) {
      throw { status: null, code: 'network_error', message: 'Sin conexión' }
    }
    throw err
  }
}

// Ejemplos de uso:
fetchContent('type=eq.movie&order=vote_average.desc&limit=20')
fetchContent('title=ilike.*mario*')
fetchContent('genre_ids=cs.{15}&type=eq.serie')
```
