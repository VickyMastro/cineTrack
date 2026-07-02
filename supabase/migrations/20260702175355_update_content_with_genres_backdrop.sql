-- Recrea la vista content_with_genres incluyendo la nueva columna backdrop_path al final
-- Se mantiene array_agg + json_build_object (json[]) para no cambiar el tipo de la columna genres
CREATE OR REPLACE VIEW content_with_genres AS
SELECT
  c.id,
  c.type,
  c.title,
  c.overview,
  c.poster_path,
  c.release_date,
  c.vote_average,
  COALESCE(
    array_agg(
      json_build_object('id', g.id, 'name', g.name)
      ORDER BY g.id
    ) FILTER (WHERE g.id IS NOT NULL),
    ARRAY[]::json[]
  ) AS genres,
  c.backdrop_path
FROM content c
LEFT JOIN genres g ON g.id = ANY(c.genre_ids)
GROUP BY c.id, c.type, c.title, c.overview, c.poster_path, c.release_date, c.vote_average, c.backdrop_path;
