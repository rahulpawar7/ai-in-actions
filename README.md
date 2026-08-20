# AI IN ACTION

A live workshop experience platform — not a static landing page.

The public site feels like an AI system in motion. Every headline, curriculum day, seat count, price and video is CMS-controlled. Booking is a native checkout with Razorpay verification on the server. There is no Google Form and no silent “offline” content.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Payments | Razorpay (order → checkout → signature verify → seat decrement) |
| Auth | JWT access tokens + httpOnly refresh cookies, role-based admin |

## Quick start

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
# set MONGODB_URI and JWT secrets in server/.env

npm run seed
npm run dev
```

| Surface | URL |
| --- | --- |
| Workshop experience | http://localhost:5173 |
| Booking | http://localhost:5173/book |
| Admin studio | http://localhost:5173/admin |
| API | http://localhost:5000/api/v1 |

Default admin comes from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Change it immediately.

## Design system

Tokens are derived from the official AI IN ACTION logo only:

- Royal purple and electric blue from the letter A
- Ember orange and gold from the growth arrow and gear
- Ink navy from the wordmark
- Geometric sans (Syne) for display, Plus Jakarta Sans for UI

## Content status (no fake pages)

If the CMS is unreachable, visitors see a retry state — never cached dummy copy labelled as live data. After a successful load, the last good payload is kept in session storage so a brief blip does not blank the page.
