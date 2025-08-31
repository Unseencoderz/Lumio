# Database Setup Guide

This project uses a hybrid database architecture:

## Architecture Overview

- **Firebase**: User authentication and session management
- **Supabase**: Job history, analysis results, and persistent data storage  
- **Redis**: Caching and job queue management

## Setup Instructions

### 1. Firebase Setup (Authentication)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and configure providers (Email, Google, GitHub)
3. Generate service account credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
4. Extract the required environment variables:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   ```

### 2. Supabase Setup (Database)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials:
   - Go to Settings > API
   - Copy the Project URL and Service Role Key
3. Set environment variables:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   USE_SUPABASE=true
   ```
4. Run the database schema:
   - Open Supabase SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the script

### 3. Redis Setup (Caching & Queues)

```bash
# Local Redis
REDIS_URL=redis://localhost:6379

# Or Cloud Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your-password
```

## Database Schema

### Jobs Table (Supabase)

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key, auto-incrementing |
| `user_id` | TEXT | Firebase UID |
| `filename` | TEXT | Sanitized filename |
| `original_name` | TEXT | Original uploaded filename |
| `created_at` | TIMESTAMPTZ | Job creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |
| `status` | TEXT | processing/completed/failed |
| `storage_path` | TEXT | File storage location |
| `extracted_text` | TEXT | Extracted document text |
| `analysis` | JSONB | AI analysis results |
| `meta` | JSONB | Processing metadata |
| `error_message` | TEXT | Error details if failed |

### Security

- **Row Level Security (RLS)** is enabled
- Users can only access their own job records
- Firebase JWT tokens are used for authentication
- Service role key is used for backend operations

## Data Flow

1. **File Upload**: User uploads file (authenticated or anonymous)
2. **Job Creation**: If authenticated, job record created in Supabase
3. **Processing**: Background worker processes file
4. **Result Storage**: Results saved to both Redis (cache) and Supabase (persistent)
5. **History Access**: Authenticated users can view their job history

## Migration Notes

If migrating from the previous Firebase Firestore implementation:

1. Export existing data from Firestore
2. Transform data structure to match new schema
3. Import into Supabase jobs table
4. Update user_id references to use Firebase UIDs

## Troubleshooting

**Supabase Connection Issues:**
- Verify URL and service key are correct
- Check that RLS policies are properly configured
- Ensure network connectivity to Supabase

**Authentication Issues:**
- Verify Firebase tokens are being passed correctly
- Check that user_id matches Firebase UID format
- Ensure RLS policies allow the operation

**Performance:**
- Monitor query performance in Supabase dashboard
- Consider adding additional indexes for large datasets
- Use pagination for large result sets 