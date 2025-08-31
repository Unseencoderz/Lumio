import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3001),
  corsOrigin: z.string().default('http://localhost:3000'),
  
  // AI Services
  geminiApiKey: z.string().min(1, 'GEMINI_API_KEY is required'),
  
  // Redis (supports both local and cloud)
  redisUrl: z.string().optional(),
  redisHost: z.string().optional(),
  redisPort: z.coerce.number().optional(),
  redisUsername: z.string().optional(),
  redisPassword: z.string().optional(),
  
  // Firebase (Authentication only)
  firebaseProjectId: z.string().optional(),
  firebasePrivateKey: z.string().optional(),
  firebaseClientEmail: z.string().optional(),
  useFirebaseStorage: z.coerce.boolean().default(false),
  firebaseStorageBucket: z.string().optional(),
  
  // Supabase (Database and optional storage)
  supabaseUrl: z.string().optional(),
  supabaseServiceKey: z.string().optional(),
  supabaseBucket: z.string().default('uploads'),
  useSupabase: z.coerce.boolean().default(false),
  
  // File Processing
  maxFileSizeBytes: z.coerce.number().default(10 * 1024 * 1024), // 10MB
  jobTtlSeconds: z.coerce.number().default(24 * 60 * 60), // 24 hours
  maxPdfPages: z.coerce.number().default(10),
  
  // Rate Limiting
  rateLimitUploadsPerHour: z.coerce.number().default(10),
  
  // Observability
  sentryDsn: z.string().optional(),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Security
  jwtSecret: z.string().optional(),
});

const parseConfig = (): z.infer<typeof configSchema> => {
  const result = configSchema.safeParse({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN,
    geminiApiKey: process.env.GEMINI_API_KEY,
    redisUrl: process.env.REDIS_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    useFirebaseStorage: process.env.USE_FIREBASE_STORAGE,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    supabaseBucket: process.env.SUPABASE_BUCKET,
    useSupabase: process.env.USE_SUPABASE,
    maxFileSizeBytes: process.env.MAX_FILE_SIZE_BYTES,
    jobTtlSeconds: process.env.JOB_TTL_SECONDS,
    maxPdfPages: process.env.MAX_PDF_PAGES,
    rateLimitUploadsPerHour: process.env.RATE_LIMIT_UPLOADS_PER_HOUR,
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL,
    jwtSecret: process.env.JWT_SECRET,
  });

  if (!result.success) {
    console.error('Invalid configuration:', result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const config = parseConfig();