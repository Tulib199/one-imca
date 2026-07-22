# One IMCA

Interactive workspace for the Indianapolis Muslim Community Association (IMCA).

**Status:** First draft — features and workflows may change with feedback.

## Live sites

- **GitHub Pages:** https://tulib199.github.io/one-imca/
- **Railway:** create a project from this repo (see below) — connecting GitHub alone does not auto-deploy

Repo: https://github.com/Tulib199/one-imca

On first visit, a popup notes that this is a **first draft**.

### Deploy on Railway

1. Open [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select **`Tulib199/one-imca`** (not just “GitHub connected”)
4. Wait for build; then **Settings → Networking → Generate Domain**

Build/start are defined in `railway.toml`.


## Features

- **Accounts + invite codes** — each person registers with their own login; unit codes assign department/unit
- **Private by default** — only the owner can edit/delete; share or raise visibility when ready
- **About One IMCA** — what IMCA 3.0 is and why Objectives / ToC / Scorecard matter
- **Guided Objectives intake** — step-by-step questions for strategy ideas
- **Balanced Scorecard generator** — goals and KPIs aligned to IMCA 3.0
- **Theory of Change generator** — inputs → activities → outputs → outcomes → impact
- **Project Proposal builder (GR-F-07 style)** — guided questions with suggested answers
- **Event Manager** — create events, assign leads, Pre/Day/Post checklists; archive by month
- **IMCA Calendar** — confirmed (green) / tentative (yellow) events

### Accounts & privacy

Staff sign in with email/password and a unit invite code. Work starts **private**. Owners can share with specific people or set unit / department / organization visibility. See [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) for invite codes and Supabase cloud setup.

Today, accounts and saved work live in the browser (`localStorage`) on that device. For true multi-computer sync, connect Supabase using `.env.example` and `supabase/schema.sql`.

## Run locally

```bash
cd imca-strategy-studio
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/one-imca/`).

## Build

```bash
npm run build
npm run preview
```

## Deploy

Push to `main` triggers GitHub Actions → GitHub Pages (see `.github/workflows/deploy-pages.yml`).

In the repo settings, set Pages source to **GitHub Actions**.
