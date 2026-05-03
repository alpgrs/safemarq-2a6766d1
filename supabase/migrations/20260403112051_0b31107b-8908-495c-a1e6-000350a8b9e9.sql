
CREATE TABLE public.helpful_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, review_id)
);

ALTER TABLE public.helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own votes"
ON public.helpful_votes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add votes"
ON public.helpful_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove votes"
ON public.helpful_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to increment helpful_count
CREATE OR REPLACE FUNCTION public.increment_helpful_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  RETURN NEW;
END;
$$;

-- Function to decrement helpful_count
CREATE OR REPLACE FUNCTION public.decrement_helpful_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.review_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_helpful_vote_insert
AFTER INSERT ON public.helpful_votes
FOR EACH ROW EXECUTE FUNCTION public.increment_helpful_count();

CREATE TRIGGER on_helpful_vote_delete
AFTER DELETE ON public.helpful_votes
FOR EACH ROW EXECUTE FUNCTION public.decrement_helpful_count();
