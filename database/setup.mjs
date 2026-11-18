// إنشاء الجداول وإضافة البيانات التجريبية
// التشغيل: npm run db:setup
import { readFile } from 'node:fs/promises';
import { pool } from './db.mjs';

const read = (name) => readFile(new URL(name, import.meta.url), 'utf8');

try {
  await pool.query(await read('./schema.sql'));
  console.log('✅ تم إنشاء الجداول (users, posts)');

  if (!process.argv.includes('--no-seed')) {
    await pool.query(await read('./seed.sql'));
    console.log('✅ تمت إضافة البيانات التجريبية');
  }
} catch (err) {
  console.error('❌ فشل الإعداد:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
