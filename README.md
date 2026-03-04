# Farzad Portfolio (Next.js + JavaScript)

نسخه ساده‌شده پورتفولیو با این ویژگی‌ها:

- JavaScript خالص (بدون TypeScript)
- طراحی سبک و خلوت با Tailwind CSS
- بدون 3D و بدون افکت‌های سنگین
- پشتیبانی فارسی و انگلیسی (RTL/LTR)
- پنل ادمین در پوشه جدا: `admin/`
- API logic در پوشه `api/` و route ها در `app/api/`
- ارسال فرم تماس به ایمیل (Gmail) از طریق Resend

## Run Locally

```bash
npm install
npm run dev
```

سپس: `http://localhost:3000`

## Environment Variables

فایل `.env.local` بسازید:

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=farzadhammdard122@gmail.com
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
PORTFOLIO_ADMIN_SECRET=your_long_random_secret
PORTFOLIO_ADMIN_USERNAME=admin
PORTFOLIO_ADMIN_PASSWORD=123
```

نکته:

- اگر `CONTACT_TO_EMAIL` را نگذارید، گیرنده پیش‌فرض همین Gmail شما است.
- برای ارسال واقعی ایمیل، داشتن `RESEND_API_KEY` ضروری است.
- هم در حالت deploy و هم در حالت local (با ENV درست) ایمیل ارسال می‌شود.

## Admin

- آدرس پنل: `http://localhost:3000/admin`
- محتوای قابل ویرایش: `content/site-content.json`
- کاربران ادمین: `content/admin-users.json`
- تصاویر قابل آپلود/انتخاب: `public/gallery/`

## Folder Structure (Main)

- `app/` صفحات و route handlers
- `api/` منطق API (ادمین/کانتنت/تماس)
- `components/sections/` سکشن‌های صفحه اصلی
- `components/ui/` کامپوننت‌های UI
- `admin/` داشبورد ادمین
- `content/` داده‌های قابل ویرایش
