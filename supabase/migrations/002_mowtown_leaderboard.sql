-- Mow Town Game Leaderboard
CREATE TABLE mowtown_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  yard TEXT NOT NULL,
  percent INTEGER NOT NULL,
  combo INTEGER NOT NULL DEFAULT 0,
  hits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast leaderboard queries
CREATE INDEX idx_mowtown_leaderboard_score ON mowtown_leaderboard (percent DESC, combo DESC, hits ASC);
CREATE INDEX idx_mowtown_leaderboard_yard ON mowtown_leaderboard (yard, percent DESC);

-- RLS: Anyone can read the leaderboard
ALTER TABLE mowtown_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
  ON mowtown_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON mowtown_leaderboard FOR INSERT
  WITH CHECK (true);
