import type { Imca3Priority, Perspective } from "../types";

export const IMCA3_PRIORITIES: {
  id: Imca3Priority;
  number: number;
  label: string;
  short: string;
}[] = [
  {
    id: "assets",
    number: 1,
    label: "Asset Mapping and Resource Optimization",
    short: "Assets",
  },
  {
    id: "finance",
    number: 2,
    label: "Financial Sustainability, Endowment & Donor Stewardship",
    short: "Finance",
  },
  {
    id: "governance",
    number: 3,
    label: "Governance, Policies, and Organizational Systems",
    short: "Governance",
  },
  {
    id: "operations",
    number: 4,
    label: "Operational Excellence (Lean Six Sigma)",
    short: "Operations",
  },
  {
    id: "branding",
    number: 5,
    label: "Branding, Marketing, and Strategic Communications",
    short: "Brand",
  },
  {
    id: "infrastructure",
    number: 6,
    label: "Infrastructure and Capital Development",
    short: "Infrastructure",
  },
  {
    id: "humanCapital",
    number: 7,
    label: "Human Capital Development",
    short: "Human Capital",
  },
];

export const PERSPECTIVES: {
  id: Perspective;
  label: string;
  weight: string;
  description: string;
}[] = [
  {
    id: "customer",
    label: "Customer (Community)",
    weight: "35%",
    description: "Community impact, brand trust, and stakeholder satisfaction",
  },
  {
    id: "internal",
    label: "Internal Processes",
    weight: "30%",
    description: "Assets, governance, Lean Six Sigma, partnerships, infrastructure",
  },
  {
    id: "learning",
    label: "Learning & Growth",
    weight: "15%",
    description: "People, culture, knowledge, and digital capability",
  },
  {
    id: "financial",
    label: "Financial",
    weight: "20%",
    description: "Sustainability, endowment, donor stewardship, resource use",
  },
];

export const EVENT_TYPES = [
  "Religious / Worship",
  "Education",
  "Youth",
  "Women",
  "Social Services",
  "Fundraising",
  "Governance / Leadership",
  "Community Outreach",
  "Interfaith / Civic",
  "Training / Professional Development",
  "Facility / Operations",
  "Other",
];

export function priorityLabel(id: Imca3Priority): string {
  return IMCA3_PRIORITIES.find((p) => p.id === id)?.label ?? id;
}

export function perspectiveLabel(id: Perspective): string {
  return PERSPECTIVES.find((p) => p.id === id)?.label ?? id;
}
