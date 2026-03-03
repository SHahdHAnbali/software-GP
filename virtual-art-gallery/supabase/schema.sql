-- ============================================================
-- Virtual Art Gallery — Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles Table ──────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  user_type   TEXT NOT NULL CHECK (user_type IN ('artist', 'visitor')) DEFAULT 'visitor',
  gallery_name TEXT,
  bio         TEXT,
  profile_pic TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── Artworks Table ──────────────────────────────────────────
CREATE TABLE public.artworks (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT NOT NULL,
  artist_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  dimensions   TEXT,
  materials    TEXT,
  year         INTEGER CHECK (year > 999 AND year < 3000),
  price        NUMERIC(12, 2),
  artwork_type TEXT,
  -- 3D position
  position_x   NUMERIC DEFAULT 0,
  position_y   NUMERIC DEFAULT 1.8,
  position_z   NUMERIC DEFAULT 0,
  -- Rotation (radians)
  rotation_x   NUMERIC DEFAULT 0,
  rotation_y   NUMERIC DEFAULT 0,
  rotation_z   NUMERIC DEFAULT 0,
  -- Scale
  scale_x      NUMERIC DEFAULT 1.5,
  scale_y      NUMERIC DEFAULT 1.2,
  scale_z      NUMERIC DEFAULT 1,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_artworks_artist_id ON public.artworks(artist_id);
CREATE INDEX idx_artworks_created_at ON public.artworks(created_at DESC);

-- ─── RLS: Profiles ───────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── RLS: Artworks ───────────────────────────────────────────
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Anyone can read artworks
CREATE POLICY "Artworks are publicly readable"
  ON public.artworks FOR SELECT USING (true);

-- Only artists can insert artworks (linked to their profile)
CREATE POLICY "Artists can insert own artworks"
  ON public.artworks FOR INSERT
  WITH CHECK (
    auth.uid() = artist_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'artist'
    )
  );

-- Artists can only update their own artworks
CREATE POLICY "Artists can update own artworks"
  ON public.artworks FOR UPDATE
  USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

-- Artists can only delete their own artworks
CREATE POLICY "Artists can delete own artworks"
  ON public.artworks FOR DELETE
  USING (auth.uid() = artist_id);

-- ─── Trigger: Auto-create profile after signup ───────────────
-- (Optionally used instead of creating profile in JS)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, username, user_type)
--   VALUES (NEW.id, NEW.email, 'visitor');
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Storage Buckets ─────────────────────────────────────────
-- Run in Supabase Dashboard > Storage, or via API:

-- 1. Create 'artworks' bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create 'avatars' bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ─── Storage Policies: Artworks ──────────────────────────────
CREATE POLICY "Anyone can read artwork images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "Artists can upload artwork images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'artworks'
    AND auth.uid() IS NOT NULL
    AND (octet_length(name) > 0)
  );

CREATE POLICY "Artists can delete own artwork images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'artworks'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── Storage Policies: Avatars ───────────────────────────────
CREATE POLICY "Anyone can read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

-- ─── Realtime ────────────────────────────────────────────────
-- Enable realtime for artworks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.artworks;

-- ============================================================
-- DONE! Your Virtual Art Gallery database is ready.
-- ============================================================
