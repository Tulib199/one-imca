import type { AppState } from "../types";

const KEY = "imca-strategy-studio-v1";

export const emptyState = (): AppState => ({
  submissions: [],
  events: [],
  proposals: [],
  managedEvents: [],
});

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as AppState;
    return {
      submissions: parsed.submissions ?? [],
      events: parsed.events ?? [],
      proposals: parsed.proposals ?? [],
      managedEvents: parsed.managedEvents ?? [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
