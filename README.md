# One IMCA

Interactive workspace for the Indianapolis Muslim Community Association (IMCA).

**Status:** First draft — features and workflows may change with feedback.

## Live site (GitHub Pages)

**https://tulib199.github.io/one-imca/**

Repo: https://github.com/Tulib199/one-imca

On first visit, a popup notes that this is a **first draft**.

## Features

- **About One IMCA** — what IMCA 3.0 is and why Objectives / ToC / Scorecard matter
- **Guided Objectives intake** — step-by-step questions for strategy ideas
- **Balanced Scorecard generator** — goals and KPIs aligned to IMCA 3.0
- **Theory of Change generator** — inputs → activities → outputs → outcomes → impact
- **Project Proposal builder (GR-F-07 style)** — guided questions with suggested answers
- **Event Manager** — create events, assign leads, Pre/Day/Post checklists; archive by month
- **IMCA Calendar** — confirmed (green) / tentative (yellow) events

Data is stored locally in the browser (`localStorage`) for now.

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
