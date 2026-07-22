-- Seed IMCA departments, units, and invite codes
-- Codes are first-join helpers only; each person still has their own login.

insert into public.departments (id, name, head_name) values
  ('executive', 'Executive', 'Dr Ahmed Alamine'),
  ('operations', 'Operations', 'Muhammad Ashraff'),
  ('education', 'Education', 'Dr Safaa Zarzour'),
  ('socialServices', 'Social Services', 'Dr Halima Al-Khattab'),
  ('communityEngagement', 'Community Engagement', 'Tulib Ahmed')
on conflict (id) do update set name = excluded.name, head_name = excluded.head_name;

insert into public.units (id, department_id, name, director_name) values
  ('exec-office', 'executive', 'Executive Director Office', 'Dr Ahmed Alamine'),
  ('marketing-branding', 'operations', 'Marketing and Branding', null),
  ('personnel-staff', 'operations', 'Personnel and Staff Management', null),
  ('it', 'operations', 'Information Technology (IT)', null),
  ('facilities', 'operations', 'Maintenance, Assets, and Facilities Management', null),
  ('media-comms', 'operations', 'Media and Communications', 'Gazawi'),
  ('events', 'operations', 'Events Management', null),
  ('mti', 'education', 'MTI School of Knowledge', null),
  ('weekend-school', 'education', 'IMCA Weekend School', null),
  ('social-worker', 'socialServices', 'Social Worker Services', null),
  ('zakat', 'socialServices', 'Zakat Council', null),
  ('cemetery-funeral', 'socialServices', 'Cemetery and Funeral Services', null),
  ('food-pantry', 'socialServices', 'Food Pantry', null),
  ('crescent-clinic', 'socialServices', 'Crescent Clinic', null),
  ('mobile-clinic', 'socialServices', 'Mobile Clinic', null),
  ('compassion-circle', 'socialServices', 'Compassion Circle', null),
  ('masjid-al-fajr', 'communityEngagement', 'Masjid Al-Fajr', null),
  ('muslim-professionals', 'communityEngagement', 'Muslim Professionals Council', null),
  ('youth-council', 'communityEngagement', 'Youth Council', null),
  ('athletic-council', 'communityEngagement', 'Athletic Council', null),
  ('womens-council', 'communityEngagement', 'Women''s Council', null),
  ('new-muslims', 'communityEngagement', 'New Muslims Council', null),
  ('muslim-business', 'communityEngagement', 'Muslim Business Council', null),
  ('legal-clinic', 'communityEngagement', 'Legal Clinic', null)
on conflict (id) do update set
  department_id = excluded.department_id,
  name = excluded.name,
  director_name = excluded.director_name;

-- Invite codes (change after first rollout). Format: IMCA-<UNIT>-####
insert into public.unit_invite_codes (code, unit_id, role, active) values
  ('IMCA-ED-0001', 'exec-office', 'executive_director', true),
  ('IMCA-OPS-HEAD', 'marketing-branding', 'department_head', true),
  ('IMCA-EDU-HEAD', 'mti', 'department_head', true),
  ('IMCA-SS-HEAD', 'food-pantry', 'department_head', true),
  ('IMCA-CE-HEAD', 'masjid-al-fajr', 'department_head', true),
  ('IMCA-MKT-1001', 'marketing-branding', 'unit_director', true),
  ('IMCA-HR-1001', 'personnel-staff', 'unit_director', true),
  ('IMCA-IT-1001', 'it', 'unit_director', true),
  ('IMCA-FAC-1001', 'facilities', 'unit_director', true),
  ('IMCA-MEDIA-1001', 'media-comms', 'unit_director', true),
  ('IMCA-EVT-1001', 'events', 'unit_director', true),
  ('IMCA-MTI-1001', 'mti', 'unit_director', true),
  ('IMCA-WEEK-1001', 'weekend-school', 'unit_director', true),
  ('IMCA-SW-1001', 'social-worker', 'unit_director', true),
  ('IMCA-ZKT-1001', 'zakat', 'unit_director', true),
  ('IMCA-CEM-1001', 'cemetery-funeral', 'unit_director', true),
  ('IMCA-PANTRY-1001', 'food-pantry', 'unit_director', true),
  ('IMCA-CLINIC-1001', 'crescent-clinic', 'unit_director', true),
  ('IMCA-MOBILE-1001', 'mobile-clinic', 'unit_director', true),
  ('IMCA-COMP-1001', 'compassion-circle', 'unit_director', true),
  ('IMCA-MASJID-1001', 'masjid-al-fajr', 'unit_director', true),
  ('IMCA-PROF-1001', 'muslim-professionals', 'unit_director', true),
  ('IMCA-YOUTH-1001', 'youth-council', 'unit_director', true),
  ('IMCA-ATH-1001', 'athletic-council', 'unit_director', true),
  ('IMCA-WOMEN-1001', 'womens-council', 'unit_director', true),
  ('IMCA-NEW-1001', 'new-muslims', 'unit_director', true),
  ('IMCA-BIZ-1001', 'muslim-business', 'unit_director', true),
  ('IMCA-LEGAL-1001', 'legal-clinic', 'unit_director', true)
on conflict (code) do nothing;

-- Fix department_head codes to attach to department properly after signup:
-- After a head registers with IMCA-OPS-HEAD etc., manually set profiles.department_id
-- and profiles.role in Supabase Table Editor if needed.
