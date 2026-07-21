-- Elimina géneros que no están referenciados en content.genre_ids.
-- Se conservan los ids de los géneros en uso (relacionados con películas/series).
DELETE FROM genres
WHERE id IN (2, 3, 4, 6, 7, 8, 14, 24, 26, 27);
