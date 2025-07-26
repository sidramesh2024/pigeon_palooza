# Pigeon Palooza Setup Guide

This guide helps you set up Supabase database and Google Cloud Vision API for Netlify deployment.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Create a Google Cloud project with Vision API enabled
4. Create a service account for Google Cloud Vision

## Database Setup

### 1. Create the Pigeons Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the pigeons table
CREATE TABLE public.pigeons (
    id TEXT PRIMARY KEY DEFAULT extensions.uuid_generate_v4()::TEXT,
    "imageUrl" TEXT NOT NULL,
    "attitudeRating" INTEGER NOT NULL,
    "strutRating" INTEGER NOT NULL,
    "touristJudgingRating" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    landmark TEXT NOT NULL,
    "bonusPoints" INTEGER DEFAULT 0,
    "funDescription" TEXT NOT NULL,
    "submittedBy" TEXT DEFAULT 'Anonymous New Yorker',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pigeons ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public read access" ON public.pigeons
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.pigeons
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_pigeons_updated_at
    BEFORE UPDATE ON public.pigeons
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for images (optional - if you want to use Supabase storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('pigeon-images', 'pigeon-images', true);

-- Storage policy for public read
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'pigeon-images');

-- Storage policy for public upload
CREATE POLICY "Public upload access" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pigeon-images');
```

## Google Cloud Vision API Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Vision API**

### 2. Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "pigeon-analyzer")
4. Grant **Cloud Vision API User** role
5. Create and download the JSON key file

### 3. Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Cloud Vision (for local development only)
GOOGLE_APPLICATION_CREDENTIALS=./nycsilly.json
```

### 4. Netlify Environment Variables

In your Netlify project settings, add these environment variables:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key



## Deployment Commands

```bash
# Install dependencies
npm install

# Build for static export
npm run build

# The built files will be in the 'out' directory
# Deploy the 'out' directory to Netlify
```

## Testing Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to test the application.

## How Google Cloud Vision Integration Works

1. **User uploads image** → Client sends to Netlify function
2. **Netlify function** → Calls Google Cloud Vision API
3. **Vision API analyzes** → Returns labels, objects, confidence scores
4. **Smart rating algorithm** → Converts vision data to pigeon personality scores
5. **Results returned** → Fun NYC-style description + ratings

### Analysis Features:
- **Attitude Rating**: Based on bird confidence and posture detection
- **Strut Level**: Analyzes stance and walking poses
- **Tourist Judging**: Detects urban environment and people presence
- **NYC Descriptions**: Contextual slang based on landmark and analysis

## Fallback Behavior

If Google Cloud Vision fails:
- App automatically falls back to mock analysis
- Users still get ratings (random but realistic)
- No functionality is lost
- Error is logged for debugging

## Notes

- The app is configured for static export and Netlify deployment
- All API routes have been replaced with direct Supabase calls
- Google Cloud Vision runs via Netlify Functions
- Image uploads currently use base64 encoding; consider using Supabase Storage for production
- AI analysis provides intelligent ratings based on actual image content 