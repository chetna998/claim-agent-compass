
-- Create function to share a claim
CREATE OR REPLACE FUNCTION public.share_claim(
  p_claim_id UUID,
  p_shared_by UUID,
  p_shared_with UUID
) RETURNS void AS $$
BEGIN
  INSERT INTO public.shared_claims (claim_id, shared_by, shared_with)
  VALUES (p_claim_id, p_shared_by, p_shared_with);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to insert a shared claim (alternative approach)
CREATE OR REPLACE FUNCTION public.insert_shared_claim(
  p_claim_id UUID,
  p_shared_by UUID,
  p_shared_with UUID
) RETURNS void AS $$
BEGIN
  INSERT INTO public.shared_claims (claim_id, shared_by, shared_with)
  VALUES (p_claim_id, p_shared_by, p_shared_with);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get shared claims for a user with related data
CREATE OR REPLACE FUNCTION public.get_shared_claims_for_user(user_id UUID)
RETURNS TABLE (
  id UUID,
  claim_id UUID,
  shared_by UUID,
  shared_with UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  claim JSONB,
  shared_by_profile JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sc.id,
    sc.claim_id,
    sc.shared_by,
    sc.shared_with,
    sc.created_at,
    to_jsonb(c) AS claim,
    jsonb_build_object('name', p.name) AS shared_by_profile
  FROM 
    public.shared_claims sc
    JOIN public.claims c ON sc.claim_id = c.id
    JOIN public.profiles p ON sc.shared_by = p.id
  WHERE 
    sc.shared_with = user_id
  ORDER BY 
    sc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a claim is shared with a specific user
CREATE OR REPLACE FUNCTION public.is_claim_shared_with_user(p_claim_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.shared_claims
    WHERE claim_id = p_claim_id AND shared_with = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
