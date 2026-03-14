# Zyro Web - Crypto Project

A full-stack crypto project featuring a fiat-to-crypto swap interface, real-time quotes, and an admin dashboard.

## Features

- **Swap Interface**: Dark-themed UI for swapping fiat (NGN) to crypto (ETH, USDC, etc.).
- **Real-time Quotes**: Fetches base rates from DexScreener and applies a custom spread.
- **Payment Integration**: Paystack integration for generating virtual bank accounts and handling webhooks.
- **Admin Dashboard**: Track transactions, user balances, and system status in real-time.
- **User Authentication**: Secure login/signup with JWT.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, Winston.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Paystack Account (for API keys)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/zyro

# Paystack Secret Key (for virtual accounts and webhooks)
PAYSTACK_SECRET=sk_test_your_paystack_secret

# Custom Spread Percentage (e.g., 1 for 1% markup)
SPREAD_PERCENT=1

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Run the Application

Start the development server (runs both frontend and backend concurrently):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Deployment

### Frontend (Vercel)
- The frontend can be deployed to Vercel by pointing to the root directory and using the standard Vite build command (`npm run build`).
- Ensure environment variables are set in the Vercel dashboard.

### Backend (Heroku/AWS/Render)
- Deploy the Node.js backend.
- Set the environment variables.
- Ensure the `MONGODB_URI` points to a production database (e.g., MongoDB Atlas).

### Database (MongoDB Atlas)
- Create a cluster on MongoDB Atlas.
- Whitelist the IP addresses of your backend server.
- Get the connection string and set it as `MONGODB_URI`.

## Compliance & Security
- **KYC**: Currently a placeholder. In production, integrate a KYC provider (e.g., Smile Identity) before allowing fiat deposits.
- **Security**: Uses JWT for auth, bcrypt for password hashing, and dotenv for secrets management. Ensure HTTPS is used in production.
