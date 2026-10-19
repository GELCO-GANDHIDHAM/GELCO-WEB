# GELCO PLUS ELECTRICALS — Website

A professional **product catalogue and enquiry website** built with the MERN stack.

## Project Purpose

Customers **browse categories and products**, then **enquire via WhatsApp** or submit a **Contact Query** form.

> ⚠️ There are **NO prices, NO cart, NO checkout, NO payment, NO customer login**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Images | Cloudinary |
| Deployment | Vercel (Frontend) + Render (Backend) + MongoDB Atlas |

---

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# → Edit backend/.env with your MongoDB URI, JWT secret, Cloudinary keys

# Frontend
cp frontend/.env.example frontend/.env
# → Edit frontend/.env with your WhatsApp number
```

### 3. Seed the Database

```bash
cd backend

# Create admin account
npm run seed:admin

# Create all product categories
npm run seed:categories

# Or run both at once
npm run seed
```

**Default admin credentials:**
- Email: `admin@gelcopluselectricals.com`
- Password: `Gelco@2024`
- ⚠️ Change password after first login!

### 4. Run Both Servers

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

---

## Cloudinary Setup (Image Uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your **Cloud Name**, **API Key**, **API Secret**
3. Add them to `backend/.env`

---

## Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL` → your Render backend URL

### Backend → Render

1. Push the `backend/` folder to GitHub
2. Create a Web Service in [Render](https://render.com)
3. Set root directory to `backend`
4. Add all environment variables from `backend/.env.example`

### Database → MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist IP (`0.0.0.0/0` for Render)
4. Copy connection string → `MONGODB_URI`

---

## Public Routes

| Route | Page |
|---|---|
| `/` | Homepage |
| `/products` | All Products |
| `/products/:slug` | Product Detail |
| `/categories` | All Categories |
| `/category/:slug` | Category Products |
| `/query` | Submit a Query |
| `/contact` | Contact Us |

## Admin Routes (JWT Protected)

| Route | Page |
|---|---|
| `/admin/login` | Admin Login |
| `/admin/dashboard` | Stats Overview |
| `/admin/categories` | Manage Categories |
| `/admin/products` | Manage Products |
| `/admin/queries` | Manage Customer Queries |

## API Endpoints

```
GET  /api/health
GET  /api/categories
GET  /api/categories/:slug
GET  /api/products
GET  /api/products/:slug
GET  /api/products/category/:categorySlug
POST /api/queries
POST /api/admin/login
GET  /api/admin/dashboard     [JWT]
GET  /api/admin/categories    [JWT]
POST /api/admin/categories    [JWT]
PUT  /api/admin/categories/:id [JWT]
DELETE /api/admin/categories/:id [JWT]
GET  /api/admin/products      [JWT]
POST /api/admin/products      [JWT]
PUT  /api/admin/products/:id  [JWT]
DELETE /api/admin/products/:id [JWT]
GET  /api/admin/queries       [JWT]
PUT  /api/admin/queries/:id   [JWT]
POST /api/upload              [JWT]
```

---

## Development Phases

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ Complete | Project initialization, folder structure, health endpoint |
| 2 | ✅ Complete | Database models and backend API |
| 3 | ✅ Complete | Homepage and design system |
| 4 | ✅ Complete | Product catalogue pages |
| 5 | ✅ Complete | WhatsApp enquiry system |
| 6 | ✅ Complete | Customer query form |
| 7 | ✅ Complete | Admin panel |
| 8 | ✅ Complete | Image management (Cloudinary) |
| 9 | ✅ Complete | UI/UX polish |
| 10 | ✅ Complete | Deployment ready |
