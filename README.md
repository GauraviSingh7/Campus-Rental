# 🏫 Campus Rental & Resale Platform

> A peer-to-peer marketplace built for students — rent, sell, or buy items within your college campus without middlemen or in-app fees.

🌐 **Live App:** [campus-rental-weld.vercel.app](https://campus-rental-weld.vercel.app)

---

## 🚀 Features

### 👤 User Management
- **Secure Authentication** via Supabase Auth
- **User Profiles** with personal contact details and active listings

### 📦 Item Listings
- **Dual Pricing** — list items for sale, daily rent, or both
- **Media Support** — upload up to 5 images per item
- **Tagging** — categorization and condition status (New, Used, etc.)

### 🔍 Discovery & Communication
- **Browse Listings** — explore all available items on campus
- **WhatsApp Integration** — interested buyers/renters can instantly open a WhatsApp chat with the seller via a direct redirect link
- **Direct Contact** — no in-app fees or middlemen; negotiate directly with peers

### 🛠️ Item Management
- **Create, Edit & Delete** your own listings at any time
- **Ownership Enforcement** — only the item owner can modify or remove their listing

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), Tailwind CSS, React Hook Form |
| Backend | FastAPI, SQLAlchemy (Async), Pydantic |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage (item images) |
| Messaging | WhatsApp API (chat redirect) |
| Deployment | Vercel (Frontend), Render/Railway (Backend) |

---

## 🏗️ System Architecture

```
Frontend (Next.js + Tailwind)
        ↓ REST API
Backend (FastAPI)
        ↓ ORM (SQLAlchemy Async)
PostgreSQL (Supabase)
        ↓
Supabase Storage (Images)
```

---

## 🗂️ Database Schema

### Users

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique user identifier |
| `name` | VARCHAR | Full name |
| `email` | VARCHAR | Unique college email |
| `phone` | VARCHAR | Contact number |
| `created_at` | TIMESTAMP | Account creation date |

### Items

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Unique item identifier |
| `title` | VARCHAR | Name of the item |
| `sell_price` | NUMERIC | Sale price (optional) |
| `rent_price_per_day` | NUMERIC | Rental price per day (optional) |
| `owner_id` | UUID (FK) | References `Users.id` |
| `category_id` | INT (FK) | References `Categories.id` |

---

## 🧪 Validation Rules

- **Price Requirement** — an item must have at least one price (sale or rental)
- **Rental Logic** — rental price must be greater than 0
- **Ownership** — only item owners can edit or delete their listings
- **Media Limit** — maximum of 5 images per item

---

## 📡 API Endpoints

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/items` | Browse all listings |
| `POST` | `/items` | Create a new listing |
| `PUT` | `/items/{id}` | Update a listing |
| `DELETE` | `/items/{id}` | Remove a listing |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Authenticate a user |

---

## 🖥️ Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Supabase project (for database and storage)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # Add your Supabase keys
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # Add your Supabase connection string
uvicorn main:app --reload
```

---

## ☁️ Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [campus-rental-weld.vercel.app](https://campus-rental-weld.vercel.app) |
| Backend | Render / Railway | *(your backend URL)* |
| Database | Supabase | *(your Supabase project)* |

---

## 📄 License

This project is for educational purposes. Feel free to fork and adapt it for your own campus community.
