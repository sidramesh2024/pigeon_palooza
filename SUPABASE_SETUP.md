# Supabase Setup for Pigeon Palooza

This guide helps you set up the Supabase database for Netlify deployment.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

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

### 2. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Netlify Environment Variables

In your Netlify project settings, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public API key

## AI Analysis (Optional Enhancement)

The current implementation uses mock AI analysis. To enable real AI analysis:

### Option 1: Supabase Edge Functions

1. Create a Supabase Edge Function for AI analysis
2. Update `analyzePigeonImage` in `lib/supabase-helpers.ts` to call the Edge Function

### Option 2: Netlify Functions

1. Create a Netlify Function in `netlify/functions/analyze-pigeon.js`
2. Update the analysis function to call this endpoint

## Deployment Commands

```bash
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

## Notes

- The app is now configured for static export and Netlify deployment
- All API routes have been replaced with direct Supabase calls
- Image uploads currently use base64 encoding; consider using Supabase Storage for production
- AI analysis is mocked; implement real analysis using Edge Functions or Netlify Functions as needed 