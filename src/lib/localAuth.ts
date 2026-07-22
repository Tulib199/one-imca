import { resolveInviteCode, unitById } from "../data/orgAccess";
import type {
  ResourceKind,
  UserProfile,
  Visibility,
  WorkItemRecord,
} from "../types/auth";
import { canDeleteWork, canEditWork, canViewWork } from "./permissions";
import { hashPassword, verifyPassword } from "./crypto";

const USERS_KEY = "one-imca-users-v1";
const WORK_KEY = "one-imca-work-v1";
const SESSION_KEY = "one-imca-session-v1";

interface StoredUser extends UserProfile {
  passwordHash: string;
  passwordSalt: string;
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readWork(): WorkItemRecord[] {
  try {
    return JSON.parse(localStorage.getItem(WORK_KEY) || "[]") as WorkItemRecord[];
  } catch {
    return [];
  }
}

function writeWork(items: WorkItemRecord[]) {
  localStorage.setItem(WORK_KEY, JSON.stringify(items));
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(id: string | null) {
  if (!id) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, id);
}

export function listDirectoryUsers(): UserProfile[] {
  return readUsers().map(({ passwordHash: _h, passwordSalt: _s, ...profile }) => profile);
}

export async function registerLocalUser(input: {
  email: string;
  password: string;
  fullName: string;
  inviteCode: string;
}): Promise<UserProfile> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || input.password.length < 8) {
    throw new Error("Use a valid email and a password of at least 8 characters.");
  }
  const invite = resolveInviteCode(input.inviteCode);
  if (!invite) throw new Error("Invalid invite code. Ask your department head for the unit code.");

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists. Please sign in.");
  }

  const unit = unitById(invite.unitId);
  const { hash, salt } = await hashPassword(input.password);
  const profile: StoredUser = {
    id: crypto.randomUUID(),
    email,
    fullName: input.fullName.trim(),
    role: invite.role,
    departmentId: invite.departmentId ?? unit?.departmentId ?? null,
    unitId: invite.unitId,
    createdAt: new Date().toISOString(),
    passwordHash: hash,
    passwordSalt: salt,
  };
  writeUsers([...users, profile]);
  setSessionUserId(profile.id);
  const { passwordHash: _h, passwordSalt: _s, ...safe } = profile;
  return safe;
}

export async function loginLocalUser(email: string, password: string): Promise<UserProfile> {
  const users = readUsers();
  const found = users.find((u) => u.email === email.trim().toLowerCase());
  if (!found) throw new Error("No account found for that email.");
  const ok = await verifyPassword(password, found.passwordSalt, found.passwordHash);
  if (!ok) throw new Error("Incorrect password.");
  setSessionUserId(found.id);
  const { passwordHash: _h, passwordSalt: _s, ...safe } = found;
  return safe;
}

export function logoutLocalUser() {
  setSessionUserId(null);
}

export function getLocalProfile(userId: string | null): UserProfile | null {
  if (!userId) return null;
  const found = readUsers().find((u) => u.id === userId);
  if (!found) return null;
  const { passwordHash: _h, passwordSalt: _s, ...safe } = found;
  return safe;
}

export function listVisibleWork<T = unknown>(
  viewer: UserProfile,
  kind?: ResourceKind,
): WorkItemRecord<T>[] {
  return readWork()
    .filter((item) => (!kind || item.kind === kind) && canViewWork(viewer, item))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) as WorkItemRecord<T>[];
}

export function upsertWorkItem<T>(
  viewer: UserProfile,
  input: {
    id?: string;
    kind: ResourceKind;
    title: string;
    payload: T;
    visibility?: Visibility;
    sharedWithUserIds?: string[];
  },
): WorkItemRecord<T> {
  const items = readWork();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = items.findIndex((i) => i.id === input.id);
    if (idx < 0) throw new Error("Work item not found.");
    const existing = items[idx];
    if (!canEditWork(viewer, existing)) throw new Error("You can only edit your own work.");
    const updated: WorkItemRecord = {
      ...existing,
      title: input.title,
      payload: input.payload,
      visibility: input.visibility ?? existing.visibility,
      sharedWithUserIds: input.sharedWithUserIds ?? existing.sharedWithUserIds,
      updatedAt: now,
    };
    items[idx] = updated;
    writeWork(items);
    return updated as WorkItemRecord<T>;
  }

  const created: WorkItemRecord<T> = {
    id: crypto.randomUUID(),
    kind: input.kind,
    ownerId: viewer.id,
    ownerName: viewer.fullName,
    departmentId: viewer.departmentId,
    unitId: viewer.unitId,
    visibility: input.visibility ?? "private",
    title: input.title,
    payload: input.payload,
    sharedWithUserIds: input.sharedWithUserIds ?? [],
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  writeWork([created, ...items]);
  return created;
}

export function softDeleteWork(viewer: UserProfile, id: string) {
  const items = readWork();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return;
  if (!canDeleteWork(viewer, items[idx])) {
    throw new Error("You can only delete your own work.");
  }
  items[idx] = {
    ...items[idx],
    deletedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  writeWork(items);
}

export function updateVisibility(
  viewer: UserProfile,
  id: string,
  visibility: Visibility,
  sharedWithUserIds: string[],
) {
  const items = readWork();
  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) throw new Error("Work item not found.");
  if (!canEditWork(viewer, items[idx])) throw new Error("You can only change sharing on your own work.");
  items[idx] = {
    ...items[idx],
    visibility,
    sharedWithUserIds,
    updatedAt: new Date().toISOString(),
  };
  writeWork(items);
  return items[idx];
}
