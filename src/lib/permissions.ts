import type { UserProfile, Visibility, WorkItemRecord } from "../types/auth";

export function canViewWork(viewer: UserProfile, item: WorkItemRecord): boolean {
  if (item.deletedAt) return false;
  if (item.ownerId === viewer.id) return true;
  if (item.sharedWithUserIds.includes(viewer.id)) return true;

  if (item.visibility === "private") return false;

  if (item.visibility === "unit") {
    return Boolean(viewer.unitId && viewer.unitId === item.unitId);
  }

  if (item.visibility === "department") {
    if (viewer.role === "executive_director") return true;
    return Boolean(viewer.departmentId && viewer.departmentId === item.departmentId);
  }

  if (item.visibility === "organization") {
    return true;
  }

  return false;
}

export function canEditWork(viewer: UserProfile, item: WorkItemRecord): boolean {
  return !item.deletedAt && item.ownerId === viewer.id;
}

export function canDeleteWork(viewer: UserProfile, item: WorkItemRecord): boolean {
  return canEditWork(viewer, item);
}

export function defaultVisibilityForRole(_role: UserProfile["role"]): Visibility {
  return "private";
}
