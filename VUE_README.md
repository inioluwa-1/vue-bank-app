# Vue Bank App - Frontend

Complete Vue.js frontend for the Laravel Banking Application.

## ✅ Features Implemented

### 🔐 Authentication
- User Registration with validation
- User Login with token management
- Auto-logout on token expiration
- Protected routes with navigation guards

### 📊 Dashboard
- Account balance display
- Account information (number, type)
- Transaction statistics
- Recent transactions (last 5)
- Quick action buttons (Deposit, Transfer)

### 💰 Transactions
- **Deposit**: Add funds to account
- **Transfer**: Send money to beneficiaries with PIN verification
- **Transaction History**: Paginated list with filters (type, status, date)
- Balance validation before transfers

### 👥 Beneficiaries
- List all beneficiaries
- Add new beneficiary
- Edit beneficiary details
- Delete beneficiary with confirmation
- Auto-fill beneficiary details in transfer form

### ⚙️ Profile
- View and update profile information
- Create/Update transaction PIN
- Display account details

## 🛠️ Tech Stack

- **Vue 3** - Composition API
- **Vite** - Build tool
- **Vue Router** - Routing with guards
- **Pinia** - State management
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
src/
├── services/          # API service layer
│   ├── api.js        # Axios configuration
│   ├── auth.js       # Authentication services
│   ├── user.js       # User/profile services
│   ├── transaction.js # Transaction services
│   └── beneficiary.js # Beneficiary services
│
├── stores/           # Pinia stores
│   ├── auth.js      # Auth state management
│   ├── transaction.js # Transaction state
│   └── beneficiary.js # Beneficiary state
│
├── views/            # Page components
│   ├── Auth/
│   │   ├── Register.vue
│   │   └── Login.vue
│   ├── Dashboard.vue
│   ├── Profile.vue
│   ├── Beneficiaries.vue
│   └── Transactions/
│       ├── Transfer.vue
│       ├── Deposit.vue
│       └── History.vue
│
└── router/
    └── index.js      # Routes with guards
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher)
- Laravel backend running on `http://127.0.0.1:8000`

### Installation

1. **Install dependencies** (already done):
```powershell
npm install
```

2. **Start the development server**:
```powershell
npm run dev
```

The app will run on `http://localhost:5173`

### Build for Production
```powershell
npm run build
```

### Preview Production Build
```powershell
npm run preview
```

## 🔄 Communication Flow

```
Vue Component
    ↓
API Service (axios)
    ↓
Laravel API (http://127.0.0.1:8000/api)
    ↓
Response
    ↓
Pinia Store (update state)
    ↓
Component (UI update)
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Token received from Laravel API
3. Token stored in localStorage
4. Token automatically added to all API requests
5. On logout or 401 error, token cleared and redirected to login

## 📱 Available Routes

| Route | Component | Auth Required |
|-------|-----------|--------------|
| `/` | Redirect to `/login` | No |
| `/register` | Register | No |
| `/login` | Login | No |
| `/dashboard/:userId` | Dashboard | Yes |
| `/profile` | Profile | Yes |
| `/beneficiaries` | Beneficiaries | Yes |
| `/transfer` | Transfer | Yes |
| `/deposit` | Deposit | Yes |
| `/transactions` | History | Yes |

## 🎨 Styling

- Custom CSS with responsive design
- Gradient backgrounds
- Card-based layouts
- Hover effects and transitions
- Mobile-friendly

## 📝 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user` - Get current user
- `PUT /api/user/profile` - Update profile
- `POST /api/user/transaction-pin` - Create PIN
- `PUT /api/user/transaction-pin` - Update PIN

### Transactions
- `GET /api/transactions` - Get history
- `POST /api/transactions/deposit` - Deposit
- `POST /api/transactions/transfer` - Transfer

### Beneficiaries
- `GET /api/beneficiaries` - List all
- `POST /api/beneficiaries` - Create
- `PUT /api/beneficiaries/{id}` - Update
- `DELETE /api/beneficiaries/{id}` - Delete

### Dashboard
- `GET /api/dashboard/{userId}` - Dashboard data

## 🔒 Security Features

- JWT token authentication
- Protected routes
- Auto-logout on token expiration
- Transaction PIN verification
- Balance validation
- Form validation
- CORS configured

## ⚙️ Environment Configuration

The API base URL is configured in `src/services/api.js`:
```javascript
baseURL: 'http://127.0.0.1:8000/api'
```

To change this for production, update the baseURL value.

## 📋 Usage Instructions

### 1. Register a New Account
- Go to `/register`
- Fill in all required fields
- Select account type
- Click "Create Account"
- You'll be redirected to login

### 2. Login
- Go to `/login`
- Enter email and password
- Click "Login"
- You'll be redirected to dashboard

### 3. Create Transaction PIN
- Go to Profile
- Enter a 4-digit PIN
- Click "Create PIN"
- Required for transfers

### 4. Add Beneficiaries
- Go to Beneficiaries
- Click "Add Beneficiary"
- Fill in details
- Click "Save"

### 5. Make a Transfer
- Go to Transfer
- Select beneficiary from dropdown
- Enter amount
- Enter transaction PIN
- Click "Transfer"

### 6. Make a Deposit
- Go to Deposit
- Enter amount
- Click "Deposit"

## 🐛 Troubleshooting

### API Connection Issues
- Ensure Laravel backend is running on port 8000
- Check CORS configuration in Laravel
- Verify network connectivity

### Authentication Issues
- Clear localStorage and try again
- Check if token is expired
- Verify credentials

### Build Issues
- Delete `node_modules` and run `npm install` again
- Clear cache: `npm cache clean --force`

## 🤝 Contributing

This is a complete banking application frontend. All major features are implemented and ready to use!

## 📄 License

Private project for educational purposes.

---

**Status**: ✅ Production Ready
**Created**: November 14, 2025
