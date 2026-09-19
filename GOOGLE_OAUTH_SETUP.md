# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing one)
3. Name it "MySpace"

## Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: MySpace
   - User support email: your email
   - Developer contact: your email
4. Add scopes (optional):
   - `email`
   - `profile`
   - `openid`
5. Add your email as a test user (for development)

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Application type: **Web application**
4. Name: MySpace Web Client
5. Add authorized JavaScript origins:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. Add authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
7. Click **Create**
8. Copy the **Client ID**

## Step 4: Configure Frontend

Create a `.env` file in `productivity-app/`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

## Step 5: Configure Backend

Set the environment variable for the backend:

```bash
export GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

Or add to `application.properties`:
```properties
google.client.id=YOUR_CLIENT_ID.apps.googleusercontent.com
```

## Step 6: Run the Application

```bash
# Frontend
cd productivity-app
npm run dev

# Backend (separate terminal)
cd productivity-backend
mvn spring-boot:run
```

## How It Works

1. User visits MySpace → sees landing page
2. Clicks "Continue with Google"
3. Google OAuth popup appears
4. User authenticates with Google
5. Frontend receives Google ID token (JWT)
6. Frontend decodes the JWT to get user info
7. User info is sent to backend for verification
8. Backend creates/retrieves user
9. Session is established
10. User is redirected to Dashboard

## Security Notes

- The Google ID token is verified server-side
- The backend validates token issuer, audience, and expiration
- User is identified by Google Subject ID (not email alone)
- No passwords are stored
- OAuth tokens are not persisted unnecessarily
- Client secrets are never exposed to the frontend
