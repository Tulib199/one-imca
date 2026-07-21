import { EVENT_TYPES, IMCA3_PRIORITIES, PERSPECTIVES } from "../data/imca30";
import type { IntakeAnswers, Imca3Priority, Perspective } from "../types";

export type FieldType = "text" | "textarea" | "select";

export interface GuideQuestion {
  id: string;
  prompt: string;
  help: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Clickable answer ideas — inserted into the field when selected */
  suggestions?: string[];
}

export const INTAKE_QUESTIONS: GuideQuestion[] = [
  {
    id: "submitterName",
    prompt: "Assalamu alaikum — who is submitting this idea?",
    help: "Use your full name so the Board and ED know whom to follow up with.",
    type: "text",
    placeholder: "e.g., Fatima Rahman",
    required: true,
  },
  {
    id: "submitterRole",
    prompt: "What is your role at IMCA?",
    help: "Examples: Youth Council, Board member, staff, volunteer lead, school teacher.",
    type: "text",
    placeholder: "e.g., Youth Council member",
    required: true,
  },
  {
    id: "ideaTitle",
    prompt: "What should we call this objective or idea?",
    help: "Keep it short and action-oriented — it will become a strategic goal title.",
    type: "text",
    placeholder: "e.g., Launch monthly donor stewardship calls",
    required: true,
  },
  {
    id: "ideaSummary",
    prompt: "In 2–3 sentences, describe the idea.",
    help: "This becomes the starting definition for the Balanced Scorecard goal.",
    type: "textarea",
    placeholder: "Describe what you want to do and why it matters…",
    required: true,
  },
  {
    id: "problemNeed",
    prompt: "What community or organizational problem does this address?",
    help: "Theory of Change starts with the need — be specific about the gap.",
    type: "textarea",
    placeholder: "e.g., Major donors are not systematically thanked or updated…",
    required: true,
  },
  {
    id: "beneficiaries",
    prompt: "Who benefits if this succeeds?",
    help: "Name people/groups: congregants, youth, donors, staff, partners, etc.",
    type: "textarea",
    placeholder: "e.g., Current and prospective major donors; Development team",
    required: true,
  },
  {
    id: "imca3Priority",
    prompt: "Which IMCA 3.0 priority does this best support?",
    help: "Pick the closest Board-adopted pillar (Resolution 1-2026).",
    type: "select",
    options: IMCA3_PRIORITIES.map((p) => ({
      value: p.id,
      label: `${p.number}. ${p.label}`,
    })),
    required: true,
  },
  {
    id: "perspective",
    prompt: "Which Balanced Scorecard perspective fits best?",
    help: "Community outcomes → Customer. Systems/process → Internal. People/skills → Learning. Money/endowment → Financial.",
    type: "select",
    options: PERSPECTIVES.map((p) => ({
      value: p.id,
      label: `${p.label} (${p.weight}) — ${p.description}`,
    })),
    required: true,
  },
  {
    id: "activities",
    prompt: "What activities will you carry out? (list them)",
    help: "ToC 'activities' — actions you control. Separate with new lines or semicolons.",
    type: "textarea",
    placeholder: "Train volunteers\nBuild call list\nSchedule monthly outreach",
    required: true,
  },
  {
    id: "outputs",
    prompt: "What tangible outputs will those activities produce?",
    help: "Outputs are deliverables you can count (trainings held, materials published, meetings completed).",
    type: "textarea",
    placeholder: "12 stewardship calls/month\nDonor update one-pager",
    required: true,
  },
  {
    id: "outcomes",
    prompt: "What changes will happen for people if outputs are delivered?",
    help: "Outcomes are changes in behavior, knowledge, trust, or capacity — not just activity counts.",
    type: "textarea",
    placeholder: "Higher donor retention; stronger trust; more recurring gifts",
    required: true,
  },
  {
    id: "longTermImpact",
    prompt: "What long-term impact should this contribute to for IMCA?",
    help: "Link to sustainability, unity, spiritual vitality, or institutional excellence.",
    type: "textarea",
    placeholder: "A durable culture of stewardship that funds IMCA’s long-term mission",
    required: true,
  },
  {
    id: "successMetric",
    prompt: "What is the #1 success metric (KPI) you would track?",
    help: "Prefer % change, $, or counts. This becomes the primary Balanced Scorecard KPI.",
    type: "text",
    placeholder: "e.g., % major-donor retention year over year",
    required: true,
  },
  {
    id: "targetValue",
    prompt: "What target should that metric hit?",
    help: "Be concrete when possible (e.g., 90%, $50,000, 25 youth leaders).",
    type: "text",
    placeholder: "e.g., 90% retention by Dec 2027",
    required: true,
  },
  {
    id: "timeframe",
    prompt: "Over what timeframe should results be measured?",
    help: "This sets KPI periodicity (quarterly, biannual, annual).",
    type: "text",
    placeholder: "e.g., Quarterly for 18 months",
    required: true,
  },
  {
    id: "owner",
    prompt: "Who should own delivery of this goal/KPI?",
    help: "Name a role or person accountable for results.",
    type: "text",
    placeholder: "e.g., Development Coordinator",
    required: true,
  },
  {
    id: "partners",
    prompt: "Which partners or IMCA entities should be involved?",
    help: "Optional but helpful for ToC inputs and Internal Processes partnerships.",
    type: "textarea",
    placeholder: "e.g., Board Development Committee; Masjid communications",
  },
  {
    id: "resourcesNeeded",
    prompt: "What resources are needed (people, budget, tools, space)?",
    help: "Feeds ToC inputs and later Board resource planning.",
    type: "textarea",
    placeholder: "CRM access, 5 hrs/week volunteer time, $500 print budget",
  },
  {
    id: "assumptions",
    prompt: "What assumptions must hold true for this pathway to work?",
    help: "Theory of Change assumptions — conditions outside the project that need to remain true.",
    type: "textarea",
    placeholder: "Donors are reachable; leadership supports outreach cadence",
  },
  {
    id: "risks",
    prompt: "What risks could block success, and any early mitigation ideas?",
    help: "These populate the ToC risk list and inform Board risk reporting.",
    type: "textarea",
    placeholder: "Volunteer burnout — mitigate with shared call calendar",
  },
];

export function emptyAnswers(): IntakeAnswers {
  return {
    submitterName: "",
    submitterRole: "",
    ideaTitle: "",
    ideaSummary: "",
    problemNeed: "",
    beneficiaries: "",
    imca3Priority: "operations",
    perspective: "customer",
    activities: "",
    outputs: "",
    outcomes: "",
    longTermImpact: "",
    successMetric: "",
    targetValue: "",
    timeframe: "",
    owner: "",
    partners: "",
    resourcesNeeded: "",
    assumptions: "",
    risks: "",
    createdAt: new Date().toISOString(),
  };
}

export function suggestPerspective(priority: Imca3Priority): Perspective {
  switch (priority) {
    case "branding":
      return "customer";
    case "finance":
    case "assets":
      return "financial";
    case "humanCapital":
      return "learning";
    default:
      return "internal";
  }
}

export interface EventDraft {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  audience: string;
  eventType: string;
  status: "confirmed" | "tentative";
  notes: string;
}

export const EVENT_QUESTIONS: GuideQuestion[] = [
  {
    id: "title",
    prompt: "What is the event name?",
    help: "Use a clear title people will recognize on the IMCA calendar.",
    type: "text",
    placeholder: "e.g., Ramadan Iftar — Community Night",
    required: true,
  },
  {
    id: "eventType",
    prompt: "What type of event is this?",
    help: "Helps filter and report across religious, educational, and operational calendars.",
    type: "select",
    options: EVENT_TYPES.map((t) => ({ value: t, label: t })),
    required: true,
  },
  {
    id: "description",
    prompt: "Briefly describe the event purpose and agenda.",
    help: "One short paragraph is enough for the calendar listing.",
    type: "textarea",
    placeholder: "Community iftar with short talk and youth program…",
    required: true,
  },
  {
    id: "startDate",
    prompt: "What is the start date?",
    help: "Use the calendar date of the event (or first day if multi-day).",
    type: "text",
    placeholder: "YYYY-MM-DD",
    required: true,
  },
  {
    id: "endDate",
    prompt: "What is the end date?",
    help: "Same as start date for single-day events.",
    type: "text",
    placeholder: "YYYY-MM-DD",
    required: true,
  },
  {
    id: "startTime",
    prompt: "Start time? (optional for all-day)",
    help: "24-hour or am/pm style is fine — be consistent when possible.",
    type: "text",
    placeholder: "e.g., 6:30 PM",
  },
  {
    id: "endTime",
    prompt: "End time? (optional)",
    help: "Helps avoid room/facility conflicts.",
    type: "text",
    placeholder: "e.g., 9:00 PM",
  },
  {
    id: "location",
    prompt: "Where will it take place?",
    help: "Building, room, or off-site address.",
    type: "text",
    placeholder: "Masjid Al-Fajr — Multi-purpose hall",
    required: true,
  },
  {
    id: "organizer",
    prompt: "Who is organizing / the point of contact?",
    help: "Name and role for follow-up questions.",
    type: "text",
    placeholder: "e.g., Sisters Committee — Amina",
    required: true,
  },
  {
    id: "audience",
    prompt: "Who is invited / the primary audience?",
    help: "Families, youth, women, board, public, etc.",
    type: "text",
    placeholder: "Open to IMCA community & guests",
    required: true,
  },
  {
    id: "status",
    prompt: "Is this event Confirmed or Tentative?",
    help: "Confirmed shows green on the calendar; Tentative shows yellow until locked.",
    type: "select",
    options: [
      { value: "confirmed", label: "Confirmed (green)" },
      { value: "tentative", label: "Tentative (yellow)" },
    ],
    required: true,
  },
  {
    id: "notes",
    prompt: "Any logistics notes? (AV, food, childcare, budget)",
    help: "Optional internal notes for coordinators.",
    type: "textarea",
    placeholder: "Need 4 tables; microphone; kids corner",
  },
];

export function emptyEventDraft(): EventDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: "",
    description: "",
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    location: "",
    organizer: "",
    audience: "",
    eventType: EVENT_TYPES[0],
    status: "tentative",
    notes: "",
  };
}
