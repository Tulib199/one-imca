import { DEPARTMENTS, EXECUTIVE_DIRECTOR } from "./orgStructure";
import type { AppRole, OrgUnitOption } from "../types/auth";

export const ORG_UNITS: OrgUnitOption[] = [
  {
    id: "exec-office",
    departmentId: "executive",
    departmentName: "Executive",
    name: "Executive Director Office",
    directorName: EXECUTIVE_DIRECTOR.name,
  },
  ...DEPARTMENTS.flatMap((dept) =>
    dept.entities.map((entity) => ({
      id: entity.id,
      departmentId: dept.id,
      departmentName: dept.name,
      name: entity.name,
      directorName: entity.directorName,
    })),
  ),
];

/** Invite codes map people into a unit + suggested role. Each person still has their own login. */
export const INVITE_CODES: Record<
  string,
  { unitId: string; role: AppRole; departmentId?: string }
> = {
  "IMCA-ED-0001": { unitId: "exec-office", role: "executive_director", departmentId: "executive" },
  "IMCA-OPS-HEAD": {
    unitId: "marketing-branding",
    role: "department_head",
    departmentId: "operations",
  },
  "IMCA-EDU-HEAD": { unitId: "mti", role: "department_head", departmentId: "education" },
  "IMCA-SS-HEAD": {
    unitId: "food-pantry",
    role: "department_head",
    departmentId: "socialServices",
  },
  "IMCA-CE-HEAD": {
    unitId: "masjid-al-fajr",
    role: "department_head",
    departmentId: "communityEngagement",
  },
  "IMCA-MKT-1001": { unitId: "marketing-branding", role: "unit_director" },
  "IMCA-HR-1001": { unitId: "personnel-staff", role: "unit_director" },
  "IMCA-IT-1001": { unitId: "it", role: "unit_director" },
  "IMCA-FAC-1001": { unitId: "facilities", role: "unit_director" },
  "IMCA-MEDIA-1001": { unitId: "media-comms", role: "unit_director" },
  "IMCA-EVT-1001": { unitId: "events", role: "unit_director" },
  "IMCA-MTI-1001": { unitId: "mti", role: "unit_director" },
  "IMCA-WEEK-1001": { unitId: "weekend-school", role: "unit_director" },
  "IMCA-SW-1001": { unitId: "social-worker", role: "unit_director" },
  "IMCA-ZKT-1001": { unitId: "zakat", role: "unit_director" },
  "IMCA-CEM-1001": { unitId: "cemetery-funeral", role: "unit_director" },
  "IMCA-PANTRY-1001": { unitId: "food-pantry", role: "unit_director" },
  "IMCA-CLINIC-1001": { unitId: "crescent-clinic", role: "unit_director" },
  "IMCA-MOBILE-1001": { unitId: "mobile-clinic", role: "unit_director" },
  "IMCA-COMP-1001": { unitId: "compassion-circle", role: "unit_director" },
  "IMCA-MASJID-1001": { unitId: "masjid-al-fajr", role: "unit_director" },
  "IMCA-PROF-1001": { unitId: "muslim-professionals", role: "unit_director" },
  "IMCA-YOUTH-1001": { unitId: "youth-council", role: "unit_director" },
  "IMCA-ATH-1001": { unitId: "athletic-council", role: "unit_director" },
  "IMCA-WOMEN-1001": { unitId: "womens-council", role: "unit_director" },
  "IMCA-NEW-1001": { unitId: "new-muslims", role: "unit_director" },
  "IMCA-BIZ-1001": { unitId: "muslim-business", role: "unit_director" },
  "IMCA-LEGAL-1001": { unitId: "legal-clinic", role: "unit_director" },
};

export function resolveInviteCode(code: string) {
  return INVITE_CODES[code.trim().toUpperCase()] ?? null;
}

export function unitById(id: string | null | undefined) {
  if (!id) return null;
  return ORG_UNITS.find((u) => u.id === id) ?? null;
}
