# YourStore (React)

Mini ecommerce SPA for the **SDE Developer Intern 2025** assignment. Built with React, React Router, and Redux Toolkit. Product data comes from the [Fake Store API](https://fakestoreapi.com/) with `localStorage` caching.

## Setup and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests (Vitest) |

## Routes

| Path | Page |
|------|------|
| `/` | Product listing (all products, search, category filter) |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (name, email, address) |
| `/order-placed` | Order confirmation |
| `/login` | Sign in (Fake Store users API) |
| `/profile` | Profile and saved addresses |

## Folder structure

```text
src/
  components/   Shared UI (navbar, cards, zoom, forms)
  hooks/        useCatalog, useCartTotals
  pages/        Route-level screens
  router/       React Router routes
  services/     API fetch + localStorage cache
  stores/       Redux slices (products, cart, checkout, auth)
  utils/        Validation and helpers
  test/         Vitest setup
public/         Static assets (hero image)
```

## Design decisions

- **Fake Store API** with normalized product shape in `services/products.js`.
- **Redux Toolkit** for products, cart, checkout order, and optional auth state.
- **localStorage**: 30-minute TTL cache for products/categories; persistent cart and latest order.
- **Product listing on `/`**: grid shows all products by default; optional hero when no search/category filter.
- **Category filter**: category buttons in the navbar (click **YourStore** to clear filters and show all products).
- **Checkout**: name, email, and structured address with validation; clears cart and navigates to confirmation.
- **PDP**: quantity 1–5; cart line items allow quantity 1–10.

## Trade-offs

- Checkout is frontend-only (no payment gateway or real order API).
- Shipping rule: $8.99 under $75, otherwise free.
- Product detail uses the cached product list (no per-id API call).
- Login/profile are enhancements beyond the minimum brief.
- Product image hover zoom is desktop-only.

## Bonus features

- Home hero banner
- Desktop product image zoom (50ms stationary hover to activate)
- User login and saved addresses (Fake Store users)
- Responsive layout for tablet and phone

## Assignment checklist

- [x] Product listing: grid, search, category filter, loading, errors
- [x] Product detail: image, title, description, price, rating, add to cart (qty 1–5)
- [x] Cart: update/remove, qty 1–10, grand total, proceed to checkout
- [x] Checkout: summary, validated form, place order, confirmation
- [x] Data caching (`localStorage`)
- [x] Redux global state
- [x] Clean folder structure
- [x] Unit tests for cart and checkout validation

## Deploying

Build static assets:

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, etc.). Configure the host to serve `index.html` for client-side routes.

## License

Private — assignment submission.
