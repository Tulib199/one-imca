export type AppRole =
  | "executive_director"
  | "department_head"
  | "unit_director"
  | "member";

export type Visibility = "private" | "unit" | "department" | "organization";

export type ResourceKind =
  | "submission"
  | "proposal"
  | "managed_event"
  | "calendar_event";

export interface OrgUnitOption {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  directorName?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  departmentId: string | null;
  unitId: string | null;
  createdAt: string;
}

export interface WorkItemRecord<T = unknown> {
  id: string;
  kind: ResourceKind;
  ownerId: string;
  ownerName: string;
  departmentId: string | null;
  unitId: string | null;
  visibility: Visibility;
  title: string;
  payload: T;
  sharedWithUserIds: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  executive_director: "Executive Director",
  department_head: "Department Head",
  unit_director: "Unit / Council Director",
  member: "Team Member",
};

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  private: "Private (only me + people I invite)",
  unit: "My unit / council",
  department: "My department leadership & unit",
  organization: "Leadership / organization",
};
