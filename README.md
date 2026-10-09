# NexCart Web

React + TypeScript storefront for the NexCart API.

## Setup

```bash
cd nexcart-web
npm install
cp .env.example .env
npm run dev
```

Start the backend from the sibling folder:

```bash
cd ../nexcart-api
npm run dev
```

Vite proxies `/api` and `/uploads` to `http://localhost:5000` during local development.

## Environment

```env
VITE_API_BASE_URL=/api/v1
VITE_APP_NAME=NexCart
```

## Scripts

- `npm run dev` - local development
- `npm run build` - TypeScript check and production build
- `npm run lint` - ESLint
- `npm run test:run` - Vitest + React Testing Library
- `npm run format` - Prettier

## Features

- Storefront: home, products, product details, categories
- Customer: cart, checkout, orders, profile, wishlist
- Seller: dashboard, products, inventory, orders
- Admin: dashboard, users, products, orders
- Login with JWT access tokens and refresh cookies
- Light/dark theme

## Deployment (Vercel + AWS)

`vercel.json` proxies API and upload requests to the AWS backend:

- `/api/*` → `http://51.20.151.235:5000/api/*`
- `/uploads/*` → `http://51.20.151.235:5000/uploads/*`

Set these in Vercel:

```env
VITE_API_BASE_URL=/api/v1
VITE_APP_NAME=NexCart
```

Do **not** set `VITE_API_ORIGIN` to `http://51.20.151.235:5000` on Vercel. That loads HTTP images on an HTTPS page and browsers block them. Keep image paths relative (`/uploads/...`) so Vercel can proxy them.

Redeploy after updating environment variables.

If product images still 404, the files may be missing on the EC2 server. Copy the `uploads/` folder to the backend host or re-upload products in production.
