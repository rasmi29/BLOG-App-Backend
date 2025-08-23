# Blog Application Backend - MERN Stack

![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A robust, scalable backend API for the Blog Application built with Node.js, Express.js, and MongoDB. This RESTful API provides comprehensive blog management, user authentication, social features, and administrative controls.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Middleware](#-middleware)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🚀 Features

### Core Features
- **User Management**: Registration, authentication, profile management
- **Blog Management**: CRUD operations with rich content support
- **Social Features**: Follow/unfollow users, likes, comments, notifications
- **Search & Discovery**: Full-text search, filtering, categorization
- **Admin Panel**: User management, content moderation, analytics
- **File Upload**: Image upload with Cloudinary integration
- **Email Services**: Notifications and verification emails

### Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10+ salt rounds)
- Rate limiting and CORS protection
- Input validation and sanitization
- Role-based access control (RBAC)
- Account lockout protection

### Performance Features
- MongoDB indexing and query optimization
- Caching strategies for frequently accessed data
- Pagination for large datasets
- Image compression and optimization
- Response compression with gzip

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18.0 or higher)
- **npm** (v8.0 or higher) or **yarn**
- **MongoDB** (v6.0 or higher) - Local or Atlas
- **Redis** (optional, for caching)
- **Cloudinary Account** (for image upload)
- **Email Service** (Gmail, SendGrid, etc.)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/blog-app-backend.git
cd blog-app-backend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Install Development Dependencies
```bash
npm install --save-dev nodemon jest supertest
# or
yarn add -D nodemon jest supertest
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blog_app_dev
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
```

### Environment Variables Description

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Application environment (development/production) | Yes |
| `PORT` | Server port number | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `EMAIL_HOST` | SMTP server hostname | Yes |
| `CLOUDINARY_*` | Cloudinary configuration for file uploads | Yes |
| `REDIS_URL` | Redis connection string (optional) | No |

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection setup
│   ├── jwt.js              # JWT configuration
│   ├── cloudinary.js       # Cloudinary setup
│   └── email.js            # Email configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── blogController.js    # Blog CRUD operations
│   ├── commentController.js # Comment management
│   ├── notificationController.js # Notification system
│   └── adminController.js   # Admin functionalities
├── middleware/
│   ├── authMiddleware.js    # Authentication verification
│   ├── roleMiddleware.js    # Role-based access control
│   ├── errorMiddleware.js   # Global error handling
│   ├── rateLimitMiddleware.js # Rate limiting
│   ├── validationMiddleware.js # Input validation
│   └── uploadMiddleware.js  # File upload handling
├── models/
│   ├── User.js             # User schema
│   ├── Blog.js             # Blog schema
│   ├── Comment.js          # Comment schema
│   ├── Category.js         # Category schema
│   ├── Tag.js              # Tag schema
│   └── Notification.js     # Notification schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── userRoutes.js       # User management routes
│   ├── blogRoutes.js       # Blog management routes
│   ├── commentRoutes.js    # Comment routes
│   ├── notificationRoutes.js # Notification routes
│   └── adminRoutes.js      # Admin routes
├── utils/
│   ├── tokenUtils.js       # JWT token utilities
│   ├── validationUtils.js  # Validation helpers
│   ├── emailUtils.js       # Email utilities
│   ├── uploadUtils.js      # File upload utilities
│   ├── responseUtils.js    # API response formatters
│   └── constants.js        # Application constants
├── tests/
│   ├── auth.test.js        # Authentication tests
│   ├── blog.test.js        # Blog functionality tests
│   ├── user.test.js        # User management tests
│   └── setup.js            # Test setup configuration
├── logs/
│   ├── error.log           # Error logs
│   └── combined.log        # Combined logs
├── .env                    # Environment variables
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
npm start
# or
yarn start
```

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run logs         # View application logs
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json
Authorization: Bearer <refresh_token>
```

### Blog Endpoints

#### Get All Blogs
```http
GET /api/v1/blogs?page=1&limit=10&category=tech&search=node.js
```

#### Create Blog
```http
POST /api/v1/blogs
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Getting Started with Node.js",
  "content": "Blog content here...",
  "excerpt": "Brief description",
  "category": "64a1b2c3d4e5f6789012345",
  "tags": ["nodejs", "javascript", "backend"],
  "status": "published"
}
```

#### Update Blog
```http
PUT /api/v1/blogs/:id
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Updated Blog Title",
  "content": "Updated content..."
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/v1/users/profile
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Full-stack developer",
  "location": "New York, USA"
}
```

#### Follow User
```http
POST /api/v1/users/follow/:userId
Authorization: Bearer <access_token>
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: ["reader", "author", "admin"]),
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    dateOfBirth: Date,
    location: String
  },
  social: {
    followers: [ObjectId],
    following: [ObjectId],
    followersCount: Number,
    followingCount: Number
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  title: String (required),
  content: String (required),
  excerpt: String,
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  tags: [String],
  status: String (enum: ["draft", "published", "archived"]),
  featuredImage: String,
  likes: [ObjectId],
  likesCount: Number,
  viewsCount: Number,
  commentsCount: Number,
  readTime: Number,
  isCommentEnabled: Boolean,
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
// Access Token Payload
{
  userId: "64a1b2c3d4e5f6789012345",
  email: "john@example.com",
  role: "author",
  iat: 1634567890,
  exp: 1634654290
}

// Refresh Token Payload
{
  userId: "64a1b2c3d4e5f6789012345",
  tokenVersion: 1,
  iat: 1634567890,
  exp: 1635172690
}
```

### Role-Based Permissions

| Role | Permissions |
|------|-------------|
| **Reader** | View blogs, comment, like, follow users |
| **Author** | All reader permissions + create/edit/delete own blogs |
| **Admin** | All permissions + user management, content moderation |

### Protected Route Example
```javascript
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect route (authentication required)
router.get('/profile', protect, getUserProfile);

// Role-based access
router.delete('/blog/:id', protect, authorize('author', 'admin'), deleteBlog);

// Admin only
router.get('/users', protect, authorize('admin'), getAllUsers);
```

## ⚡ Middleware

### Authentication Middleware
```javascript
const protect = async (req, res, next) => {
  // Verify JWT token
  // Set req.user
  // Call next()
};
```

### Rate Limiting Middleware
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### Validation Middleware
```javascript
const { body, validationResult } = require('express-validator');

const validateBlog = [
  body('title').isLength({ min: 5, max: 200 }),
  body('content').isLength({ min: 50 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
```

## 🔧 Error Handling

### Global Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```javascript
// Example test file
const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email');
    });
  });
});
```

## 🚢 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/blog_app
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

### Environment Setup for Production

1. **Set production environment variables**
2. **Configure MongoDB Atlas or production database**
3. **Set up Redis for caching (recommended)**
4. **Configure email service (SendGrid, AWS SES)**
5. **Set up monitoring and logging (Winston, Morgan)**
6. **Enable HTTPS and security headers**

### Health Check Endpoint
```javascript
// GET /api/v1/health
{
  "status": "ok",
  "timestamp": "2024-08-21T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please email [support@blogapp.com](mailto:support@blogapp.com) or create an issue in the repository.

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database solution
- All contributors who helped build this project

---

**Made with ❤️ by Rasmiranjan Sahoo**