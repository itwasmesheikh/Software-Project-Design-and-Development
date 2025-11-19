# HandyGo - Service Booking Platform

HandyGo is a modern web application for booking various home services and connecting clients with contractors. The platform features a robust verification system, job management, and digital job cards.

## Features

- User authentication (clients and contractors)
- Service booking system
- Digital job cards
- Contractor verification system
- Job marketplace
- Real-time status tracking

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Project Structure

```
handygo/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── types/
│   └── ...
└── backend/          # Express.js backend application
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── controllers/
    │   └── middleware/
    └── ...
```

## Quick Start

### Using Setup Script

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd handygo
   ```

2. Run the setup script:
   - For Windows:
     ```bash
     setup.bat
     ```
   - For Linux/Mac:
     ```bash
     chmod +x setup.sh
     ./setup.sh
     ```

### Manual Setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure backend environment:
   - Copy `.env.example` to `.env`
   - Update the environment variables as needed

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Configure frontend environment:
   - Copy `.env.development` to `.env.local`
   - Update the environment variables as needed

## Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3001

## Database Setup

1. Ensure MongoDB is running locally or update the connection string in `.env`

2. Run database migrations:
   ```bash
   cd backend
   npm run migrate
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

## Available Scripts

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm test` - Run tests

## Environment Variables

### Backend (.env)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/handygo
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# AWS S3 Config (optional)
AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# SMTP Config (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001/api
VITE_STORAGE_URL=http://localhost:3001/uploads
VITE_DEBUG=true
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.