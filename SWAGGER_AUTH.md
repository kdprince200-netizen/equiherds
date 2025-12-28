# Protected Swagger API Documentation

## Overview
The Swagger API documentation is now protected and requires authentication. Only users with `superAdmin` account type can access the API documentation.

## How to Access

1. **Navigate to Swagger**: Go to `/swagger` in your browser
2. **Login Prompt**: You'll see a login form asking for email and password
3. **Enter Credentials**: Use the email and password of a user with `superAdmin` account type
4. **Access Granted**: Once authenticated, you'll see the full Swagger API documentation

## Authentication Details

### Requirements
- User must exist in the database
- User must have `accountType: "superAdmin"`
- For local auth users: Password must match
- For Google auth users: Access is granted if they're superAdmin (no password verification)

### Security Features
- Basic HTTP Authentication
- Database verification for each request
- Account type validation
- Password verification for local auth users
- Session-based access (credentials required for each API call)

## API Endpoints

### Protected Swagger Spec
- **Endpoint**: `/api/docs`
- **Method**: GET
- **Authentication**: Basic Auth required
- **Response**: Swagger JSON specification

### Error Responses
- **401 Unauthorized**: Invalid credentials or user not found
- **403 Forbidden**: User exists but is not a superAdmin
- **500 Internal Server Error**: Server-side error

## Usage Examples

### Using curl
```bash
curl -u "admin@example.com:password" http://localhost:3000/api/docs
```

### Using JavaScript fetch
```javascript
const credentials = btoa('admin@example.com:password');
const response = await fetch('/api/docs', {
  headers: {
    'Authorization': 'Basic ' + credentials
  }
});
```

## Setup Instructions

1. Ensure you have a user with `accountType: "superAdmin"` in your database
2. The user can be created through your regular registration process
3. Update the user's account type to "superAdmin" in the database
4. Access `/swagger` and login with the superAdmin credentials

## Troubleshooting

### "Access denied. SuperAdmin account required."
- The user exists but doesn't have superAdmin account type
- Update the user's accountType in the database

### "Invalid credentials"
- Email or password is incorrect
- User doesn't exist in the database
- For Google auth users, this might indicate an issue with the authentication flow

### "Connection error"
- Check if the development server is running
- Verify the `/api/docs` endpoint is accessible
- Check browser console for detailed error messages
