# Deployment Variables Checklist

This document lists all environment variables required for production deployment.

---

## Frontend (Vercel)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | ✅ Yes | `123456789-abc.apps.googleusercontent.com` | Google OAuth Client ID from Google Cloud Console |
| `VITE_API_URL` | ✅ Yes | `https://myspace-api.onrender.com/api` | Backend API URL (your Render deployment) |

### Vercel Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework Preset**: Vite

---

## Backend (Render)

### Required Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `PORT` | ⚙️ Auto | `8080` | Server port (Render provides this automatically) |
| `DB_HOST` | ✅ Yes | `dpg-xxxxx.render.com` | PostgreSQL host from Render database |
| `DB_PORT` | ✅ Yes | `5432` | PostgreSQL port (usually 5432) |
| `DB_NAME` | ✅ Yes | `productivity_db` | Database name |
| `DB_USERNAME` | ✅ Yes | `productivity_db_user` | Database username |
| `DB_PASSWORD` | ✅ Yes | `your-secure-password` | Database password |
| `GOOGLE_CLIENT_ID` | ✅ Yes | `123456789-abc.apps.googleusercontent.com` | Same as frontend Google Client ID |
| `JWT_SECRET` | ✅ Yes | `64+ character random string` | JWT signing secret (HS512 requires 64+ bytes) |
| `JWT_EXPIRATION_MS` | ✅ Yes | `604800000` | Token expiration in milliseconds (7 days = 604800000) |
| `FRONTEND_URL` | ✅ Yes | `https://myspace.vercel.app` | Frontend URL for CORS (your Vercel deployment) |

### Optional Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_POOL_SIZE` | ❌ No | `10` | Database connection pool size |
| `JPA_DDL_AUTO` | ❌ No | `update` | Hibernate DDL auto mode (use `validate` in production) |
| `FLYWAY_ENABLED` | ❌ No | `false` | Enable Flyway database migrations |
| `MAIL_ENABLED` | ❌ No | `false` | Enable email notifications |
| `MAIL_HOST` | ❌ No | - | SMTP server host (e.g., `smtp.gmail.com`) |
| `MAIL_PORT` | ❌ No | `587` | SMTP server port |
| `MAIL_USERNAME` | ❌ No | - | SMTP username (email address) |
| `MAIL_PASSWORD` | ❌ No | - | SMTP password (use app-specific password) |
| `MAIL_FROM` | ❌ No | `noreply@myspace.app` | Sender email address |

### Render Configuration

- **Build Command**: `mvn clean package`
- **Start Command**: `java -jar target/productivity-backend-0.0.1-SNAPSHOT.jar`
- **Environment**: `Docker` or `Native`
- **Plan**: Free or paid tier

---

## Database (Render PostgreSQL)

### Creating the Database

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `myspace-database`
   - **Database**: `productivity_db`
   - **User**: `productivity_db_user`
   - **Region**: Same as your backend service
4. Click "Create Database"
5. Copy the **Internal Connection String** or **External Connection String**
6. Extract host, port, database name, username, and password
7. Add these to your backend environment variables

---

## Google OAuth Configuration

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google Identity" API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: **Web application**
6. Name: `MySpace`
7. Add **Authorized JavaScript origins**:
   - Development: `http://localhost:5173`
   - Production: `https://your-app.vercel.app`
8. Add **Authorized redirect URIs**:
   - Development: `http://localhost:8080/api/auth/google`
   - Production: `https://your-backend.onrender.com/api/auth/google`
9. Click "Create"
10. Copy the **Client ID**
11. Add to both frontend and backend environment variables

---

## Generating Secure Secrets

### JWT Secret (64+ characters)

```bash
# Option 1: OpenSSL
openssl rand -base64 64

# Option 2: Python
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

# Option 3: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Database Password

Use a strong password generator or:

```bash
openssl rand -base64 32
```

---

## Environment Variable Examples

### Development (.env)

**Frontend:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-dev.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080/api
```

**Backend:**
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productivity_db
DB_USERNAME=postgres
DB_PASSWORD=local-dev-password
GOOGLE_CLIENT_ID=123456789-dev.apps.googleusercontent.com
JWT_SECRET=dev-secret-key-at-least-64-characters-long-for-hs512-security-requirements
JWT_EXPIRATION_MS=604800000
FRONTEND_URL=http://localhost:5173
```

### Production

**Frontend (Vercel):**
```env
VITE_GOOGLE_CLIENT_ID=123456789-prod.apps.googleusercontent.com
VITE_API_URL=https://myspace-api.onrender.com/api
```

**Backend (Render):**
```env
PORT=10000
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=productivity_db
DB_USERNAME=productivity_db_user
DB_PASSWORD=super-secure-production-password
GOOGLE_CLIENT_ID=123456789-prod.apps.googleusercontent.com
JWT_SECRET=production-secret-key-at-least-64-characters-long-generated-securely
JWT_EXPIRATION_MS=604800000
FRONTEND_URL=https://myspace.vercel.app
MAIL_ENABLED=true
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=notifications@myspace.app
MAIL_PASSWORD=app-specific-password
MAIL_FROM=notifications@myspace.app
```

---

## Security Checklist

Before deploying to production:

- [ ] All secrets are stored in environment variables (not in code)
- [ ] `JWT_SECRET` is at least 64 characters and randomly generated
- [ ] Database password is strong and unique
- [ ] Google OAuth is configured with correct production URLs
- [ ] `FRONTEND_URL` points to your actual Vercel deployment
- [ ] `VITE_API_URL` points to your actual Render deployment
- [ ] No `.env` files are committed to Git
- [ ] CORS is configured to allow only your frontend domain
- [ ] HTTPS is enabled (Vercel and Render provide this automatically)
- [ ] Database is not accessible from public internet (use Render's internal connection)

---

## Troubleshooting

### Frontend Cannot Connect to Backend

- Check `VITE_API_URL` is correct
- Verify backend is running and accessible
- Check CORS configuration (`FRONTEND_URL` matches your Vercel domain)
- Check browser console for CORS errors

### Google OAuth Fails

- Verify `GOOGLE_CLIENT_ID` is the same in frontend and backend
- Check Google Cloud Console for correct authorized origins and redirect URIs
- Ensure URLs use HTTPS in production

### Database Connection Fails

- Verify all `DB_*` variables are correct
- Check Render database is running
- Use internal connection string if backend and database are on same Render account
- Check firewall/security group settings

### JWT Authentication Fails

- Verify `JWT_SECRET` is at least 64 characters
- Check `JWT_EXPIRATION_MS` is set correctly
- Ensure frontend is sending `Authorization: Bearer <token>` header

---

## Support

For deployment issues, check:
- Vercel deployment logs
- Render service logs
- Google Cloud Console OAuth settings
- Render database connection details
