-- Crea la tabla unificada user_content
CREATE TABLE user_content (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id integer NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  action     text NOT NULL CHECK (action IN ('favorite', 'bookmark', 'watched')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, content_id, action)
);

-- RLS
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own user_content"
  ON user_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own user_content"
  ON user_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own user_content"
  ON user_content FOR DELETE
  USING (auth.uid() = user_id);

-- Migra los datos existentes de favorites y bookmarks
INSERT INTO user_content (user_id, content_id, action, created_at)
SELECT user_id, content_id, 'favorite', created_at FROM favorites;

INSERT INTO user_content (user_id, content_id, action, created_at)
SELECT user_id, content_id, 'bookmark', created_at FROM bookmarks;

-- Elimina las tablas anteriores
DROP TABLE favorites;
DROP TABLE bookmarks;
