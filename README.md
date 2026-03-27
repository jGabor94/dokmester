# Dokmester

> Vállalati dokumentumkezelő webalkalmazás — belső fejlesztési referencia

![Status](https://img.shields.io/badge/státusz-félbehagyott%20%2F%20nem%20aktív-lightgrey)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)

---

## Áttekintés

A **Dokmester** egy vállalati belső dokumentumkezelő rendszer prototípusa, amelyet a **JRSoft** megbízásából fejlesztettem. A projekt célja az volt, hogy a vállalat papíralapú és szétszórt digitális dokumentációját egyetlen, egységes rendszerbe vonja össze.

A kód a JRSoft engedélyével kerül nyilvánosságra, kizárólag portfolió és referencia céljából.

A projekten belül főként a **backend oldal** fejlesztése volt az én feladatom — az adatbázis-architektúra, a szerver oldali logika, az API réteg és az adatkezelési folyamatok.

---

## Főbb funkciók

- **Dokumentumkezelés** — belső dokumentumok feltöltése, tárolása, keresése és kategorizálása
- **Szerződésnyilvántartás** — szerződések életciklusának követése, lejárati emlékeztetők
- **Árajánlat-kezelés** — árajánlatok készítése, verziózása és státuszkövetése
- **Számlázás** — számlák kiállítása és nyilvántartása
- **Szállítólevél-kezelés** — szállítólevelek generálása és archiválása

---

## Tech stack

| Réteg | Technológia |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript |
| Backend | Next.js Server Actions, API Routes |
| Adatbázis | PostgreSQL (Supabase), Drizzle ORM |
| Fájltárolás | Supabase Storage |
| Fizetés | Stripe |
| Stílus | Tailwind CSS |

---

## Projekt státusza

⚠️ **Ez a projekt félbehagyott állapotban van, és aktívan nem maintainelt.**

A fejlesztés egy korábbi munkaviszony keretében indult el, majd leállt. A kód nem production-ready, egyes funkciók hiányosak vagy befejezetlen állapotban vannak. Pull requesteket és issue-kat nem fogadok el erre a repóra.

---

## Helyi futtatás

> Csak fejlesztési/tanulmányozási célra ajánlott.

```bash
# 1. Függőségek telepítése
npm install

# 2. Környezeti változók beállítása
cp .env.local
# Töltsd ki a saját értékeidet (lásd lentebb)

# 3. Adatbázis migrálása
npx drizzle-kit migrate

# 4. Fejlesztői szerver indítása
npm run dev
```

Az alkalmazás a `http://localhost:3000` címen érhető el.

---

## Környezeti változók

Hozz létre egy `.env.local` fájlt a projekt gyökerében az alábbi változókkal:

```dotenv
# Auth
AUTH_SECRET=''           # Generálható: npx auth secret
NEXTAUTH_URL='http://localhost:3000'
AUTH_URL='http://localhost:3000/api/auth'
BASE_URL='http://localhost:3000'
JWT_SECRET=''

# E-mail (SMTP)
SMTP_HOST=''             # pl. smtp.hostinger.com
SMTP_USER=''
SMTP_PASSWORD=''

# Session
NEXT_PUBLIC_SESSION_CHECK_INTERVAL=60000

# Supabase
SUPABASE_PROJECT_URL=''
NEXT_PUBLIC_SUPABASE_BUCKET_URL=''
SUPABASE_API_KEY=''
DATABASE_URL=''          # postgresql://...
SUPABASE_IMAGE_LINK=''

# Stripe
STRIPE_SECRET_WEBHOOK_KEY=''
STRIPE_SECRET=''
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=''

# Egyéb
CRYPTO_SECRET_KEY=''
```

## Licenc és jogok

A kód a **JRSoft** szóbeli engedélyével kerül nyilvánosságra, kizárólag portfolió referencia céljából. Üzleti célú felhasználása nem engedélyezett.
