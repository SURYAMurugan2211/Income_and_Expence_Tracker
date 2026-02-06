# 💰 Money Manager - Income & Expense Tracker

A full-stack web application for managing personal finances with real-time analytics, email verification, and secure authentication.

## 🌟 Features

### Authentication & Security
- ✅ User registration with email verification
- ✅ Secure login with JWT authentication
- ✅ Strong password requirements (10+ chars, uppercase, lowercase, numbers, special chars)
- ✅ Email validation with common provider checking
- ✅ Password strength indicator
- ✅ Unverified email detection with resend verification option

### Financial Management
- 📊 **Dashboard**: Overview of income, expenses, and balance
- 💳 **Accounts**: Manage multiple accounts (Cash, Bank, Credit Card, etc.)
- 💸 **Transactions**: Track income and expenses with categories
- 📈 **Analytics**: Visual charts and insights
  - Monthly income vs expense trends
  - Category-wise spending analysis
  - Income sources breakdown
  - Expense distribution

### User Experience
- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- 🔔 Real-time notifications
- 🎯 Intuitive navigation
- ⚡ Fast and smooth interactions

## 🛠️ Tech Stack

### Frontend
- **React** 18 with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email verification

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account for email verification

### Backend Setup

1. Navigate to backend directory:
```bash
cd money-manager-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

4. Seed default categories:
```bash
node src/scripts/seedCategories.js
```

5. Start the server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd money-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📧 Email Verification Setup

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD` in backend `.env`

## 🎯 Usage

### First Time Setup

1. **Register**: Create an account with a valid email
2. **Verify Email**: Check your inbox and click the verification link
3. **Login**: Sign in with your credentials
4. **Add Accounts**: Create your financial accounts (Bank, Cash, etc.)
5. **Add Transactions**: Start tracking your income and expenses
6. **View Analytics**: Monitor your financial health with charts

### Default Categories

The app comes with 21 pre-configured categories:
- **Income**: Salary, Freelance, Investment, Business, Gift, Other Income
- **Expense**: Food, Transport, Shopping, Bills, Entertainment, Health, Education, Travel, Rent, Insurance, Groceries, Utilities, Clothing, Personal Care, Other Expense

## 🧪 Testing

Test scripts are included in the root directory:

```bash
# Test email verification
node test-email-verification.js

# Test authentication validation
node test-auth-validation.js

# Test unverified login flow
node test-unverified-login.js

# Test analytics endpoints
node test-analytics.js

# Test accounts endpoints
node test-accounts.js
```

### Add Sample Data

```bash
# Add sample accounts
node add-sample-accounts.js

# Add sample transactions
node add-sample-transactions.js
```

## 📁 Project Structure

```
Income_and_Expence_Tracker/
├── money-manager-backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Email service
│   │   └── server.js        # Entry point
│   ├── .env
│   └── package.json
│
├── money-manager-frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for secure authentication
- Email verification required before login
- Strong password validation
- Protected API routes with middleware
- Input validation and sanitization

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/me` - Get current user

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `POST /api/accounts/transfer` - Transfer between accounts

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/analytics/summary` - Get financial summary
- `GET /api/analytics/monthly-trend` - Get monthly trends
- `GET /api/analytics/category-breakdown` - Get category breakdown
- `GET /api/analytics/income-sources` - Get income sources

### Categories
- `GET /api/categories` - Get all categories

## 🎨 Screenshots

### Login & Registration
- Email validation with real-time feedback
- Password strength indicator
- Email verification modal

### Dashboard
- Financial overview cards
- Recent transactions list
- Quick stats

### Analytics
- Line chart: Monthly income vs expense
- Bar chart: Category comparison
- Pie charts: Income sources & expense distribution

### Accounts
- Account cards with balances
- Transfer between accounts
- Add/Edit/Delete accounts

### Transactions
- Filterable transaction list
- Add/Edit transactions
- Category-based organization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**SURYA Murugan**
- GitHub: [@SURYAMurugan2211](https://github.com/SURYAMurugan2211)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Tailwind CSS for styling
- MongoDB Atlas for database hosting
- Nodemailer for email functionality

---

Made with ❤️ by SURYA Murugan
