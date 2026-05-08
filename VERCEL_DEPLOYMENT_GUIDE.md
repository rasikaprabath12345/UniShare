# Vercel Backend Deployment Guide

## ✅ What Was Fixed

### 1. **Vercel Configuration (vercel.json)**
- Set up serverless handler at `api/index.js`
- Configured environment variables for Vercel
- Routes all requests through the serverless function

### 2. **CORS Settings (server.js)**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    "http://localhost:3000",
    "https://unishare-platform.netlify.app", // Your Netlify frontend
    "https://uni-share-theta.vercel.app" // Your Vercel backend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
```

### 3. **Serverless Export (server.js)**
```javascript
// Export app for Vercel serverless
module.exports = app;
```

### 4. **MongoDB Connection**
- Handles first request initialization (lazy loading for serverless)
- Connection pooling for multiple requests
- Works in both local and production environments

### 5. **API Handler (api/index.js)**
- Entry point for Vercel serverless functions
- Simply exports the Express app from server.js

## 🚀 Required Steps

### Step 1: Update Environment Variables in Vercel
Go to your Vercel project settings and add these in "Environment Variables":

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=https://unishare-platform.netlify.app
```

### Step 2: Commit and Deploy
```bash
git add Backend/
git commit -m "Fix: Configure backend for Vercel serverless deployment"
git push
```

Your Vercel project will automatically redeploy with these changes.

### Step 3: Verify Deployment
Test your endpoints:
- Health Check: `https://uni-share-theta.vercel.app/api/health`
- Test Route: `https://uni-share-theta.vercel.app/Feedback`

## 📋 File Structure

```
Backend/
├── server.js          (Main Express app - exports app)
├── api/
│   └── index.js       (Vercel serverless handler)
├── vercel.json        (Vercel configuration)
├── routes/            (API routes)
├── models/            (MongoDB models)
├── controllers/       (Route controllers)
└── middleware/        (Express middleware)
```

## 🔧 How It Works

1. **Vercel receives request** → Routes to `api/index.js`
2. **api/index.js** → Exports Express app from `server.js`
3. **First request** → MongoDB connection is established (lazy loading)
4. **Subsequent requests** → Reuse existing connection from connection pool
5. **Response** → Sent back to client

## ✨ Benefits of This Setup

✅ **Serverless Compatible** - Works with Vercel's lambda functions  
✅ **CORS Configured** - Allows requests from your Netlify frontend  
✅ **Lazy DB Connection** - Connects on first request, not startup  
✅ **Connection Pooling** - Reuses connections for better performance  
✅ **Local Development** - Still works with `npm run dev`  
✅ **Production Ready** - Handles both environments  

## 🧪 Testing Locally

```bash
npm install
npm run dev
```

Visit: `http://localhost:8000/api/health`

## ❌ Troubleshooting

### Still Getting 404?
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check FRONTEND_URL matches your Netlify domain
4. Test with curl: `curl https://uni-share-theta.vercel.app/api/health`

### Database Connection Issues?
1. Verify MONGODB_URI is correct
2. Check MongoDB IP whitelist includes Vercel
3. Review Vercel deployment logs

### CORS Errors?
1. Update FRONTEND_URL in Vercel env vars
2. Clear browser cache
3. Test with Postman using correct headers

## 📚 Reference

- [Vercel Node.js Documentation](https://vercel.com/docs/functions/nodejs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Connection Pooling](https://docs.mongodb.com/drivers/node/current/fundamentals/connection-pooling/)
