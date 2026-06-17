-- ============================================================
-- CineTrack — Migración inicial de base de datos
-- ============================================================
-- Supabase gestiona la autenticación automáticamente en auth.users.
-- Solo necesitamos crear las tablas de datos de la aplicación.
-- ============================================================


-- ============================================================
-- TABLA: watchlist
-- Almacena las películas y series que cada usuario ha marcado
-- como vistas o pendientes.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.watchlist (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tmdb_id      INTEGER NOT NULL,
  media_type   TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  status       TEXT NOT NULL CHECK (status IN ('watched', 'pending')),
  title        TEXT NOT NULL,
  poster_path  TEXT,
  vote_average NUMERIC(3, 1),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Un usuario no puede tener duplicados del mismo contenido
  CONSTRAINT watchlist_user_media_unique UNIQUE (user_id, tmdb_id, media_type)
);

-- Índices para acelerar las consultas más frecuentes
CREATE INDEX IF NOT EXISTS watchlist_user_id_idx    ON public.watchlist (user_id);
CREATE INDEX IF NOT EXISTS watchlist_status_idx     ON public.watchlist (user_id, status);
CREATE INDEX IF NOT EXISTS watchlist_media_type_idx ON public.watchlist (user_id, media_type);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuario solo puede leer y escribir sus propios registros.
-- ============================================================
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- Política: SELECT — el usuario solo ve sus propias filas
CREATE POLICY "Users can view their own watchlist"
  ON public.watchlist
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: INSERT — el usuario solo puede insertar filas con su propio user_id
CREATE POLICY "Users can add to their own watchlist"
  ON public.watchlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: UPDATE — el usuario solo puede modificar sus propias filas
CREATE POLICY "Users can update their own watchlist"
  ON public.watchlist
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: DELETE — el usuario solo puede eliminar sus propias filas
CREATE POLICY "Users can delete from their own watchlist"
  ON public.watchlist
  FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- TABLA: profiles
-- Extiende auth.users con datos de perfil adicionales.
-- Se crea automáticamente al registrarse un usuario.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: SELECT — el perfil es público (para mostrar nombres de usuario)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Política: UPDATE — el usuario solo puede editar su propio perfil
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ============================================================
-- FUNCIÓN + TRIGGER: crear perfil automáticamente al registrarse
-- Cuando Supabase Auth crea un usuario en auth.users, este
-- trigger inserta una fila vacía en public.profiles.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username'
  );
  RETURN NEW;
END;
$$;

-- Eliminar el trigger si ya existe para evitar duplicados al re-ejecutar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
