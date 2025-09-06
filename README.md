# Post Polish (Lumio)

AI-powered document text extraction and social media optimization platform. Transform your PDFs and images into engaging social media content with advanced AI analysis and Firebase authentication.

## 📸 Preview

### Application Screenshots

<div align="center">

#### Homepage - Landing Page Overview

<img src="https://res.cloudinary.com/dqeyxipob/image/upload/v1757155906/landingPage1_nazdsh.png" alt="Lumio AI Homepage - Main Landing" width="800"/>

_Clean and intuitive landing page with AI integration_

<img src="https://res.cloudinary.com/dqeyxipob/image/upload/v1757155905/landingPage2_ldxhs1.png" alt="Lumio AI Homepage - Features Section" width="800"/>

_Feature highlights and AI capabilities overview_

#### Dashboard

<img src="https://res.cloudinary.com/dqeyxipob/image/upload/v1757155333/profile-avatars/ykigabivxe8zc2rbkql5.png" alt="Lumio AI Dashboard" width="800"/>

_Feature-rich dashboard for AI-powered content management_

#### Additional Features

<img src="https://res.cloudinary.com/dqeyxipob/image/upload/v1757155906/landingPage4_frjqqv.png" alt="Lumio AI Advanced Features" width="800"/>

_Advanced AI automation and intelligent workflows_

<img src="https://res.cloudinary.com/dqeyxipob/image/upload/v1757155906/landingpage3_dauou0.png" alt="Lumio AI Integration Details" width="800"/>

_Seamless AI integration and smart setup_

## 📽️ Demo Video

> Watch Lumio AI in action — intelligent automation and AI-powered workflows.

<p align="center">
  <a href="https://youtu.be/B4d1fZqNpOA" target="_blank">
    <img src="https://img.youtube.com/vi/B4d1fZqNpOA/hqdefault.jpg" 
         alt="Lumio AI Demo" width="600">
  </a>
</p>

<p align="center">
  <a href="https://youtu.be/B4d1fZqNpOA" target="_blank">
    <img src="https://img.shields.io/badge/Watch%20Demo%20on%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch on YouTube">
  </a>
</p>

*🎬 Complete workflow demonstration from AI setup to intelligent automation.*

</div>
## 🚀 Features

- **Smart Text Extraction**: Extract text from PDFs and images using Google Gemini Pro with Tesseract fallback
- **AI-Powered Analysis**: Get detailed insights on readability, sentiment, and engagement potential
- **Platform Optimization**: Generate optimized content for Twitter, Instagram, and LinkedIn
- **Smart Hashtags**: AI-generated hashtags with relevance scores and rationale
- **Real-time Processing**: Background job processing with BullMQ and Redis
- **PII Detection**: Automatic detection and redaction of personally identifiable information
- **Firebase Authentication**: Secure user authentication with Google and GitHub OAuth
- **Supabase Database**: Persistent job history and user data storage
- **User History**: Track and manage previous analysis jobs with detailed metadata
- **Caching**: Intelligent Redis-based caching to reduce API costs and improve performance
- **Drag & Drop Interface**: Modern, intuitive file upload with progress tracking
- **Direct Text Analysis**: Analyze text directly without file upload
- **Responsive Design**: Beautiful UI built with shadcn/ui and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **shadcn/ui** components with Tailwind CSS
- **React Router** for navigation
- **React Dropzone** for file uploads
- **Firebase SDK** for authentication
- **Axios** for API communication

### Backend
- **Node.js** with Express and TypeScript
- **BullMQ** with Redis for job queuing
- **Google Gemini Pro** for AI processing
- **Tesseract.js** for OCR fallback
- **Sharp** for image processing
- **PDF.js** for PDF text extraction
- **Firebase Admin SDK** for authentication
- **Multer** for file uploads
- **Pino** for structured logging
- **Sentry** for error tracking (optional)
- **Helmet** for security headers

### Infrastructure & Database
- **Redis** for caching and job queues
- **Firebase** for authentication
- **Supabase** for job history database and optional file storage
- **Local file storage** with configurable cloud storage fallback

## 📋 Prerequisites

- **Node.js 18+** 
- **Redis server**
- **Google Gemini Pro API key**
- **Firebase project** (for authentication)
- **Supabase project** (for database and optional storage)

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd post-polish
```

### 2. Environment Setup

#### Backend Environment (.env in root)
```bash
# Required - AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Admin (Required for authentication)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Optional - Server Configuration
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Optional - Redis Configuration
REDIS_URL=redis://localhost:6379
# Or for cloud Redis:
# REDIS_HOST=your-redis-host
# REDIS_PORT=6379
# REDIS_USERNAME=default
# REDIS_PASSWORD=your-password

# Optional - File Processing
MAX_FILE_SIZE_BYTES=10485760
MAX_PDF_PAGES=10
JOB_TTL_SECONDS=86400

# Optional - Rate Limiting
RATE_LIMIT_UPLOADS_PER_HOUR=10

# Supabase Configuration (Required for job history)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
USE_SUPABASE=true

# Optional - Storage Configuration
USE_FIREBASE_STORAGE=false
FIREBASE_STORAGE_BUCKET=your-bucket-name
SUPABASE_BUCKET=uploads

# Optional - Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info
```

#### Frontend Environment (.env in frontend/)
```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Database Setup

#### Redis (Required)
Make sure Redis is running on your system:

```bash
# On macOS (using Homebrew)
brew services start redis

# On Ubuntu/Debian
sudo systemctl start redis-server

# Or run Redis in Docker
docker run -d -p 6379:6379 redis:7-alpine
```

#### Supabase (Required for job history)
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and service role key
3. In the SQL Editor, run the schema from `backend/supabase-schema.sql`:
   ```sql
   -- Copy and paste the contents of backend/supabase-schema.sql
   -- This creates the jobs table and necessary indexes
   ```
4. Optionally enable Supabase Storage if you want cloud file storage

### 4. Development Setup

**Quick Start (Recommended):**
```bash
# Use the provided startup script (checks Redis, installs deps, starts servers)
chmod +x start-dev.sh
./start-dev.sh
```

**Manual Setup:**
```bash
# Install dependencies
npm install

# Start both frontend and backend in development mode
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### 5. Production Build

```bash
# Build both applications
npm run build

# Start backend in production mode
cd backend && npm start

# Serve frontend (you can use any static file server)
cd frontend && npm run preview
```

## 🔧 Development

### Project Structure

```
post-polish/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities, API client, Firebase config
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.tsx    # Public landing page
│   │   │   ├── AuthPage.tsx       # Login/signup
│   │   │   ├── HomePage.tsx       # Main dashboard
│   │   │   ├── AnalyzePage.tsx    # Text analysis
│   │   │   ├── HistoryPage.tsx    # User history
│   │   │   └── AboutPage.tsx      # About page
│   │   └── main.tsx         # App entry point
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── vite.config.ts       # Vite configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── middleware/      # Express middleware (auth, rate limiting)
│   │   ├── routes/          # API route handlers
│   │   │   ├── upload.ts    # File upload endpoint
│   │   │   ├── analyze.ts   # Text analysis endpoint
│   │   │   ├── jobs.ts      # Job status/results
│   │   │   └── history.ts   # User history (authenticated)
│   │   ├── services/        # Business logic services
│   │   │   ├── gemini.ts    # Google Gemini AI integration
│   │   │   ├── ocr.ts       # Tesseract OCR service
│   │   │   ├── pdf.ts       # PDF processing
│   │   │   ├── firebase.ts  # Firebase Admin SDK
│   │   │   └── textAnalysis.ts # Text analysis logic
│   │   ├── workers/         # Background job processors
│   │   │   └── processJob.ts # Document processing worker
│   │   ├── queues/          # Job queue configuration
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express server setup
│   ├── uploads/             # Temporary file storage
│   ├── eng.traineddata      # Tesseract language data
│   ├── supabase-schema.sql  # Database schema for Supabase
│   ├── DATABASE_SETUP.md    # Database setup guide
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Backend dependencies
├── start-dev.sh             # Development startup script
├── package.json             # Root workspace configuration
└── README.md                # This file
```

### Available Scripts

```bash
# Root level commands
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run lint             # Lint all code
npm run type-check       # Type check all code

# Backend specific
npm run dev:backend      # Start backend in development
cd backend && npm run build

# Frontend specific  
npm run dev:frontend     # Start frontend in development
cd frontend && npm run build
```

### Architecture Overview

**Hybrid Database Approach:**
- **Firebase**: Handles user authentication and session management
- **Supabase**: Stores job history, analysis results, and user data
- **Redis**: Provides caching and job queue management

**Authentication Flow:**
1. **Public Access**: Landing page, about page, and direct text analysis
2. **Protected Routes**: Dashboard, file upload, history require authentication
3. **Firebase Auth**: Email/password, Google OAuth, GitHub OAuth
4. **Backend Auth**: JWT token verification via Firebase Admin SDK
5. **Data Storage**: Authenticated users' job history saved to Supabase

## 📡 API Documentation

### Authentication
Most endpoints accept optional authentication. Authenticated requests include user context for history tracking.

```http
Authorization: Bearer <firebase-id-token>
```

### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer <token> (optional)

# Request Body
file: <PDF or image file>

# Response 201
{
  "id": "job-uuid",
  "filename": "document.pdf", 
  "size": 123456,
  "status": "processing"
}
```

### Job Status Polling
```http
GET /api/jobs/:jobId/status

# Response 200
{
  "id": "job-uuid",
  "status": "processing|done|failed",
  "progress": 0-100,
  "message": "optional status message"
}
```

### Job Results
```http
GET /api/jobs/:jobId/result

# Response 200
{
  "id": "job-uuid",
  "filename": "document.pdf",
  "extractedText": "Full extracted text content...",
  "analysis": {
    "wordCount": 123,
    "readingGrade": 8.4,
    "sentiment": { 
      "label": "positive|neutral|negative", 
      "score": 0.8 
    },
    "hashtags": [
      { 
        "tag": "#example", 
        "score": 0.9,
        "rationale": "Relevant to main topic"
      }
    ],
    "emojiSuggestions": ["🚀", "🔥", "✨"],
    "engagementScore": 0.75,
    "engagementTips": [
      "Add questions to encourage interaction",
      "Use emojis to make content more engaging"
    ],
    "improvedText": {
      "twitter": "Optimized content for Twitter (≤280 chars)",
      "instagram": "Optimized content for Instagram (≤2200 chars)", 
      "linkedin": "Optimized content for LinkedIn"
    }
  },
  "meta": {
    "engine": "gemini-pro|tesseract",
    "processingTimeMs": 1234,
    "piiDetected": false,
    "partialProcessing": false,
    "pagesProcessed": 5,
    "totalPages": 5
  }
}
```

### Direct Text Analysis
```http
POST /api/analyze
Content-Type: application/json
Authorization: Bearer <token> (optional)

# Request Body
{
  "text": "Your text content here...",
  "targets": ["twitter", "instagram", "linkedin"]
}

# Response 200
{
  "analysis": {
    // Same analysis structure as above
  }
}
```

### User History (Authenticated)
```http
GET /api/history
Authorization: Bearer <token>

# Response 200
{
  "jobs": [
    {
      "id": "job-uuid",
      "filename": "document.pdf",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "status": "done",
      // ... job details
    }
  ]
}
```

### Queue Statistics
```http
GET /api/jobs/stats

# Response 200
{
  "waiting": 0,
  "active": 1,
  "completed": 42,
  "failed": 0
}
```

### Health Check
```http
GET /health

# Response 200
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## 🚀 Deployment

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Backend server port | `3001` | No |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` | No |
| `GEMINI_API_KEY` | Google Gemini Pro API key | - | **Yes** |
| `FIREBASE_PROJECT_ID` | Firebase project ID | - | **Yes** |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | - | **Yes** |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | - | **Yes** |
| `SUPABASE_URL` | Supabase project URL | - | **Yes** |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | - | **Yes** |
| `USE_SUPABASE` | Enable Supabase database | `true` | **Yes** |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | No |
| `USE_FIREBASE_STORAGE` | Enable Firebase Storage | `false` | No |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name | - | If using Firebase Storage |
| `SUPABASE_BUCKET` | Supabase storage bucket name | `uploads` | No |
| `MAX_FILE_SIZE_BYTES` | Max upload size | `10485760` (10MB) | No |
| `JOB_TTL_SECONDS` | Job result cache TTL | `86400` (24h) | No |
| `MAX_PDF_PAGES` | Max PDF pages to process | `10` | No |
| `RATE_LIMIT_UPLOADS_PER_HOUR` | Upload rate limit per IP | `10` | No |
| `SENTRY_DSN` | Sentry error tracking DSN | - | No |
| `LOG_LEVEL` | Logging level | `info` | No |

### Production Deployment

1. **Environment Setup:**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export GEMINI_API_KEY=your_production_key
   export FIREBASE_PROJECT_ID=your_project_id
   # ... other required variables
   ```

2. **Install Dependencies:**
   ```bash
   npm ci --only=production
   ```

3. **Build Applications:**
   ```bash
   npm run build
   ```

4. **Start Services:**
   ```bash
   # Start Redis (if not already running)
   redis-server

   # Start Backend
   cd backend && npm start

   # Serve Frontend
   serve -s frontend/dist -l 3000
   ```

### Firebase Hosting (Frontend)

1. Add `VITE_API_BASE_URL` to Firebase Hosting environment config so the frontend calls your backend directly:
   - If your backend is on Render at `https://your-backend.onrender.com/api`, set:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
   - Ensure you rebuild before deploying so Vite inlines the value:
   ```bash
   cd frontend
   echo VITE_API_BASE_URL=https://your-backend.onrender.com/api > .env.production
   npm run build
   firebase deploy --only hosting
   ```

2. Firebase `rewrites` should only serve SPA routes. API calls must go to your backend domain (we use the absolute base URL above). Avoid proxying `/api` via Firebase unless you configure a function/redirect explicitly.

### Render (Backend)

1. Set environment variables in your Render service:
   - `NODE_ENV=production`
   - `PORT=10000` (Render provides `$PORT` automatically)
   - `CORS_ORIGIN` to a comma-separated list of your frontend origins, e.g.:
     ```
     https://your-frontend-url
     ```
   - Plus all required keys (Gemini, Firebase Admin, Supabase, Redis)

2. Verify health and API prefix:
   - Health: `GET https://your-backend.onrender.com/health`
   - API: `POST https://your-backend.onrender.com/api/upload`

3. If you see HTML returned to API calls, the request is hitting the frontend. Ensure the frontend uses `VITE_API_BASE_URL` pointing to Render and rebuild/redeploy.

## 🔒 Security Features

- **Firebase Authentication**: Secure user authentication with multiple providers
- **JWT Token Verification**: Backend validates Firebase ID tokens
- **File Validation**: Magic byte validation and MIME type checking
- **Rate Limiting**: Configurable upload rate limits per IP address
- **PII Detection**: Automatic detection of sensitive information
- **Input Sanitization**: Filename sanitization and content validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Comprehensive HTTP security headers via Helmet
- **Error Handling**: Secure error messages without information leakage

## 🔧 Configuration

### File Processing Limits

- **Max File Size**: 10MB (configurable)
- **Supported Formats**: PDF, JPEG, PNG, TIFF, BMP, WebP
- **Max PDF Pages**: 10 pages (configurable)
- **Text Analysis Limit**: 50,000 characters for direct analysis
- **Rate Limiting**: 10 uploads per hour per IP (configurable)

### AI Processing

The application uses Google Gemini Pro for intelligent text analysis with Tesseract.js as a fallback OCR engine. Processing includes:

- **Text Extraction**: OCR from images, text layer extraction from PDFs
- **Sentiment Analysis**: Positive/neutral/negative sentiment scoring
- **Readability Analysis**: Flesch-Kincaid grade level assessment
- **Hashtag Generation**: AI-powered hashtag suggestions with rationale
- **Platform Optimization**: Content optimization for Twitter, Instagram, LinkedIn
- **Engagement Analysis**: Tips and scoring for social media engagement

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Queue statistics
curl http://localhost:3001/api/jobs/stats
```

### Logging

The application uses structured logging with Pino:

```bash
# Development logs
npm run dev

# Production logging (JSON format)
NODE_ENV=production npm start
```

### Error Tracking

Configure Sentry for production error tracking:

```env
SENTRY_DSN=your_sentry_dsn_here
```

## 🤝 Contributing

### Development Setup

1. **Fork and Clone:**
   ```bash
   git fork <repository>
   git clone <your-fork>
   cd post-polish
   ```

2. **Set Up Environment:**
   ```bash
   # Copy environment templates and configure
   # Backend .env in root directory
   # Frontend .env in frontend/ directory
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Start Development:**
   ```bash
   ./start-dev.sh
   ```

### Development Guidelines

- **TypeScript**: Use strict TypeScript throughout
- **Authentication**: Test both authenticated and unauthenticated flows
- **Error Handling**: Implement proper error boundaries and logging
- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Write tests for new features
- **Documentation**: Update README and inline documentation

## 🆘 Troubleshooting

### Common Issues

**Redis Connection Error:**
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"
```

**Firebase Configuration Error:**
```bash
# Verify Firebase config in both backend and frontend .env files
# Ensure Firebase project has Authentication enabled
```

**Gemini API Key Error:**
```bash
# Check if API key is set
grep GEMINI_API_KEY .env
# Verify API key is valid and has Gemini Pro access
```

**File Upload Issues:**
- Check file size (max 10MB by default)
- Verify file format (PDF, JPEG, PNG, TIFF, BMP, WebP)
- Ensure uploads/ directory is writable

**Authentication Issues:**
- Verify Firebase configuration matches between frontend and backend
- Check that Firebase Authentication is enabled in Firebase Console
- Ensure service account has proper permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini Pro** for advanced AI capabilities
- **Firebase** for authentication and optional storage
- **Tesseract.js** for reliable OCR fallback
- **shadcn/ui** for beautiful, accessible components
- **React** and **Node.js** ecosystems
- **Open Source Community** for amazing libraries and tools

---

**Transform your documents into engaging social media content with AI-powered analysis and optimization.**