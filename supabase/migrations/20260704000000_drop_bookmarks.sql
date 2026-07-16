-- Elimina definitivamente la tabla bookmarks.
-- Los datos fueron migrados a user_content en 20260703120000_create_user_content.sql
DROP TABLE IF EXISTS bookmarks;
