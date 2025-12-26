# GrapplersHub API Documentation

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/grapplershub
# Or use MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grapplershub?retryWrites=true&w=majority

# Server Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
PORT=3000

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-here

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Environment
NODE_ENV=development
```

## API Endpoints

### Users API

#### Get All Users
- **GET** `/api/users`
- Query Parameters:
  - `accountType` (optional): Filter by account type (student, coach, club, vendor, superAdmin)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

#### Get User by ID
- **GET** `/api/users/[id]`

#### Create User
- **POST** `/api/users`
- Body: User object (see schema below)

#### Update User
- **PUT** `/api/users/[id]`
- Body: User object fields to update

#### Delete User
- **DELETE** `/api/users/[id]`

### Subscriptions API

#### Get All Subscriptions
- **GET** `/api/subscriptions`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

#### Get Subscription by ID
- **GET** `/api/subscriptions/[id]`

#### Create Subscription
- **POST** `/api/subscriptions`
- Body: Subscription object (see schema below)

#### Update Subscription
- **PUT** `/api/subscriptions/[id]`
- Body: Subscription object fields to update

#### Delete Subscription
- **DELETE** `/api/subscriptions/[id]`

## Swagger Documentation

Access the interactive Swagger UI at:
- **URL**: `http://localhost:3000/api-docs`

This provides a complete interactive API documentation where you can test all endpoints.

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... } // Only for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Set up your `.env` file with database credentials

3. Run the development server:
```bash
npm run dev
```

4. Access the API documentation at `http://localhost:3000/api-docs`

