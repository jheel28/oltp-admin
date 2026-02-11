# OLTP Admin - Setup Guide

## Project Overview
This is a full-stack Online Test Platform (OLTP) admin system with:
- **Backend**: Node.js/Express with MongoDB
- **Frontend**: React with Tailwind CSS, Chakra UI, and Ant Design

## ✅ Setup Complete

All dependencies have been installed and configured for local development.

### What Was Done:
1. ✅ Backend dependencies installed (`npm install` in backend/)
2. ✅ Frontend dependencies installed (`npm install` in oltp-frontend/)
3. ✅ Frontend `.env` updated to point to local backend (http://localhost:5000)
4. ✅ MongoDB verified as running (v7.0.9)

## Running the Application

### 1. Start Backend Server
```bash
cd backend
npm start
```
- Backend will run on **http://localhost:5000**
- Connected to local MongoDB: `mongodb://127.0.0.1:27017/testseries`

### 2. Start Frontend Development Server
```bash
cd oltp-frontend
npm start
```
- Frontend will run on **http://localhost:3000**
- Automatically opens in your default browser

## Project Structure

```
oltp-admin/
├── backend/
│   ├── Controllers/     # API route handlers
│   ├── Models/          # Mongoose models
│   ├── Routes/          # API routes
│   ├── Middleware/      # Auth & validation middleware
│   ├── uploads/         # File uploads directory
│   └── app.js           # Main backend entry point
└── oltp-frontend/
    ├── src/             # React source code
    ├── public/          # Static assets
    └── .env             # Environment configuration
```

## Configuration

### Frontend Environment Variables
Located at: `oltp-frontend/.env`
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Backend Configuration
- Database: MongoDB running locally on port 27017
- Database Name: `testseries`
- Server Port: 5000

## API Routes
The backend includes the following API routes:
- `/api/beta/superadmin` - Super admin operations
- `/api/beta/admin` - Admin operations
- `/api/beta/student` - Student management
- `/api/beta/batch` - Batch management
- `/api/beta/questionpaper` - Question paper management
- `/api/beta/test` - Test management
- `/api/beta/score` - Score management
- `/api/beta/query` - Query management
- `/api/beta/question` - Question management

## Notes

### Security Warnings
Both projects have some npm vulnerabilities. To fix them:
```bash
# Backend (3 high severity vulnerabilities)
cd backend
npm audit fix

# Frontend (11 vulnerabilities: 5 moderate, 6 high)
cd oltp-frontend
npm audit fix
```

> ⚠️ **Note**: Some vulnerabilities may require `npm audit fix --force` which can introduce breaking changes. Review carefully before applying.

### MongoDB
- MongoDB is already installed and running (v7.0.9)
- Database: `testseries`
- Connection: `mongodb://127.0.0.1:27017/testseries`

## Next Steps

1. **Start the servers** using the commands above
2. **Access the application** at http://localhost:3000
3. **Test the API** at http://localhost:5000
4. **Review security vulnerabilities** and apply fixes if needed

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- **Backend**: Change port in `backend/app.js` (line 63)
- **Frontend**: Change port using `PORT=3001 npm start`

### MongoDB Connection Issues
If backend can't connect to MongoDB:
1. Ensure MongoDB service is running: `mongosh`
2. Check connection string in `backend/app.js` (line 61)

### CORS Issues
The backend is configured to allow all origins (`*`). If you need to restrict this:
- Edit `backend/app.js` line 22
