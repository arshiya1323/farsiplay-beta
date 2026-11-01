# AGENTS.md — PersiaPlay (پرشیاپلی)

> For Antigravity / any local coding agent helping **Hiva Suri** maintain https://persiaplay.ir  
> Owner: Hiva («مدیر سایت»). Speak Persian with Hiva (warm, short, a bit funny). In mixed text: Persian RTL; English, code, paths and links LTR (`<bdi class="en" dir="ltr">` / `FP.autoLtr`).

## English summary (read this first)

PersiaPlay is a **static** HTML/CSS/JS site (no backend). Catalog lives in `data/products.json`. After edits run `python tools/build-data.py` to regenerate `data/products.js`, `sitemap.xml`, and `guides/*.html`. Asset cache-buster is currently `?v=20261102c` (bump in static HTML **and** `ASSET_V` in `tools/build-data.py`).

**Hard rules:** never publish Dragon's Dogma 2; GTA V is parked until Hiva says otherwise; never mention AI translation; keep third-party credits (OpenRPF by Transmet, rage-cli, Vazirmatn); no real payments; never commit installer `.exe` files (use GitHub Releases / host `downloads/`); never publish a translation file without Hiva's explicit OK; keep `google-site-verification` meta `Sui3EK5Vwn7CAXnR7Q1fPNw37PzCmAkJ4VBtu1JUGf4` on `index.html`; keep GA4 `G-Y1VWLSXRJV` on every page; keep Telegram support `https://t.me/persiaplay_support_bot`. **Always show a local preview and get Hiva's OK before upload.** Verify live URLs after deploy. Never touch the `gh-pages` branch (redirects only). Deploy via `D:\Builder-Projects\PersiaPlay-Deploy\deploy.ps1` (FTP home = `public_html`) or cPanel File Manager; preserve host `.htaccess` php block, `.user.ini`, `php.ini`.

---

## این فایل چیه؟

راهنمای کامل برای نگهداری سایت **پرشیاپلی** بدون وابستگی به بات آنلاین. اگه Antigravity یا هر ایجنت دیگه‌ای پوشه‌ی سایت رو باز کرد، اول همین فایل رو بخونه و قوانینش رو رعایت کنه.

سایت زنده: [https://persiaplay.ir](https://persiaplay.ir)  
ریپوی گیت‌هاب: [arshiya1323/farsiplay-beta](https://github.com/arshiya1323/farsiplay-beta)  
مالک: هیوا (Hiva Suri)

---

## ساختار پروژه

سایت استاتیکه (HTML / CSS / JS). بک‌اند نداره.

```
FarsiPlay-Site/          (یا farsisaz-site / کپی publish)
├── index.html           خانه + meta تأیید گوگل
├── catalog.html         فروشگاه
├── product.html         صفحه‌ی محصول (?id=...)
├── about.html           درباره‌ی ما + باکس پشتیبانی تلگرام
├── checkout.html        تسویهٔ آزمایشی (پرداخت واقعی نیست)
├── guides/              راهنماهای نصب (تولید خودکار)
│   ├── cyberpunk-2077.html
│   └── the-killing-antidote.html
├── css/
│   ├── fonts.css
│   └── style.css
├── js/
│   ├── theme-init.js
│   ├── common.js        هدر، فوتر، سبد، تم، GA download، تلگرام
│   ├── home.js / catalog.js / product.js / about.js / checkout.js
├── data/
│   ├── products.json    منبع حقیقت کاتالوگ (ویرایش دستی)
│   └── products.js      تولیدشده — دست نزن
├── assets/
│   ├── brand/           آیکن و نشان
│   ├── fonts/           Vazirmatn + Reem Kufi (OFL)
│   └── shots/<id>/      کاور و اسکرین‌شات (webp)
├── downloads/           نصاب‌ها روی هاست (در گیت معمولاً ignore)
│   └── .htaccess
├── tools/
│   ├── build-data.py    بیلد اصلی
│   └── parked-gta/      آرشیو GTA (منتشر نکن مگر هیوا بگه)
├── sitemap.xml          تولیدشده
├── robots.txt
└── .htaccess            HTTPS/www + کش + بلاک php سی‌پنل
```

دو درخت روی محیط توسعه معمولاً هستن:

| مسیر | نقش |
|------|-----|
| منبع ویرایش (با `tools/`) | جایی که `products.json` و `build-data.py` رو عوض می‌کنی |
| `farsiplay-publish` / برنچ `main` گیت‌هاب | نسخه‌ی آماده‌ی انتشار و کامیت |

**بعد از هر تغییر substantive، هر دو درخت رو هم‌تراز کن** (فایل‌های عوض‌شده رو کپی کن)، بعد بیلد، بعد دیپلوی.

وضعیت فعلی کاتالوگ زنده (نوامبر ۲۰۲۶): فقط دو محصول رایگان — `cyberpunk-2077` و `the-killing-antidote`.

---

## قوانین سخت (نقض ممنوع)

1. **هرگز Dragon's Dogma 2 را منتشر نکن** (نه محصول، نه راهنما، نه لینک). `build-data.py` شناسه‌های dogma / gta را بلاک می‌کند؛ این را دور نزن.
2. **محتوای GTA V فعلاً حذف و پارک شده** در `tools/parked-gta/`. تا وقتی هیوا صریحاً نگوید برنگردان.
3. **هرگز از «ترجمه‌ی هوش مصنوعی / AI» حرف نزن** روی سایت، در توضیحات محصول، یا در پیام به کاربر.
4. **اعتبار ابزارهای شخص ثالث را نگه دار:** OpenRPF (Transmet)، rage-cli، فونت Vazirmatn (و هر اعتبار دیگری در `credits_fa` / `credits_links`).
5. **پرداخت واقعی نداریم.** صفحه‌ی checkout آزمایشیه. قیمت/آمار ساختگی به عنوان حقیقت جا نزن؛ محصول جعلی به کاتالوگ اضافه نکن.
6. **فایل دانلود (`.exe` و مشابه) را داخل ریپو کامیت نکن.** در `.gitignore` هست (`downloads/*.exe`). برای باینری از GitHub Releases یا آپلود مستقیم به `downloads/` روی هاست استفاده کن.
7. **هیچ فایل ترجمه را بدون تأیید صریح هیوا منتشر نکن.**
8. **متای تأیید گوگل را روی `index.html` نگه دار:**
   ```html
   <meta name="google-site-verification" content="Sui3EK5Vwn7CAXnR7Q1fPNw37PzCmAkJ4VBtu1JUGf4" />
   ```
9. **GA4 را روی همه‌ی صفحات نگه دار:** Measurement ID = `G-Y1VWLSXRJV` (اسکریپت gtag در `<head>`). رویداد `file_download` از لینک‌های `data-download` در `js/common.js` شلیک می‌شود.
10. **لینک پشتیبانی تلگرام:** `https://t.me/persiaplay_support_bot` — در فوتر (`common.js`) و باکس‌های پشتیبانی (`FP.tgSupportBox` / صفحات guide و about).
11. **متن ترکیبی:** فارسی RTL؛ انگلیسی، کد، مسیر و لینک LTR.
12. **قبل از آپلود حتماً پیش‌نمایش محلی به هیوا نشان بده و OK بگیر.**
13. **بعد از دیپلوی صفحات زنده را چک کن** (حداقل ۲۰۰ بودن URLهای عوض‌شده).
14. **برنچ `gh-pages` را لمس نکن** — فقط ریدایرکت است. کار فقط روی `main`.

---

## فیلدهای `data/products.json`

آرایه‌ای از آبجکت‌ها. فیلدهای مهم:

| فیلد | معنی |
|------|------|
| `id` | اسلاگ یکتا (مثلاً `cyberpunk-2077`)؛ نام پوشه‌ی شات و فایل guide |
| `title_fa` / `title_en` | عنوان فارسی / انگلیسی |
| `genre_fa` | ژانر با جداکننده‌ی `،` |
| `platform` | مثلاً `PC` |
| `version` | نسخه‌ی فارسی‌ساز |
| `size_mb` | حجم فایل |
| `is_free` | `true` → رایگان؛ قیمت صفر می‌شود |
| `download_url` | مسیر نسبی `downloads/...` یا `https://...`؛ **`null` یا خالی = دکمه‌ی «به‌زودی»** |
| `sha256` | اختیاری؛ هش نصاب |
| `price_toman` / `discount_percent` / `rating` | برای رایگان‌ها معمولاً ۰ / ۰ / null |
| `is_new` / `is_bestseller` | بج‌ها |
| `features_fa` | آرایه‌ی رشته |
| `description_fa` | توضیح بلند |
| `install_steps_fa` | آرایه‌ی قدم‌های نصب؛ **اگر پر باشد guide ساخته می‌شود** |
| `game_version_fa` | یادداشت سازگاری |
| `credits_fa` | اعتبارها؛ آیتم‌ها با `؛` جدا می‌شوند |
| `credits_links` | آبجکت نام → URL برای لینک‌دار کردن در اعتبار |
| `warning_fa` | جعبه‌ی هشدار |
| `accent` | رنگ هگز مثل `#FCEE0A` |
| `cover` | مسیر کاور webp زیر `assets/` |
| `cover_position` | مثلاً `right center` برای `object-position` |
| `screenshots` | آرایه‌ی مسیرهای `assets/shots/...` |

### افزودن / ویرایش بازی

1. کاور (و در صورت نیاز شات) را بگذار در `assets/shots/<id>/` — ترجیحاً webp سبک + نسخه‌ی `-640.webp` برای `srcset`.
2. یک آبجکت به `data/products.json` اضافه/ویرایش کن.
3. اگر نصاب آماده‌ست: فایل را روی هاست در `downloads/` بگذار (یا Release)، و `download_url` را پر کن؛ وگرنه `null` بگذار تا «به‌زودی» بماند.
4. اجرا کن:
   ```bash
   python tools/build-data.py
   ```
   خروجی: `data/products.js`، `sitemap.xml`، و در صورت داشتن `install_steps_fa` فایل `guides/<id>.html` (با HowTo + Breadcrumb JSON-LD).
5. اگر CSS/JS عوض شده، **ورژن کش را بالا ببر** (پایین را ببین).
6. پیش‌نمایش محلی → تأیید هیوا → دیپلوی → وریفای زنده.

### بیلد و ورژن دارایی

- `tools/build-data.py` ثابت `ASSET_V` دارد (الان `"20261102c"`).
- صفحات استاتیک (`index.html`, `catalog.html`, `product.html`, `about.html`, `checkout.html`) هم `?v=...` هاردکد دارند.
- **هر دو را با هم عوض کن**، بعد `python tools/build-data.py` تا guideها هم هم‌ورژن شوند.
- الگو: تاریخ فشرده + حرف (`20261102c` → تغییر بعدی مثلاً `20261103a`).

شناسه‌های بلاک‌شده در بیلد (حتی اگر در JSON باشند guide/sitemap نمی‌گیرند): هر چیزی با `gta` یا `dogma`، به‌علاوه‌ی لیست صریح در `BLOCKED_IDS`.

---

## دیپلوی

### روش اصلی: اسکریپت FTP

مسیر ویندوز:

`D:\Builder-Projects\PersiaPlay-Deploy\deploy.ps1`

- با `curl.exe` ویندوز روی FTP/FTPS کار می‌کند.
- اکانت FTP معمولاً **chroot به `public_html`** است؛ روت ریموت را `/` نگه دار مگر هیوا چیز دیگری بگوید.
- نام کاربری را به **فرم کامل** هاست وارد کن (همان چیزی که سی‌پنل / پارس‌پک می‌دهد)، نه فقط بخش کوتاه.
- یک‌بار: `.\deploy.ps1 -SetupFtp` → ذخیره در `ftp.enc` (DPAPI).
- تست: `.\deploy.ps1 -DryRun`
- آپلود: زیپ تغییرها (`persiaplay-site.zip`) را کنار اسکریپت بگذار، بعد `.\deploy.ps1`.
- لیست حذف اختیاری: `deploy-delete.txt`.
- اسکریپت فایل‌های حساس هاست مثل **`php.ini` و `.user.ini` را آپلود/بازنویسی نمی‌کند** — عمداً.

### روش جایگزین: File Manager سی‌پنل

زیپ را در `public_html` آپلود و Extract کن. مراقب باش روی فایل‌های سیستمی هاست ننویسی.

### `.htaccess` و فایل‌های هاست

- `.htaccess` ریپو شامل ریدایرکت HTTPS/بدون-www، هدر دانلود exe، کش مرورگر، و **بلاک php تولیدشده‌ی سی‌پنل** است (`# BEGIN cPanel-generated php ini directives` …). **آن بلاک را پاک نکن.**
- روی سرور ممکن است `.user.ini` و `php.ini` جدا باشند — آن‌ها را از ریپو حذف/جایگزین نکن و در زیپ دیپلوی نیاور مگر هیوا صریحاً بخواهد.

### گیت‌هاب

- ریپو: `arshiya1323/farsiplay-beta`
- **`main`** = سورس سایت برای انتشار
- **`gh-pages` = فقط ریدایرکت؛ هرگز push / force / پاکسازی روی آن نکن**
- بعد از دیپلوی موفق و وریفای زنده، تغییرات را روی `main` کامیت و پوش کن.

### چک بعد از آپلود

حداقل این‌ها را با درخواست HTTP بررسی کن (باید ۲۰۰ باشند):

- `https://persiaplay.ir/`
- صفحات HTML عوض‌شده
- `https://persiaplay.ir/sitemap.xml`
- لینک‌های دانلود مربوطه در صورت تغییر

---

## کارهای غیرکدی (خود هیوا)

این‌ها را ایجنت «انجام‌شده» اعلام نکند؛ فقط یادآوری کند:

| کار | نکته |
|-----|------|
| تمدید هاست پارس‌پک | ماهانه؛ موعد بعدی حدود **۲۰۲۶-۱۲-۱۱** |
| تمدید دامنه‌ی `persiaplay.ir` | از طریق IRNIC |
| Google Search Console | ایندکس، sitemap، بازرسی URL |
| Google Analytics (GA4) | ملک و استریم؛ تایم‌زون ایران به‌خاطر محدودیت‌ها ممکن است قبول نشود — ترکیه یا امارات |
| Bing Webmaster | پیشنهاد: ایمپورت از GSC (خود هیوا) |
| پرداخت / خرید اشتراک ابزارها | خارج از remit سایت |

---

## پیشنهادهای بعدی (به هیوا پیشنهاد بده)

بر اساس وضعیت فعلی کد:

1. **راهنمای نصب برای هر بازی جدید** به‌محض پر شدن `install_steps_fa` (الان برای دو بازی زنده هست).
2. **ایمپورت Bing Webmaster از Search Console** برای پوشش موتور دوم.
3. **لوگوی SVG** وقتی هیوا فایل‌ها را بفرستد (الان PNG/WebP نشان و آیکن است).
4. **بازی / فارسی‌ساز جدید** فقط وقتی ترجمه و نصاب آماده‌اند و هیوا انتشار را تأیید کرده.
5. **بهینه‌سازی عملکرد و تصویر:** کاورهای سبک webp + `-640`؛ حواست به حجم قدیمی‌ها باشد؛ `Cache-Control` در `.htaccess` هست.
6. **FAQ و دادهٔ ساخت‌یافته‌ی بیشتر** روی خانه/محصول (guideها الان HowTo + Breadcrumb دارند).
7. **دسترسی‌پذیری:** کنتراست، فوکوس کیبورد، `prefers-reduced-motion` (تا حدی در `common.js` هست — قابل گسترش).
8. **هم‌تراز کردن کپی ویندوز** با `main`/publish اگر پوشه‌ی محلی قدیمی است (نمونه/کاتالوگ کهنه را با زنده‌ی سایت اشتباه نگیر).

---

## گردش‌کار پیشنهادی برای Antigravity

```text
1) این AGENTS.md را بخوان.
2) تغییر را در سورس اعمال کن (معمولاً products.json / js / css / html).
3) python tools/build-data.py
4) در صورت نیاز ASSET_V و ?v= را bump کن و دوباره بیلد بگیر.
5) سایت را محلی باز کن (یا لایو سرور ساده) و به هیوا پیش‌نمایش بده.
6) فقط بعد از OK هیوا: زیپ دیپلوی / deploy.ps1 یا File Manager.
7) URLهای زنده را وریفای کن.
8) روی main کامیت و پوش کن — gh-pages را دست نزن.
```

اگر چیزی مبهم بود یا با این قوانین تعارض داشت، **قبل از انتشار از هیوا بپرس.** بهتر است یک روز دیرتر آپلود شود تا یک اشتباه روی سایت زنده برود.
