# ⚡ DevFolio — Full Stack MERN Portfolio

A production-ready developer portfolio built with the **MERN Stack** (MongoDB, Express, React, Node.js) + **Vite** + **Bootstrap 5**.

---

## 📁 Project Structure

```
mern-portfolio/
├── client/                  ← React + Vite + Bootstrap (Frontend)
│   ├── public/
│   ├── src/
│   │   ├── components/      ← Navbar, Hero, About, Skills, Projects, Contact
│   │   ├── hooks/           ← useReveal (scroll animation)
│   │   ├── utils/           ← axios API instance
│   │   ├── App.jsx
│   │   ├── main.jsx         ← Bootstrap imported here
│   │   └── index.css        ← CSS variables & global styles
│   ├── index.html
│   ├── vite.config.js       ← Proxy: /api → localhost:5000
│   └── package.json
│
├── server/                  ← Node.js + Express + MongoDB (Backend)
│   ├── config/
│   │   └── db.js            ← Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   ├── auth.js          ← JWT protect middleware
│   │   └── error.js         ← Global error handler + asyncHandler
│   ├── models/
│   │   ├── User.js          ← Admin user with bcrypt
│   │   ├── Contact.js       ← Contact form messages
│   │   └── Project.js       ← Portfolio projects
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   └── projects.js
│   ├── index.js             ← Express server entry
│   ├── .env.example         ← Copy to .env and fill in values
│   └── package.json
│
├── package.json             ← Root scripts to run both
└── README.md
```

---

## 🚀 Quick Start

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Set up backend environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
```

### 3. Run both frontend & backend
```bash
# From root folder:
npm run dev

# Or separately:
npm run client   # → http://localhost:3000
npm run server   # → http://localhost:5000
```

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| React Router v6 | Client-side routing |
| Bootstrap 5.3 | Responsive UI components |
| Bootstrap Icons | Icon set |
| Axios | HTTP client with interceptors |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js | Runtime |
| Express 4 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| express-rate-limit | API rate limiting |
| nodemailer | Email notifications |
| dotenv | Environment variables |
| nodemon | Dev auto-restart |

---

## 🌐 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Projects
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/projects` | Public |
| GET | `/api/projects/:id` | Public |
| POST | `/api/projects` | Private (Admin) |
| PUT | `/api/projects/:id` | Private (Admin) |
| DELETE | `/api/projects/:id` | Private (Admin) |
| POST | `/api/projects/seed` | Private (Dev only) |

### Contact
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/contact` | Public |
| GET | `/api/contact` | Private (Admin) |
| PATCH | `/api/contact/:id/read` | Private (Admin) |
| DELETE | `/api/contact/:id` | Private (Admin) |

---

## ⚙️ Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devfolio
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Optional — for real email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=DevFolio <noreply@devfolio.com>
```

---

## 🎨 Customization

### Change theme colors (`client/src/index.css`)
```css
:root {
  --clr-accent: #c6ff00;   /* Main accent — change to any color */
  --clr-bg:     #080808;   /* Background */
}
```

### Update personal info
- `client/src/components/Hero.jsx` — name, roles, tagline
- `client/src/components/About.jsx` — bio, timeline
- `client/src/components/Contact.jsx` — email, phone, location

---

## 📦 Production Build

```bash
npm run build
# Outputs to client/dist/
```

---

## 👤 Create Admin Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@devfolio.com","password":"admin123"}'
```

---

## 🌱 Seed Sample Projects

```bash
curl -X POST http://localhost:5000/api/projects/seed \
  -H "Authorization: Bearer YOUR_TOKEN"
```
