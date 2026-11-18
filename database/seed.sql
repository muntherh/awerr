-- بيانات تجريبية (Sample data) — احذف هذا الملف أو عدّله حسب حاجتك

INSERT INTO users (name, email) VALUES
  ('أحمد', 'ahmed@example.com'),
  ('سارة', 'sara@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts (user_id, title, body)
SELECT u.id, 'أول منشور', 'مرحباً بكم في قاعدة البيانات!'
FROM users u
WHERE u.email = 'ahmed@example.com'
  AND NOT EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);
