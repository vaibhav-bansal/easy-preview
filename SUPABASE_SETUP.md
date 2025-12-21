# Supabase Setup for Feedback Form

## Current Schema

The feedback table currently has these columns:
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `rating` (INTEGER, 1-5)
- `category` (TEXT: 'query', 'request', 'collaboration', 'bug')
- `message` (TEXT)
- `created_at` (TIMESTAMPTZ)

## Optional: Add Name and Email Columns

If you want to store the name and email collected in the form, run these SQL commands in your Supabase SQL editor:

```sql
-- Add name and email columns
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS email TEXT;

-- Optional: Add indexes for querying
CREATE INDEX IF NOT EXISTS feedback_email_idx ON feedback(email);
```

Then update `js/feedback.js` to include these fields in the `feedbackData` object (uncomment the name/email lines).

## Supabase Configuration

The Supabase client is configured in `js/feedback.js`:

```javascript
const SUPABASE_URL = 'https://mdbqvnnk3inllny8gxoc0q.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mdbQvNnk3InlLnY8GxOC0Q_EEMkWYd8';
```

**Note:** The anon key format looks unusual. Standard Supabase anon keys are longer base64-like strings. Please verify this key in your Supabase project settings (Settings > API).

## Authentication

The feedback form uses **anonymous authentication** to satisfy the RLS policies. Each feedback submission creates an anonymous user session.

## Testing

1. Make sure your Supabase project URL and anon key are correct
2. Ensure the feedback table exists with the correct schema
3. Verify RLS policies allow anonymous users to insert
4. Test the feedback form submission

