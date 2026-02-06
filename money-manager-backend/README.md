# 💰 Money Manager Backend API

A complete, production-ready RESTful API backend for financial management built with Node.js, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> **⭐ New to this project? Start with [INDEX.md](INDEX.md) for a complete documentation guide!**

---

## 📖 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Backend API for the Money Manager application built with Node.js, Express, and MongoDB.

### Key Capabilities

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 💸 **Transaction Management** - Complete CRUD with 12-hour edit restriction
- 🏦 **Multi-Account Support** - Cash, bank, and credit card accounts
- 📊 **Advanced Analytics** - Monthly, weekly, yearly summaries with trends
- 🔄 **Account Transfers** - Seamless money transfers between accounts
- 🏷️ **Smart Categories** - 21 predefined categories with custom support
- 📈 **Real-time Reporting** - Category breakdowns, division tracking
- 🔍 **Powerful Filtering** - Date ranges, amounts, categories, divisions

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see REQUIRED_INFORMATION.md)
# Update .env with your MongoDB URI and JWT secret

# 3. Seed database with categories
npm run seed

# 4. Start development server
npm run dev

# 5. Test the API
curl http://localhost:5000/api/health
```

**🎯 For detailed setup instructions, see [INSTALLATION_STEPS.md](INSTALLATION_STEPS.md)**

---

## ✨ Features

### Core Features

#### 🔐 Authentication & Security
- JWT token-based authentication
- Secure password hashing (bcrypt)
- Protected API routes
- Input validation
- CORS configuration

#### 💰 Transaction Management
- Create, read, update, delete transactions
- Income and expense tracking
- 12-hour edit window restriction
- Category-based organization
- Division tracking (office/personal)
- Date range filtering
- Amount range filtering
- Automatic account balance updates

#### 🏦 Account Management
- Multiple account types (cash, bank, credit card)
- Real-time balance tracking
- Inter-account transfers
- Transfer history
- Account CRUD operations

#### 📊 Analytics & Reporting
- Monthly, weekly, yearly summaries
- Category breakdown with percentages
- Division-based analysis
- Income vs expense trends
- Period-over-period comparisons
- Custom date range analytics

#### 🏷️ Category System
- 21 predefined categories
- 6 income categories
- 15 expense categories
- Custom category creation
- Icon and color customization

---

## 📚 Documentation

We have comprehensive documentation to help you get started:

### 🚀 Getting Started
- **[INDEX.md](INDEX.md)** - Documentation index and navigation guide
- **[REQUIRED_INFORMATION.md](REQUIRED_INFORMATION.md)** - What you need before starting
- **[INSTALLATION_STEPS.md](INSTALLATION_STEPS.md)** - Step-by-step installation guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and examples

### 📖 Detailed Guides
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Multi-platform deployment guides
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive project overview

### 🔧 Reference
- **[DIRECTORY_STRUCTURE.txt](DIRECTORY_STRUCTURE.txt)** - Complete file tree
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[postman_collection.json](postman_collection.json)** - Postman API collection

**👉 Start with [INDEX.md](INDEX.md) for a complete documentation guide!**

---

## 🔌 API Endpoints

### Authentication (3 endpoints)
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Transactions (6 endpoints)
```
GET    /api/transactions              - Get all transactions (with filters)
GET    /api/transactions/:id          - Get single transaction
POST   /api/transactions              - Create transaction
PUT    /api/transactions/:id          - Update transaction
DELETE /api/transactions/:id          - Delete transaction
GET    /api/transactions/date-range   - Get by date range
```

### Categories (5 endpoints)
```
GET    /api/categories       - Get all categories
GET    /api/categories/:id   - Get single category
POST   /api/categories       - Create category
PUT    /api/categories/:id   - Update category
DELETE /api/categories/:id   - Delete category
```

### Accounts (6 endpoints)
```
GET    /api/accounts              - Get all accounts
GET    /api/accounts/:id          - Get single account
POST   /api/accounts              - Create account
PUT    /api/accounts/:id          - Update account
DELETE /api/accounts/:id          - Delete account
POST   /api/accounts/transfer     - Transfer between accounts
GET    /api/accounts/transfers    - Get transfer history
```

### Analytics (5 endpoints)
```
GET    /api/analytics/summary              - Get period summary
GET    /api/analytics/category-breakdown   - Category analysis
GET    /api/analytics/division-breakdown   - Division analysis
GET    /api/analytics/weekly               - Weekly data
GET    /api/analytics/yearly               - Yearly data
```

**📖 For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)**

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js (v4.18)
- **Database**: MongoDB with Mongoose ODM (v8.0)

### Security
- **Authentication**: JWT (jsonwebtoken v9.0)
- **Password Hashing**: bcryptjs (v2.4)
- **Validation**: express-validator (v7.0)
- **CORS**: cors (v2.8)

### Development
- **Auto-reload**: nodemon (v3.0)
- **Environment**: dotenv (v16.3)

---

## 📁 Project Structure

```
money-manager-backend/
├── src/
│   ├── config/              # Database configuration
│   ├── models/              # Mongoose schemas (5 models)
│   ├── routes/              # API routes (5 route files)
│   ├── controllers/         # Business logic (5 controllers)
│   ├── middleware/          # Auth & error handling
│   ├── scripts/             # Utility scripts (seeding)
│   └── server.js            # Application entry point
├── Documentation/           # 11 documentation files
├── Testing/                 # Postman collection & test scripts
├── .env                     # Environment variables
├── .gitignore
└── package.json
```

**📖 For detailed structure, see [DIRECTORY_STRUCTURE.txt](DIRECTORY_STRUCTURE.txt)**

---

## 🚀 Deployment

This backend can be deployed to multiple platforms:

- **Heroku** - Easy deployment with Git
- **Railway** - Modern deployment platform
- **Render** - Free tier available
- **DigitalOcean** - App Platform
- **AWS EC2** - Full control

**📖 For deployment guides, see [DEPLOYMENT.md](DEPLOYMENT.md)**

---

## 🧪 Testing

### Postman Collection
Import `postman_collection.json` into Postman for complete API testing with:
- All 25+ endpoints
- Auto-token management
- Example requests

### Test Scripts
```bash
# Linux/Mac
bash test-api.sh

# Windows
test-api.bat
```

### Manual Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

---

## 📊 Database Schema

### Collections

1. **Users** - User accounts and authentication
2. **Transactions** - Financial transactions (income/expense)
3. **Categories** - Transaction categories (21 defaults)
4. **Accounts** - User financial accounts
5. **Transfers** - Inter-account transfers

**📖 For detailed schema, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Protected route middleware
- ✅ Input validation
- ✅ CORS configuration
- ✅ Error handling without stack traces
- ✅ Environment variable protection

---

## 📝 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/money-manager
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**📖 For configuration details, see [REQUIRED_INFORMATION.md](REQUIRED_INFORMATION.md)**

---

## 🎯 Use Cases

Perfect for:
- Personal finance management
- Small business expense tracking
- Freelancer income/expense tracking
- Budget planning and analysis
- Financial reporting
- Multi-account management

---

## 📈 Project Status

✅ **Version 1.0.0 - Production Ready**

- ✅ All core features implemented
- ✅ Comprehensive documentation
- ✅ Testing tools included
- ✅ Deployment guides available
- ✅ Security best practices
- ✅ Error handling
- ✅ Input validation

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

ISC License

---

## 🆘 Support

### Documentation
- Start with [INDEX.md](INDEX.md) for navigation
- Check [INSTALLATION_STEPS.md](INSTALLATION_STEPS.md) for setup
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands

### Troubleshooting
- Check [INSTALLATION_STEPS.md](INSTALLATION_STEPS.md) → Troubleshooting
- Check [SETUP.md](SETUP.md) → Troubleshooting
- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Troubleshooting

---

## 🎉 Acknowledgments

Built with modern best practices for:
- RESTful API design
- Security
- Scalability
- Documentation
- Developer experience

---

## 📞 Contact

For issues or questions:
1. Check the documentation files
2. Review the API documentation
3. Test with Postman collection
4. Check environment configuration

---

**Made with ❤️ for efficient financial management**

**Version**: 1.0.0 | **Last Updated**: February 6, 2024
