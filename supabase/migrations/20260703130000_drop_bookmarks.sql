-- Elimina la tabla bookmarks que fue recreada por orden de migraciones.
-- Los datos ya fueron migrados a user_content en 20260703120000.
DROP TABLE IF EXISTS bookmarks;
