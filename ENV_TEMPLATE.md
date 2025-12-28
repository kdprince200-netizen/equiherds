# Environment Variables Template

Create a `.env.local` file in your project root with these variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google_console

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

## How to get these values:

1. **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID
   - Copy the Client ID and Client Secret

2. **GOOGLE_MAPS_API_KEY**:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Enable the following APIs: Places API, Geocoding API, Maps JavaScript API
   - Copy the API Key

3. **NEXTAUTH_SECRET**:
   - Generate using: `openssl rand -base64 32`
   - Or use any random 32+ character string

4. **NEXTAUTH_URL**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
