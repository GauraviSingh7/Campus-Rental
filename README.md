# 🏫 Campus Rental & Resale Platform

A full-stack web application designed for students to **rent or sell items within a college campus**. This platform facilitates peer-to-peer transactions, allowing users to list items with flexible pricing and negotiate directly with peers.

Built with **Next.js, FastAPI, and PostgreSQL (Supabase)** using a scalable, modern architecture.

---

## 🚀 Features

### 👤 User Management
- **Secure Authentication:** Integrated with Supabase Auth.
- **Campus-Restricted:** Optional access restriction to college email domains.
- **User Profiles:** Manage personal contact details and active listings.

### 📦 Item Listings
- **Dual Pricing:** List items for sale, daily rent, or both.
- **Media Support:** Upload multiple images per item.
- **Tagging:** Categorization and condition status (New, Used, etc.).

### 🔍 Discovery & Communication
- **Advanced Filtering:** Filter by category, price range, and listing type.
- **Direct Contact:** Seller contact details visible for direct negotiation (no in-app fees).

---

## 🧱 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router), Tailwind CSS, React Hook Form |
| **Backend** | FastAPI, SQLAlchemy (Async), Pydantic |
| **Database** | PostgreSQL (Supabase) |
| **Storage** | Supabase Storage (for item images) |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) |

---

## 🏗️ System Architecture

```
Frontend (Next.js + Tailwind)
        ↓ REST API
Backend (FastAPI)
        ↓ ORM
PostgreSQL (Supabase)
        ↓
Supabase Storage (Images)
```

---

## 🗂️ Database Schema

### **Users**
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique user identifier |
| `name` | VARCHAR | Full name |
| `email` | VARCHAR | Unique college email |
| `phone` | VARCHAR | Contact number |
| `created_at` | TIMESTAMP | Account creation date |

### **Items**
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique item identifier |
| `title` | VARCHAR | Name of the item |
| `sell_price` | NUMERIC | Sale price (optional) |
| `rent_price_per_day` | NUMERIC | Rental price (optional) |
| `owner_id` | UUID (FK) | References `Users.id` |
| `category_id` | INT (FK) | References `Categories.id` |

---

## 🧪 Validation Rules

- **Price Requirement:** An item must have at least one price (sell or rent).
- **Rental Logic:** Rental price must be greater than 0.
- **Ownership:** Only item owners can edit or delete their listings.
- **Media Limit:** Maximum of 5 images per item.

---

## 📡 API Endpoints (Quick Reference)

### **Items**
- `GET /items` – Browse all listings
- `POST /items` – Create a new listing
- `PUT /items/{id}` – Update a listing
- `DELETE /items/{id}` – Remove a listing

### **Auth**
- `POST /auth/signup` – Register new user
- `POST /auth/login` – Authenticate user

---

## 📈 Roadmap

- [x] **Phase 1:** MVP (Auth, Listings, Image Uploads)
- [ ] **Phase 2:** Wishlist, view counts, and item availability status
- [ ] **Phase 3:** In-app chat and admin moderation dashboard
