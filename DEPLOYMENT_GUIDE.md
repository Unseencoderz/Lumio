# Post Polish Deployment Guide

## Production Issues & Solutions

### Issue 1: Infinite "Initializing Process"

**Problem**: Jobs get stuck in "processing" status indefinitely.

**Root Cause**: Redis connection issues and worker not starting properly on Render.

**Solution**:

1. **Set up Redis Cloud**:
   - Sign up at [Redis Cloud](https://redis.com/try-free/)
   - Create a free database
   - Get connection details

2. **Add Environment Variables to Render Backend**:
   ```env
   REDIS_URL=redis://username:password@host:port
   # OR use individual config:
   REDIS_HOST=your-redis-host
   REDIS_PORT=6379
   REDIS_USERNAME=default
   REDIS_PASSWORD=your-password
   ```

3. **Verify Worker Startup**:
   - Check Render logs for "Document processing worker started successfully"
   - If not, check Redis connection logs

### Issue 2: "Cannot read properties of undefined (reading 'length')" Error

**Problem**: Hashtag generation fails due to undefined array.

**Root Cause**: Gemini API response parsing issues.

**Solution**: 
- Fixed in code with better error handling and validation
- Added fallback arrays for undefined properties

## Required Environment Variables

### Backend (Render)
```env
# Required
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
USE_SUPABASE=true

# Redis (Required for job processing)
REDIS_URL=redis://username:password@host:port

# Optional
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.web.app
```

### Frontend (Firebase)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Deployment Steps

### 1. Backend (Render)

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings**:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
4. **Add environment variables** (see above)
5. **Deploy**

### 2. Frontend (Firebase)

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Login**: `firebase login`
3. **Initialize**: `firebase init hosting`
4. **Build**: `cd frontend && npm run build`
5. **Deploy**: `firebase deploy`

### 3. Database Setup

1. **Supabase**:
   - Create project at [supabase.com](https://supabase.com)
   - Run the schema from `backend/supabase-schema.sql`
   - Get project URL and service role key

2. **Redis**:
   - Set up Redis Cloud or Upstash Redis
   - Get connection details
   - Add to environment variables

## Troubleshooting

### Check Worker Status
```bash
# Check if worker is running
curl https://your-backend.onrender.com/health

# Check queue stats
curl https://your-backend.onrender.com/api/jobs/stats
```

### Check Logs
- **Render**: View logs in Render dashboard
- **Firebase**: View logs in Firebase console

### Common Issues

1. **Redis Connection Failed**:
   - Verify Redis URL/credentials
   - Check if Redis service is running

2. **Worker Not Starting**:
   - Check Redis connection
   - Verify environment variables
   - Check Render logs for errors

3. **Jobs Stuck in Queue**:
   - Restart the Render service
   - Check if worker is running
   - Verify Redis connection

4. **CORS Errors**:
   - Update CORS_ORIGIN to match your frontend domain
   - Ensure protocol (http/https) matches

## Monitoring

### Health Check Endpoint
```bash
curl https://your-backend.onrender.com/health
```

### Queue Statistics
```bash
curl https://your-backend.onrender.com/api/jobs/stats
```

### Log Monitoring
- Set up log aggregation (e.g., Sentry)
- Monitor error rates
- Track job processing times

## Performance Optimization

1. **Redis Connection Pooling**: Already configured
2. **Job Concurrency**: Set to 2 jobs concurrently
3. **Caching**: Redis-based caching for analysis results
4. **Rate Limiting**: Configured to prevent abuse

## Security

1. **Environment Variables**: Never commit secrets
2. **CORS**: Configured for specific origins
3. **Rate Limiting**: Prevents abuse
4. **Input Validation**: All inputs validated
5. **Error Handling**: No sensitive data in error messages
