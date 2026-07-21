import type {
  ChecklistPhase,
  ChecklistTask,
  EventLeadRole,
  EventLeads,
} from "../types";

export const EVENT_CATEGORIES = [
  "Community",
  "Fundraising",
  "Religious",
  "Youth/Educational",
  "Social",
] as const;

export const LEAD_ROLES: { id: EventLeadRole; label: string }[] = [
  { id: "overall", label: "Overall Event Lead / Director" },
  { id: "program", label: "Program & Speakers Lead" },
  { id: "logistics", label: "Logistics & Venue Lead" },
  { id: "marketing", label: "Marketing & Communications Lead" },
  { id: "protocol", label: "Protocol & VIP / Guest Management Lead" },
  { id: "volunteers", label: "Volunteers Lead" },
  { id: "finance", label: "Finance & Fundraising Lead" },
];

export const PHASE_LABELS: Record<ChecklistPhase, string> = {
  pre: "Phase 1: Pre-Event (Planning & Preparation)",
  day: "Phase 2: Event Proper (Day-of Execution)",
  post: "Phase 3: Post-Event (Wrap-up & Evaluation)",
};

type TemplateItem = {
  phase: ChecklistPhase;
  section: string;
  title: string;
  defaultOwner: EventLeadRole;
};

const TEMPLATE: TemplateItem[] = [
  {
    phase: "pre",
    section: "Program & Content",
    title: "Finalize event theme, agenda, and minute-by-minute timeline.",
    defaultOwner: "program",
  },
  {
    phase: "pre",
    section: "Program & Content",
    title: "Identify and invite keynote speakers, scholars, or guest presenters.",
    defaultOwner: "program",
  },
  {
    phase: "pre",
    section: "Program & Content",
    title: "Collect speaker bios, headshots, travel itineraries, and presentation files.",
    defaultOwner: "program",
  },
  {
    phase: "pre",
    section: "Program & Content",
    title: "Confirm Emcee / MC and draft the script/cues.",
    defaultOwner: "program",
  },
  {
    phase: "pre",
    section: "Program & Content",
    title: "Plan youth/kids activities or childcare program if applicable.",
    defaultOwner: "program",
  },
  {
    phase: "pre",
    section: "Venue & Setup",
    title: "Conduct venue site inspection (layout, seating capacity, stage size).",
    defaultOwner: "logistics",
  },
  {
    phase: "pre",
    section: "Venue & Setup",
    title:
      "Confirm Prayer Area (Surau) layout, ablution facility readiness, and Qibla direction signage.",
    defaultOwner: "logistics",
  },
  {
    phase: "pre",
    section: "Venue & Setup",
    title: "Arrange Audio/Visual requirements (microphones, projectors, screens, sound system).",
    defaultOwner: "logistics",
  },
  {
    phase: "pre",
    section: "Venue & Setup",
    title: "Confirm stage setup, podium, backdrop design, and banner branding.",
    defaultOwner: "logistics",
  },
  {
    phase: "pre",
    section: "Venue & Setup",
    title: "Plan venue parking, overflow parking, and traffic flow strategy.",
    defaultOwner: "logistics",
  },
  {
    phase: "pre",
    section: "Marketing, Communications & Registration",
    title: "Setup online registration page / ticketing link.",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Marketing, Communications & Registration",
    title:
      "Design and print event collateral (flyers, social media banners, web banners, posters).",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Marketing, Communications & Registration",
    title:
      "Launch email blasts to IMCA database and post on IMCA social channels (Facebook, WhatsApp, Instagram).",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Marketing, Communications & Registration",
    title:
      "Coordinate local community outreach (flyers at Friday prayers, local partner masajid).",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Marketing, Communications & Registration",
    title: "Track RSVPs and ticket sales weekly.",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Catering, Protocol & Sponsorships",
    title: "Confirm menu and catering vendors (Halal certification, dietary options).",
    defaultOwner: "protocol",
  },
  {
    phase: "pre",
    section: "Catering, Protocol & Sponsorships",
    title:
      "Establish VIP/Guest of Honor list and issue formal invitations (community leaders, interfaith guests).",
    defaultOwner: "protocol",
  },
  {
    phase: "pre",
    section: "Catering, Protocol & Sponsorships",
    title: "Finalize seating plan, VIP table tags, and holding room arrangements.",
    defaultOwner: "protocol",
  },
  {
    phase: "pre",
    section: "Catering, Protocol & Sponsorships",
    title: "Prepare sponsorship proposal packages and approach community sponsors.",
    defaultOwner: "finance",
  },
  {
    phase: "pre",
    section: "Catering, Protocol & Sponsorships",
    title: "Collect sponsor logos for event backdrops and program booklets.",
    defaultOwner: "marketing",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title:
      "Estimate volunteer headcount needed (registration desk, ushers, setup/teardown, parking team).",
    defaultOwner: "volunteers",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title: "Schedule volunteer orientation and role briefing.",
    defaultOwner: "volunteers",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title: "Order event t-shirts, vests, or badges for staff and volunteers.",
    defaultOwner: "volunteers",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title: "Source gifts/souvenirs for speakers and major sponsors.",
    defaultOwner: "protocol",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title:
      "Procure walkie-talkies or setup dedicated WhatsApp coordination group for event leads.",
    defaultOwner: "overall",
  },
  {
    phase: "pre",
    section: "Manpower & Logistics",
    title: "Confirm first aid kit and emergency/security protocol.",
    defaultOwner: "logistics",
  },
  {
    phase: "day",
    section: "Venue & Technical Execution",
    title:
      "Early morning venue setup (stage, AV testing, mics, seating arrangement, sponsor displays).",
    defaultOwner: "logistics",
  },
  {
    phase: "day",
    section: "Venue & Technical Execution",
    title:
      "Setup Registration Desk (badge/ticket scanning, check-in sheets, name tags, program distribution).",
    defaultOwner: "volunteers",
  },
  {
    phase: "day",
    section: "Venue & Technical Execution",
    title: "Verify Prayer Area setup (mats, Qibla lines, sound feed for Adhan/Salah).",
    defaultOwner: "logistics",
  },
  {
    phase: "day",
    section: "Venue & Technical Execution",
    title: "Setup Information Desk and VIP Holding Room (refreshments, water, schedule copies).",
    defaultOwner: "protocol",
  },
  {
    phase: "day",
    section: "Operations & Flow",
    title:
      "Conduct briefing with all volunteers, ushers, and AV crew 1 hour prior to doors opening.",
    defaultOwner: "volunteers",
  },
  {
    phase: "day",
    section: "Operations & Flow",
    title: "Coordinate speaker arrival, meet-and-greet, and ushering to holding area.",
    defaultOwner: "program",
  },
  {
    phase: "day",
    section: "Operations & Flow",
    title: "Monitor minute-by-minute program execution and keep timekeepers on schedule.",
    defaultOwner: "program",
  },
  {
    phase: "day",
    section: "Operations & Flow",
    title: "Oversee catering setup, food line flow, and refreshment refills.",
    defaultOwner: "protocol",
  },
  {
    phase: "day",
    section: "Operations & Flow",
    title: "Capture high-quality media (official photographer and videographer coverage).",
    defaultOwner: "marketing",
  },
  {
    phase: "post",
    section: "Teardown & Venue Return",
    title: "Execute venue teardown, signages removal, and trash cleanup.",
    defaultOwner: "logistics",
  },
  {
    phase: "post",
    section: "Teardown & Venue Return",
    title: "Inventory and return rented equipment (sound gear, walkie-talkies, tables/chairs).",
    defaultOwner: "logistics",
  },
  {
    phase: "post",
    section: "Acknowledgments & Reporting",
    title: "Send thank-you emails/letters to speakers, sponsors, VIPs, and volunteers.",
    defaultOwner: "protocol",
  },
  {
    phase: "post",
    section: "Acknowledgments & Reporting",
    title: "Send attendee feedback/evaluation surveys via email.",
    defaultOwner: "marketing",
  },
  {
    phase: "post",
    section: "Acknowledgments & Reporting",
    title:
      "Reconcile final event budget, income (ticket sales/donations), and expense receipts with Finance.",
    defaultOwner: "finance",
  },
  {
    phase: "post",
    section: "Acknowledgments & Reporting",
    title:
      "Compile post-event summary report (attendance, survey feedback, financial summary, lessons learned).",
    defaultOwner: "overall",
  },
  {
    phase: "post",
    section: "Acknowledgments & Reporting",
    title: "Archive photos, videos, and presentation materials for future IMCA use.",
    defaultOwner: "marketing",
  },
];

export function emptyLeads(): EventLeads {
  return {
    overall: "",
    program: "",
    logistics: "",
    marketing: "",
    protocol: "",
    volunteers: "",
    finance: "",
  };
}

export function buildChecklistTasks(): ChecklistTask[] {
  return TEMPLATE.map((item, index) => ({
    id: `task-${index + 1}`,
    phase: item.phase,
    section: item.section,
    title: item.title,
    status: "not_started",
    ownerRole: item.defaultOwner,
    dueDate: "",
  }));
}

export function leadDisplayName(leads: EventLeads, role: EventLeadRole | ""): string {
  if (!role) return "Unassigned";
  const name = leads[role]?.trim();
  const label = LEAD_ROLES.find((r) => r.id === role)?.label ?? role;
  return name ? `${name} (${label})` : label;
}

export function checklistProgress(tasks: ChecklistTask[]) {
  const total = tasks.length || 1;
  const complete = tasks.filter((t) => t.status === "complete").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  return {
    total: tasks.length,
    complete,
    inProgress,
    percent: Math.round((complete / total) * 100),
  };
}
