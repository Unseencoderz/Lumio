# Lumio

  AI-powered document text extraction and social media posts optimization platform. Transform your PDFs and images into engaging social media content with advanced AI analysis.

![Lumio Demo](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Lumio+Demo)

## 🚀 Features

- **Smart Text Extraction**: Extract text from PDFs and images using Google Gemini Pro with Tesseract fallback
- **AI-Powered Analysis**: Get detailed insights on readability, sentiment, and engagement potential
- **Platform Optimization**: Generate optimized content for Twitter, Instagram, and LinkedIn
- **Smart Hashtags**: AI-generated hashtags with relevance scores and rationale
- **Real-time Processing**: Background job processing with real-time progress updates
- **PII Detection**: Automatic detection and redaction of personally identifiable information
- **Caching**: Intelligent caching to reduce API costs and improve performance
- **Drag & Drop Interface**: Modern, intuitive file upload with progress tracking
- **Direct Text Analysis**: Analyze text directly without file upload

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **shadcn/ui** components with Tailwind CSS
- **React Router** for navigation
- **React Dropzone** for file uploads

### Backend
- **Node.js** with Express and TypeScript
- **BullMQ** with Redis for job queuing
- **Google Gemini Pro** for AI processing
- **Tesseract.js** for OCR fallback
- **Sharp** for image processing
- **PDF.js** for PDF rendering
- **Multer** for file uploads
- **Pino** for structured logging
- **Sentry** for error tracking

### Infrastructure
- **Redis** for caching and job queues (local or cloud)
- **Supabase Storage** support (optional)
- **GitHub Actions** CI/CD

## 📋 Prerequisites

- **Node.js 18+** 
- **Redis server**
- **Google Gemini Pro API key**

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lumio
```

### 2. Environment Setup

Copy the environment template and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - defaults provided
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
MAX_FILE_SIZE_BYTES=10485760
RATE_LIMIT_UPLOADS_PER_HOUR=10
```

### 3. Start Redis

Make sure Redis is running on your system:

```bash
# On macOS (using Homebrew)
brew services start redis

# On Ubuntu/Debian
sudo systemctl start redis-server

# Or run Redis in Docker
docker run -d -p 6379:6379 redis:7-alpine
```

### 4. Development Setup

**Quick Start (Recommended):**
```bash
# Use the provided startup script (checks Redis, installs deps, starts servers)
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
Lumio/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   ├── pages/           # Page components
│   │   └── __tests__/       # Frontend tests
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── vite.config.ts       # Vite configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── workers/         # Background job processors
│   │   ├── queues/          # Job queue configuration
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── __tests__/       # Backend tests
│   ├── uploads/             # Temporary file storage
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Backend dependencies
├── .github/workflows/       # CI/CD pipeline
├── start-dev.sh             # Development startup script
├── package.json             # Root workspace configuration
├── .env.example             # Environment template
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
npm run build --workspace=backend

# Frontend specific  
npm run dev:frontend     # Start frontend in development
npm run build --workspace=frontend
```

### Development Workflow

1. **Start Development Environment:**
   ```bash
   ./start-dev.sh
   ```

2. **Make Changes:**
   - Frontend changes auto-reload at http://localhost:3000
   - Backend changes auto-reload at http://localhost:3001

3. **Check Code Quality:**
   ```bash
   npm run lint
   npm run type-check
   ```

## 📡 API Documentation

### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data

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
GET /api/status/:jobId

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
GET /api/result/:jobId

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
      "Use emojis to make content more engaging",
      "Include a clear call-to-action"
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

### Hashtag Generation Only
```http
POST /api/hashtags
Content-Type: application/json

# Request Body
{
  "text": "Your text content here..."
}

# Response 200
{
  "hashtags": [
    { 
      "tag": "#example", 
      "rationale": "Relevant to content theme" 
    }
  ]
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

### Queue Statistics
```http
GET /api/queue/stats

# Response 200
{
  "waiting": 0,
  "active": 1,
  "completed": 42,
  "failed": 0
}
```



## 🚀 Deployment

### Production Deployment

1. **Environment Setup:**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export GEMINI_API_KEY=your_production_key
   export REDIS_URL=redis://your-redis-server:6379
   export SENTRY_DSN=your_sentry_dsn
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

   # Serve Frontend with a web server
   # Option 1: Using serve (npm install -g serve)
   serve -s frontend/dist -l 3000

   # Option 2: Using nginx
   # Copy frontend/dist/* to your nginx web root
   ```

### Production Considerations

- **Process Manager**: Use PM2 or similar for the backend
- **Reverse Proxy**: Use nginx or Apache for the frontend
- **SSL/TLS**: Configure HTTPS certificates
- **Environment Variables**: Use proper secrets management
- **Monitoring**: Set up health checks and alerting
- **Backup**: Regular Redis data backups

### Example PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'Lumio-backend',
    cwd: './backend',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/Lumio/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## 🔒 Security Features

- **File Validation**: Magic byte validation and MIME type checking
- **Rate Limiting**: Configurable upload rate limits per IP address
- **PII Detection**: Automatic detection and redaction of sensitive information
- **Input Sanitization**: Filename sanitization and content validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Comprehensive HTTP security headers
- **Error Handling**: Secure error messages without information leakage

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Backend server port | `3001` | No |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` | No |
| `GEMINI_API_KEY` | Google Gemini Pro API key | - | **Yes** |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` | No |
| `REDIS_HOST` | Redis host (for cloud Redis) | - | No |
| `REDIS_PORT` | Redis port (for cloud Redis) | - | No |
| `REDIS_USERNAME` | Redis username (for cloud Redis) | `default` | No |
| `REDIS_PASSWORD` | Redis password (for cloud Redis) | - | No |
| `USE_SUPABASE` | Enable Supabase storage | `false` | No |
| `SUPABASE_URL` | Supabase project URL | - | If USE_SUPABASE=true |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | - | If USE_SUPABASE=true |
| `SUPABASE_BUCKET` | Supabase storage bucket | `uploads` | No |
| `MAX_FILE_SIZE_BYTES` | Max upload size | `10485760` (10MB) | No |
| `JOB_TTL_SECONDS` | Job result cache TTL | `86400` (24h) | No |
| `MAX_PDF_PAGES` | Max PDF pages to process | `10` | No |
| `RATE_LIMIT_UPLOADS_PER_HOUR` | Upload rate limit | `10` | No |
| `SENTRY_DSN` | Sentry error tracking | - | No |
| `LOG_LEVEL` | Logging level | `info` | No |

### File Processing Limits

- **Max File Size**: 10MB (configurable)
- **Supported Formats**: PDF, JPEG, PNG, TIFF, BMP, WebP
- **Max PDF Pages**: 10 pages (configurable)
- **Text Analysis Limit**: 50,000 characters for direct analysis
- **Rate Limiting**: 10 uploads per hour per IP (configurable)

### AI Processing Configuration

The application uses Google Gemini Pro with specific prompts:

**OCR Prompt:**
```
You are a high-accuracy OCR engine. Extract clean plain text from the provided image. 
Preserve paragraphs and line breaks. If text is partially unreadable, include "[UNREADABLE]" 
with confidence per page. Output strictly JSON:
{ "text": "full extracted text", "lines": ["..."], "confidence": 0.0-1.0 }
```

**Analysis Prompt:**
```
You are an expert social media editor. Given the "text" input below, return a JSON object with:
- sentiment: { label, score }
- readability: { fleschKincaidGrade, fleschScore }
- hashtags: array of up to 10 { tag, score, rationale }
- emojiSuggestions: array of up to 5 emojis
- engagementTips: array of 3 concise tips (max 20 words each)
- improvedText: { twitter: string<=280, instagram: string<=2200, linkedin: string }
Return only valid JSON.
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3001/health

# Queue statistics
curl http://localhost:3001/api/queue/stats
```

### Logging

The application uses structured logging with Pino:

```bash
# View logs in development
npm run dev

# View backend logs specifically
npm run dev:backend

# Production logging (JSON format)
NODE_ENV=production npm run dev:backend
```

### Error Tracking

Configure Sentry for production error tracking:

```env
SENTRY_DSN=your_sentry_dsn_here
```

### Performance Metrics

- **Caching**: Redis-based caching reduces API calls
- **Job Processing**: Background processing prevents blocking
- **Rate Limiting**: Protects against abuse
- **File Validation**: Early rejection of invalid files

## 🤝 Contributing

### Development Setup

1. **Fork and Clone:**
   ```bash
   git fork <repository>
   git clone <your-fork>
   cd Lumio
   ```

2. **Set Up Environment:**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
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
- **Testing**: Write tests for new features
- **Code Style**: Follow ESLint and Prettier configurations
- **Commits**: Use conventional commit messages
- **Documentation**: Update README and inline documentation

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes with tests
3. Ensure all tests pass: `npm test`
4. Ensure code quality: `npm run lint && npm run type-check`
5. Commit changes: `git commit -m 'feat: add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Keep functions small and focused

## 🆘 Troubleshooting

### Common Issues

**Redis Connection Error:**
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"

# Start Redis if not running
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux
```

**Gemini API Key Error:**
```bash
# Check if API key is set
grep GEMINI_API_KEY .env
# Should show: GEMINI_API_KEY=your_key_here
```

**Port Already in Use:**
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

**File Upload Issues:**
- Check file size (max 10MB by default)
- Verify file format (PDF, JPEG, PNG, TIFF, BMP, WebP)
- Check available disk space

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf frontend/dist backend/dist
npm run build
```

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run dev:backend
```

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub with detailed information
- **Discussions**: Use GitHub Discussions for questions
- **Logs**: Check console output and log files for error details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini Pro** for advanced AI capabilities
- **Tesseract.js** for reliable OCR fallback
- **shadcn/ui** for beautiful, accessible components
- **React** and **Node.js** ecosystems
- **Open Source Community** for amazing libraries and tools

---

**Built with ❤️ using modern web technologies**

Ready to transform your documents into engaging social media content? Get started with Lumio today!