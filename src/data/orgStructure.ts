/**
 * IMCA Organizational Structure — One IMCA
 *
 * Hierarchy:
 * - Executive Director
 * - Department Heads
 * - Entity / Program Directors (each unit has its own director)
 */

export type DepartmentId =
  | "operations"
  | "education"
  | "socialServices"
  | "communityEngagement";

export interface OrgEntity {
  id: string;
  name: string;
  /** Each entity/program has its own director */
  hasDirector: true;
  /** Known director name when assigned; leave undefined if TBD */
  directorName?: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  head: string;
  entities: OrgEntity[];
}

export const EXECUTIVE_DIRECTOR = {
  name: "Dr Ahmed Alamine",
  title: "Executive Director",
};

export const DEPARTMENTS: Department[] = [
  {
    id: "operations",
    name: "Operations",
    head: "Muhammad Ashraff",
    entities: [
      { id: "marketing-branding", name: "Marketing and Branding", hasDirector: true },
      { id: "personnel-staff", name: "Personnel and Staff Management", hasDirector: true },
      { id: "it", name: "Information Technology (IT)", hasDirector: true },
      {
        id: "facilities",
        name: "Maintenance, Assets, and Facilities Management",
        hasDirector: true,
      },
      {
        id: "media-comms",
        name: "Media and Communications",
        hasDirector: true,
        directorName: "Gazawi",
      },
      {
        id: "events",
        name: "Events Management",
        hasDirector: true,
        // Director TBD — confirmed with leadership
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    head: "Dr Safaa Zarzour",
    entities: [
      { id: "mti", name: "MTI School of Knowledge", hasDirector: true },
      { id: "weekend-school", name: "IMCA Weekend School", hasDirector: true },
    ],
  },
  {
    id: "socialServices",
    name: "Social Services",
    head: "Dr Halima Al-Khattab",
    entities: [
      { id: "social-worker", name: "Social Worker Services", hasDirector: true },
      { id: "zakat", name: "Zakat Council", hasDirector: true },
      { id: "cemetery-funeral", name: "Cemetery and Funeral Services", hasDirector: true },
      { id: "food-pantry", name: "Food Pantry", hasDirector: true },
      { id: "crescent-clinic", name: "Crescent Clinic", hasDirector: true },
      { id: "mobile-clinic", name: "Mobile Clinic", hasDirector: true },
      { id: "compassion-circle", name: "Compassion Circle", hasDirector: true },
    ],
  },
  {
    id: "communityEngagement",
    name: "Community Engagement",
    head: "Tulib Ahmed",
    entities: [
      { id: "masjid-al-fajr", name: "Masjid Al-Fajr", hasDirector: true },
      {
        id: "muslim-professionals",
        name: "Muslim Professionals Council",
        hasDirector: true,
      },
      { id: "youth-council", name: "Youth Council", hasDirector: true },
      { id: "athletic-council", name: "Athletic Council", hasDirector: true },
      { id: "womens-council", name: "Women's Council", hasDirector: true },
      { id: "new-muslims", name: "New Muslims Council", hasDirector: true },
      { id: "muslim-business", name: "Muslim Business Council", hasDirector: true },
      { id: "legal-clinic", name: "Legal Clinic", hasDirector: true },
    ],
  },
];

export const DEPARTMENT_HEADS = [
  {
    department: "Executive",
    head: "Dr Ahmed Alamine",
    title: "Executive Director",
  },
  {
    department: "Operations",
    head: "Muhammad Ashraff",
    title: "Department Head",
  },
  {
    department: "Education",
    head: "Dr Safaa Zarzour",
    title: "Department Head",
  },
  {
    department: "Social Services",
    head: "Dr Halima Al-Khattab",
    title: "Department Head",
  },
  {
    department: "Community Engagement",
    head: "Tulib Ahmed",
    title: "Department Head",
  },
];

export const LEAD_NAME_SUGGESTIONS = [
  "Dr Ahmed Alamine",
  "Muhammad Ashraff",
  "Dr Safaa Zarzour",
  "Dr Halima Al-Khattab",
  "Tulib Ahmed",
  "Gazawi",
];

/** Flat list of all entities for dropdowns / suggestions */
export function allEntities(): { department: string; entity: string; directorName?: string }[] {
  return DEPARTMENTS.flatMap((dept) =>
    dept.entities.map((entity) => ({
      department: dept.name,
      entity: entity.name,
      directorName: entity.directorName,
    })),
  );
}
