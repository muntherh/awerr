# قاعدة البيانات (Database)

هذا المجلد يضيف قاعدة بيانات **PostgreSQL** للمشروع، ويستخدم الـ driver الموجود في هذا المستودع نفسه (`@neondatabase/serverless`).

## الملفات

| الملف         | الوظيفة                                                   |
| ------------- | --------------------------------------------------------- |
| `schema.sql`  | إنشاء الجداول: `users` (المستخدمون) و `posts` (المنشورات) |
| `seed.sql`    | بيانات تجريبية                                            |
| `db.mjs`      | الاتصال بقاعدة البيانات (يقرأ `DATABASE_URL`)             |
| `setup.mjs`   | ينشئ الجداول ويضيف البيانات التجريبية                     |
| `example.mjs` | أمثلة: إضافة، قراءة، و transaction                        |

## الخطوات

### 1. أنشئ قاعدة بيانات مجانية على Neon

1. ادخل إلى https://console.neon.tech وسجّل حساباً.
2. أنشئ مشروعاً جديداً (New Project).
3. انسخ **Connection string**، شكله تقريباً هكذا:
   `postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`

### 2. ضع الرابط في ملف `.env`

```bash
cp .env.example .env
```

ثم افتح `.env` والصق الرابط مكان القيمة الموجودة.
⚠️ ملف `.env` فيه كلمة السر، لذلك هو مستثنى من git ولن يُرفع إلى GitHub.

### 3. ثبّت الحزم

```bash
npm ci
```

### 4. أنشئ الجداول

```bash
npm run db:setup
```

(بدون بيانات تجريبية: `node database/setup.mjs --no-seed`)

### 5. جرّب الأمثلة

```bash
npm run db:example
```

## إضافة جدول جديد

أضف أمر `CREATE TABLE IF NOT EXISTS ...` في آخر `schema.sql` ثم شغّل `npm run db:setup` مرة أخرى. التشغيل المتكرر آمن ولا يحذف البيانات الموجودة.

## استخدام Postgres خاص بك (بدل Neon)

الـ driver يتصل عبر WebSocket، لذلك يحتاج Postgres العادي إلى WebSocket proxy (راجع `DEPLOY.md`). بعد تشغيله أضف إلى `.env`:

```
WS_PROXY=localhost:6543/v1
```
