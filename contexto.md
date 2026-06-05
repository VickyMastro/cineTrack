# CineTrack — Contexto del Proyecto

## Descripción General

CineTrack es una aplicación web para el portafolio de una desarrolladora frontend. Permite explorar, buscar y gestionar películas y series obtenidas desde la API pública de TMDB (The Movie Database). Los usuarios pueden registrarse, iniciar sesión y llevar un seguimiento personalizado de su contenido visto o pendiente.

---

## Stack Tecnológico

| Capa             | Tecnología                          |
|------------------|--------------------------------------|
| Framework JS     | Vue 3 (Composition API + `<script setup>`) |
| Herramienta build| Vite                                 |
| Lenguaje         | JavaScript (ES Modules)              |
| Componentes UI   | Nuxt UI v3 (modo Vue, sin Nuxt)     |
| Estilos          | Tailwind CSS v4 (vía Nuxt UI)        |
| Enrutamiento     | Vue Router                           |
| Backend / Auth   | Supabase (HTTP REST API directo)        |
| API de contenido | TMDB API v3                          |

---

## API: TMDB (The Movie Database)

- **Documentación oficial:** https://developer.themoviedb.org/docs/getting-started
- **Base URL:** `https://api.themoviedb.org/3`
- **Autenticación:** API Key o Bearer Token (configurar en variable de entorno)
- **Funcionalidades principales a consumir:**
  - Búsqueda de películas y series (`/search/movie`, `/search/tv`)
  - Películas y series populares / en tendencia (`/trending/all/week`)
  - Detalle de película o serie (`/movie/{id}`, `/tv/{id}`)
  - Géneros (`/genre/movie/list`, `/genre/tv/list`)
  - Imágenes: base URL `https://image.tmdb.org/t/p/{size}/`

### Variables de entorno requeridas (TMDB)
```
VITE_TMDB_API_KEY=tu_api_key_aqui
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

---

## Autenticación y Base de Datos: Supabase

- Supabase provee el sistema de usuarios (registro, login, logout) y la base de datos.
- **Toda la comunicación con Supabase se hace mediante HTTP directo** (fetch nativo), sin usar el SDK `@supabase/supabase-js`.
- Se consumen directamente las APIs REST de Supabase:
  - **Auth REST API:** `https://<proyecto>.supabase.co/auth/v1/` — registro, login, logout, sesión.
  - **Data REST API (PostgREST):** `https://<proyecto>.supabase.co/rest/v1/` — operaciones CRUD sobre las tablas.
- Las peticiones se autentican enviando el `anon key` en el header `apikey` y el JWT del usuario en `Authorization: Bearer <token>`.
- Se puede almacenar en Supabase la lista personal de películas/series vistas o en lista de seguimiento de cada usuario.

### Variables de entorno requeridas (Supabase)
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

---

## Componentes UI: Nuxt UI (modo Vue)

- Se usa **Nuxt UI v3** en modo standalone con Vue 3 (sin Nuxt framework).
- El plugin de Vite (`@nuxt/ui/vite`) gestiona los auto-imports de componentes y composables.
- El plugin de Vue (`@nuxt/ui/vue-plugin`) se registra en `main.ts`.
- La app raíz está envuelta con `<UApp>` en `App.vue`.
- Tailwind CSS v4 está incluido y configurado automáticamente por Nuxt UI.
- Documentación: https://ui3.nuxt.com/getting-started/installation/vue

---

## Estructura del Proyecto

```
cineTrack/
├── src/
│   ├── assets/
│   │   └── css/
│   │       └── main.css        # @import tailwindcss y @nuxt/ui
│   ├── components/             # Componentes reutilizables
│   ├── views/                  # Páginas / vistas de Vue Router
│   ├── composables/            # Composables (useTMDB, useAuth, etc.)
│   ├── router/                 # Configuración de Vue Router
│   ├── stores/                 # Estado global (Pinia si se agrega)
│   ├── lib/
│   │   ├── tmdb.js             # Helpers para TMDB API (fetch)
│   │   └── supabase.js         # Helpers para Supabase HTTP (fetch)
│   ├── App.vue                 # Componente raíz con <UApp>
│   └── main.js                 # Entry point, registra router y ui plugin
├── contexto.md                 # Este archivo
├── .env                        # Variables de entorno (no commitear)
├── .env.example                # Ejemplo de variables de entorno
├── vite.config.js
└── package.json
```

---

## Convenciones

- Composition API con `<script setup>` en todos los componentes.
- Prefijo `U` en componentes de Nuxt UI (ej: `<UButton>`, `<UCard>`, `<UInput>`).
- Composables con prefijo `use` (ej: `useTMDB`, `useAuth`).
- Variables de entorno accesibles vía `import.meta.env.VITE_*`.
- No se usa Nuxt framework; el proyecto es Vue 3 puro con Vite.
- No se usa TypeScript; el proyecto es JavaScript puro (ES Modules).

---

## Objetivo del Proyecto

Demostrar habilidades de desarrolladora frontend en:
- Integración con APIs REST externas (TMDB).
- Autenticación de usuarios y consumo de base de datos vía HTTP REST (Supabase).
- Uso de un sistema de diseño moderno (Nuxt UI + Tailwind CSS).
- Arquitectura limpia con Vue 3, JavaScript y Vite.
