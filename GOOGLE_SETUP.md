# Google OAuth Setup Instructions

## 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth client ID"
6. Choose "Web application"
7. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

## 2. Enable Google Maps APIs

1. In the same Google Cloud Console project
2. Go to "APIs & Services" → "Library"
3. Search for and enable the following APIs:
   - **Places API** (for location search)
   - **Geocoding API** (for address conversion)
   - **Maps JavaScript API** (for map display)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key for use in your environment variables

## 3. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 4. Generate NextAuth Secret

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## 5. Features

- ✅ Google OAuth login/registration
- ✅ No OTP required for Google users
- ✅ Automatic user creation
- ✅ Default account type: "buyer"
- ✅ Profile picture from Google
- ✅ Seamless integration with existing auth system
- ✅ Google Maps location search with Places API
- ✅ Enhanced location picker with single input field
- ✅ Support for complex address searches (e.g., "Le chêne brûlé 49490 noyant village France")

## 6. User Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth
3. User authorizes the application
4. User is created automatically (if new) or logged in (if existing)
5. Redirected to profile page

## 7. Database Changes

The User model has been updated to support:
- `googleId`: Google user ID
- `authProvider`: Either 'local' or 'google'
- `password`: Optional for Google users
- `phoneNumber`: Optional for Google users
