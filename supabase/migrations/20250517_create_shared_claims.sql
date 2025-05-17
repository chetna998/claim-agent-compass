
-- Enable row level security for the claims table
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

-- Create policy for claims table to allow users to access their own claims
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'claims' AND policyname = 'Users can access their own claims'
  ) THEN
    CREATE POLICY "Users can access their own claims"
    ON public.claims
    FOR ALL
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create shared_claims table to track claims shared between agents
CREATE TABLE IF NOT EXISTS public.shared_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) NOT NULL,
  shared_with UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (claim_id, shared_with)
);

-- Enable row level security for the shared_claims table
ALTER TABLE public.shared_claims ENABLE ROW LEVEL SECURITY;

-- Create policy for shared_claims table to allow users to see claims shared with them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_claims' AND policyname = 'Users can see claims shared with them'
  ) THEN
    CREATE POLICY "Users can see claims shared with them"
    ON public.shared_claims
    FOR SELECT
    USING (auth.uid() = shared_with);
  END IF;
END
$$;

-- Create policy for shared_claims table to allow users to create shared claims
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_claims' AND policyname = 'Users can share claims'
  ) THEN
    CREATE POLICY "Users can share claims"
    ON public.shared_claims
    FOR INSERT
    WITH CHECK (auth.uid() = shared_by);
  END IF;
END
$$;

-- Enable realtime for the shared_claims table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE shared_claims;
  END IF;
END
$$;
