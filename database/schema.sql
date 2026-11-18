-- مخطط قاعدة البيانات (Database schema)
-- يمكن تشغيله أكثر من مرة بأمان بفضل IF NOT EXISTS

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  body        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts (user_id);
