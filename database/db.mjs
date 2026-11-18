// الاتصال بقاعدة البيانات باستخدام هذا الـ driver نفسه (@neondatabase/serverless)
import { neon, neonConfig, Pool } from '@neondatabase/serverless';

// تحميل ملف .env إن وُجد (Node 20.12+ / 21.7+)
try {
  process.loadEnvFile?.();
} catch {
  // لا يوجد ملف .env — سنعتمد على متغيرات البيئة مباشرة
}

export const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    '❌ المتغير DATABASE_URL غير موجود.\n' +
      '   انسخ الملف .env.example إلى .env وضع فيه رابط قاعدة البيانات من Neon.',
  );
  process.exit(1);
}

// اختياري: للاتصال بـ Postgres خاص بك (وليس Neon) عبر WebSocket proxy
// مثال: WS_PROXY=localhost:6543/v1
if (process.env.WS_PROXY) {
  neonConfig.wsProxy = (host, port) =>
    `${process.env.WS_PROXY}?address=${host}:${port}`;
  neonConfig.useSecureWebSocket = process.env.WS_SECURE === 'true';
  neonConfig.pipelineConnect = false;
}

// sql`...` — لاستعلام واحد سريع عبر HTTP (Neon فقط)
export const sql = neon(DATABASE_URL);

// Pool — لعدة استعلامات أو معاملات (transactions) عبر WebSocket
export const pool = new Pool({ connectionString: DATABASE_URL });
