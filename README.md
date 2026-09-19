# MySpace

**Plan • Do • Grow**

A comprehensive productivity platform that helps you organize tasks, track goals, manage learning, and build habits—all in one place.

---

## 🌟 Overview

MySpace is a full-stack productivity application designed to help you:

- **Plan** your day, week, and long-term goals
- **Do** tasks with focus timers and subtask tracking
- **Grow** through learning management and skill development

### Key Features

- 📋 **Task Management** - Create, organize, and track tasks with subtasks
- 📅 **Calendar Integration** - Schedule events and time blocks
- 🎯 **Goal Tracking** - Set milestones and track progress
- 📚 **Learning Management** - Organize topics and track study progress
- 📓 **Daily Journal** - Reflect on your day and track mood
- 🏆 **Rewards System** - Unlock rewards based on completion percentage
- 🔐 **Google Authentication** - Secure sign-in with Google OAuth
- 💾 **Guest Mode** - Try the app without signing up
- 📧 **Email Notifications** - Daily completion summaries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  React + TypeScript + Vite + Tailwind CSS               │
│  Deployed on: Vercel                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS (REST API)
                     │ Authorization: Bearer <JWT>
                     │
┌────────────────────▼────────────────────────────────────┐
│                      Backend                             │
│  Spring Boot + Spring Security + JWT                    │
│  Deployed on: Render                                     │
└────┬──────────────────────────────┬─────────────────────┘
     │                              │
     │                              │
┌────▼──────────┐         ┌────────▼────────┐
│  PostgreSQL   │         │  Google OAuth   │
│  (Database)   │         │  (Identity)     │
└───────────────┘         └─────────────────┘
```

### Authentication Flow

```
User clicks "Continue with Google"
         ↓
Google returns ID token
         ↓
Frontend sends token to /api/auth/google
         ↓
Backend verifies token with Google
         ↓
Backend creates/finds user in database
         ↓
Backend generates MySpace JWT (HS512)
         ↓
Frontend stores JWT
         ↓
All API requests include: Authorization: Bearer <JWT>
         ↓
Backend validates JWT and enforces user isolation
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with JWT interceptors
- **Zustand** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Java 17** - Programming language
- **Spring Boot 3** - Application framework
- **Spring Security** - Authentication & authorization
- **JWT (JJWT)** - Token-based authentication
- **Spring Data JPA** - Database access
- **Hibernate** - ORM
- **PostgreSQL** - Relational database
- **Maven** - Build tool
- **Google API Client** - OAuth token verification

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **PostgreSQL** - Managed database

---

## 📦 Project Structure

```
myspace/
├── productivity-app/          # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API clients and business logic
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── productivity-backend/      # Backend Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/productivity/
│   │       │   ├── config/    # Security, CORS, etc.
│   │       │   ├── controller/# REST controllers
│   │       │   ├── dto/       # Data transfer objects
│   │       │   ├── entity/    # JPA entities
│   │       │   ├── repository/# Data access layer
│   │       │   ├── security/  # JWT, Google OAuth
│   │       │   └── service/   # Business logic
│   │       └── resources/
│   │           ├── db/migration/  # Flyway migrations
│   │           └── application.properties
│   ├── pom.xml
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **Java 17+** and Maven
- **PostgreSQL 14+**
- **Google OAuth Client ID** (see [Google OAuth Setup](GOOGLE_OAUTH_SETUP.md))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/myspace.git
cd myspace
```

### 2. Database Setup

```bash
# Create database
createdb productivity_db

# Or using psql
psql -U postgres
CREATE DATABASE productivity_db;
\q
```

### 3. Backend Setup

```bash
cd productivity-backend

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# - Set GOOGLE_CLIENT_ID
# - Set JWT_SECRET (64+ characters)
# - Set database credentials

# Build the application
mvn clean package

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd productivity-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env
# - Set VITE_GOOGLE_CLIENT_ID (same as backend)
# - Set VITE_API_URL=http://localhost:8080/api

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

---

## 🏭 Production Build

### Frontend

```bash
cd productivity-app
npm run build
```

The production build will be in `dist/` directory.

### Backend

```bash
cd productivity-backend
mvn clean package
```

The JAR file will be in `target/productivity-backend-0.0.1-SNAPSHOT.jar`

Run with:

```bash
java -jar target/productivity-backend-0.0.1-SNAPSHOT.jar
```

---

## 🔐 Environment Variables

### Frontend (.env)

```env
# Google OAuth Client ID (from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Backend API URL
# Development: http://localhost:8080/api
# Production: https://your-backend.onrender.com/api
VITE_API_URL=http://localhost:8080/api
```

### Backend (.env)

```env
# Server
PORT=8080

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productivity_db
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# JWT Authentication
# Generate with: openssl rand -base64 64
JWT_SECRET=your-64-character-or-longer-secret-key
JWT_EXPIRATION_MS=604800000

# CORS - Frontend URL
# Development: http://localhost:5173
# Production: https://your-frontend.vercel.app
FRONTEND_URL=http://localhost:5173

# Email (Optional)
MAIL_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@myspace.app
```

**⚠️ Security Notes:**
- Never commit `.env` files to version control
- Use strong, random values for `JWT_SECRET` (64+ characters)
- Use app-specific passwords for email (not your main password)
- Restrict Google OAuth to your domain in production

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_API_URL` (point to your Render backend)
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Configure environment variables (all backend variables from above)
5. Set build command: `mvn clean package`
6. Set start command: `java -jar target/productivity-backend-0.0.1-SNAPSHOT.jar`
7. Deploy

### Database (Render PostgreSQL)

1. Create new PostgreSQL database on Render
2. Copy connection details
3. Update backend environment variables with database credentials

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-app.vercel.app` (production)
4. Add authorized redirect URIs:
   - `http://localhost:8080/api/auth/google` (development)
   - `https://your-backend.onrender.com/api/auth/google` (production)
5. Copy Client ID to environment variables

---

## 🧪 Testing

### Frontend

```bash
cd productivity-app
npm run lint
```

### Backend

```bash
cd productivity-backend
mvn test
```

---

## 🔒 Security Features

- **JWT Authentication** - HS512 signing with 64-byte minimum secret
- **Google OAuth 2.0** - Official Google token verification
- **User Isolation** - Every query scoped by user ID to prevent IDOR
- **CSRF Protection** - Disabled (JWT not cookies)
- **Stateless Sessions** - No server-side session storage
- **CORS Configuration** - Environment-based origin whitelist
- **No Hardcoded Secrets** - All credentials from environment variables
- **HTTPS Only** - Production deployments use HTTPS

---

## 📄 License

This project is proprietary and confidential.

---

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and insights
- [ ] Collaboration features
- [ ] API for third-party integrations

---

**Built with ❤️ for productivity enthusiasts**
