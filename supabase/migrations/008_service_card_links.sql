-- Lets an admin attach a URL to a service card so the whole card (not just
-- its text) is clickable on the homepage "Our Core SEO Services" grid.
ALTER TABLE services ADD COLUMN link_url TEXT;
