-- Create feedbacks table for event feedback submission
CREATE TABLE feedbacks (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments text,
  created_at timestamp NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (public form)
CREATE POLICY "Anyone can submit feedback"
ON feedbacks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow reading feedback (for future analytics if needed)
CREATE POLICY "Anyone can read feedback"
ON feedbacks
FOR SELECT
TO anon, authenticated
USING (true);