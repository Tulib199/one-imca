# One IMCA — Accounts, privacy & cloud setup

## How access works (best practice)

1. **Each person creates their own login** (email + password).
2. They enter a **unit invite code** only to join the right department/unit.
3. All new work starts as **Private**.
4. Only the **owner** can edit or delete.
5. Owners can share with specific people, or raise visibility to unit / department / organization.

Invite codes are **not** shared passwords for a whole unit’s files.

## Using it today (works on the live site now)

1. Open the app and **Register**.
2. Use the invite code for your unit (shown on the register screen).
3. Create Objectives / Proposals / Events — saved to **your account on that browser**.
4. Use **Visibility & sharing** on Scorecard / ToC to share when ready.

### Important limitation (local mode)

Accounts and saved work are stored in the browser (`localStorage`) on that device.  
This is good for rollout testing. For true multi-computer shared cloud, connect Supabase (below).

## Unit invite codes (initial rollout)

| Role / Unit | Code |
|-------------|------|
| Executive Director | `IMCA-ED-0001` |
| Operations Dept Head | `IMCA-OPS-HEAD` |
| Education Dept Head | `IMCA-EDU-HEAD` |
| Social Services Dept Head | `IMCA-SS-HEAD` |
| Community Engagement Dept Head | `IMCA-CE-HEAD` |
| Marketing and Branding | `IMCA-MKT-1001` |
| Personnel and Staff | `IMCA-HR-1001` |
| IT | `IMCA-IT-1001` |
| Facilities | `IMCA-FAC-1001` |
| Media and Communications | `IMCA-MEDIA-1001` |
| Events Management | `IMCA-EVT-1001` |
| MTI | `IMCA-MTI-1001` |
| Weekend School | `IMCA-WEEK-1001` |
| Social Worker Services | `IMCA-SW-1001` |
| Zakat Council | `IMCA-ZKT-1001` |
| Cemetery / Funeral | `IMCA-CEM-1001` |
| Food Pantry | `IMCA-PANTRY-1001` |
| Crescent Clinic | `IMCA-CLINIC-1001` |
| Mobile Clinic | `IMCA-MOBILE-1001` |
| Compassion Circle | `IMCA-COMP-1001` |
| Masjid Al-Fajr | `IMCA-MASJID-1001` |
| Muslim Professionals | `IMCA-PROF-1001` |
| Youth Council | `IMCA-YOUTH-1001` |
| Athletic Council | `IMCA-ATH-1001` |
| Women's Council | `IMCA-WOMEN-1001` |
| New Muslims Council | `IMCA-NEW-1001` |
| Muslim Business Council | `IMCA-BIZ-1001` |
| Legal Clinic | `IMCA-LEGAL-1001` |

Change these codes after the first rollout.

## Supabase cloud (multi-device / production)

1. Create a free project at https://supabase.com
2. SQL Editor → run `supabase/schema.sql`
3. SQL Editor → run `supabase/seed.sql`
4. Project Settings → API → copy URL and anon key
5. Add to `.env` / Railway / GitHub Pages env:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

6. Enable Email auth in Supabase Authentication settings.

Cloud adapter wiring can be completed in the next iteration once keys are available; schema and seed are already in the repo.
