# Hibiscus Admin Dashboard

Admin dashboard untuk mengelola konten landing page Hibiscus Efsya.

## Fitur

- 🔐 Authentication dengan JWT
- 📝 Edit Hero Section
- 👥 Edit About Section
- 🛍️ Manage Services
- 📞 Edit Contact Information
- 📁 Media Library
- 📊 Dashboard Analytics

## Tech Stack

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion

## Setup

### 1. Database

Pastikan database MySQL sudah ada dengan credentials di file `.env`

### 2. Install Dependencies

```bash
npm install
cd client && npm install
```

### 3. Setup Database Tables

```bash
npm run setup-db
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## Default Login

- Username: `admin`
- Password: `admin123`

⚠️ Ganti password setelah login pertama!

## Environment Variables

Buat file `.env` di root folder:

```env
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Content
- `GET /api/content/all` - Get all content
- `GET/PUT /api/content/hero` - Hero section
- `GET/PUT /api/content/about` - About section
- `GET/PUT /api/content/contact` - Contact section
- `GET/PUT /api/content/footer` - Footer section

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:id` - Delete file
