// أمثلة على القراءة والكتابة في قاعدة البيانات
// التشغيل: npm run db:example
import { pool } from './db.mjs';

try {
  // 1) إضافة مستخدم (القيم تُمرَّر كمعاملات $1, $2 لمنع SQL injection)
  const {
    rows: [user],
  } = await pool.query(
    `INSERT INTO users (name, email) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id, name, email`,
    ['فاطمة', 'test@example.com'],
  );
  console.log('المستخدم:', user);

  // 2) قراءة كل المستخدمين مع عدد منشوراتهم
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.email, count(p.id)::int AS posts
    FROM users u LEFT JOIN posts p ON p.user_id = u.id
    GROUP BY u.id ORDER BY u.id`);
  console.table(rows);

  // 3) معاملة (transaction): إمّا أن تنجح كل الأوامر أو لا يُنفَّذ شيء
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'INSERT INTO posts (user_id, title, body) VALUES ($1, $2, $3)',
      [user.id, 'منشور جديد', 'تمت الإضافة داخل transaction'],
    );
    await client.query('COMMIT');
    console.log('✅ تمت إضافة منشور داخل transaction');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
} catch (err) {
  console.error('❌ خطأ:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
