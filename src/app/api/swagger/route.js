import swaggerJsdoc from 'swagger-jsdoc';
import { NextResponse } from 'next/server';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GrapplersHub API',
      version: '1.0.0',
      description: 'API documentation for GrapplersHub application',
      contact: {
        name: 'API Support',
        email: 'support@grapplershub.com',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
            },
            firstName: {
              type: 'string',
              required: true,
            },
            lastName: {
              type: 'string',
              required: true,
            },
            email: {
              type: 'string',
              format: 'email',
              required: true,
            },
            phoneNumber: {
              type: 'string',
            },
            grapplingExperience: {
              type: 'string',
            },
            trainingGoals: {
              type: 'string',
            },
            coachingBusinessName: {
              type: 'string',
            },
            yearsOfExperience: {
              type: 'number',
            },
            location: {
              type: 'string',
            },
            cityStateCountry: {
              type: 'string',
            },
            certificationsCredentials: {
              type: 'string',
            },
            clubGymName: {
              type: 'string',
            },
            companyName: {
              type: 'string',
            },
            businessType: {
              type: 'string',
            },
            businessDescription: {
              type: 'string',
            },
            parentClubId: {
              type: 'string',
            },
            vatNo: {
              type: 'string',
            },
            companyLicence: {
              type: 'string',
            },
            stripeAccountId: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            profilePicture: {
              type: 'string',
            },
            accountType: {
              type: 'string',
              enum: ['student', 'coach', 'club', 'vendor', 'superAdmin'],
              required: true,
            },
            payments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Payment',
              },
            },
            stripeCustomerId: {
              type: 'string',
            },
            defaultPaymentMethodId: {
              type: 'string',
            },
            autoRenewalEnabled: {
              type: 'boolean',
              default: true,
            },
            isProcessingPayment: {
              type: 'boolean',
              default: false,
            },
            subscriptionDuration: {
              type: 'number',
            },
            subscriptionExpiry: {
              type: 'string',
              format: 'date-time',
            },
            subscriptionStatus: {
              type: 'string',
              enum: ['active', 'expired', 'pending', 'cancelled'],
              default: 'pending',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'accountType'],
          properties: {
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            password: {
              type: 'string',
            },
            confirmPassword: {
              type: 'string',
            },
            phoneNumber: {
              type: 'string',
            },
            accountType: {
              type: 'string',
              enum: ['student', 'coach', 'club', 'vendor', 'superAdmin'],
            },
            grapplingExperience: {
              type: 'string',
            },
            trainingGoals: {
              type: 'string',
            },
            coachingBusinessName: {
              type: 'string',
            },
            yearsOfExperience: {
              type: 'number',
            },
            location: {
              type: 'string',
            },
            cityStateCountry: {
              type: 'string',
            },
            certificationsCredentials: {
              type: 'string',
            },
            clubGymName: {
              type: 'string',
            },
            companyName: {
              type: 'string',
            },
            businessType: {
              type: 'string',
            },
            businessDescription: {
              type: 'string',
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            paymentId: {
              type: 'string',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            amount: {
              type: 'number',
            },
            currency: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            palnType: {
              type: 'string',
              enum: ['monthly', 'yearly'],
            },
            userId: {
              type: 'string',
            },
            customerName: {
              type: 'string',
            },
            customerEmail: {
              type: 'string',
            },
            subscriptionId: {
              type: 'string',
            },
            subscriptionName: {
              type: 'string',
            },
            subscriptionPrice: {
              type: 'number',
            },
            subscriptionDuration: {
              type: 'number',
            },
            subscriptionStatus: {
              type: 'string',
            },
            subscriptionExpiry: {
              type: 'string',
            },
          },
        },
        Subscription: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Subscription ID',
            },
            name: {
              type: 'string',
              required: true,
            },
            price: {
              type: 'number',
              required: true,
            },
            discount: {
              type: 'number',
              default: 0,
            },
            duration: {
              type: 'number',
              required: true,
            },
            description: {
              type: 'object',
            },
            details: {
              type: 'string',
            },
            offermonth: {
              type: 'number',
              default: 0,
            },
            discountoffermonth: {
              type: 'number',
              default: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SubscriptionInput: {
          type: 'object',
          required: ['name', 'price', 'duration'],
          properties: {
            name: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
            discount: {
              type: 'number',
            },
            duration: {
              type: 'number',
            },
            description: {
              type: 'object',
            },
            details: {
              type: 'string',
            },
            offermonth: {
              type: 'number',
            },
            discountoffermonth: {
              type: 'number',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Subscriptions',
        description: 'Subscription management endpoints',
      },
    ],
  },
  apis: [
    './src/app/api/**/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}

