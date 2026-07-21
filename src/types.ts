export type Perspective =
  | "customer"
  | "internal"
  | "learning"
  | "financial";

export type Imca3Priority =
  | "assets"
  | "finance"
  | "governance"
  | "operations"
  | "branding"
  | "infrastructure"
  | "humanCapital";

export type EventStatus = "confirmed" | "tentative";

export interface IntakeAnswers {
  submitterName: string;
  submitterRole: string;
  ideaTitle: string;
  ideaSummary: string;
  problemNeed: string;
  beneficiaries: string;
  imca3Priority: Imca3Priority;
  perspective: Perspective;
  activities: string;
  outputs: string;
  outcomes: string;
  longTermImpact: string;
  successMetric: string;
  targetValue: string;
  timeframe: string;
  owner: string;
  partners: string;
  resourcesNeeded: string;
  assumptions: string;
  risks: string;
  createdAt: string;
}

export interface BscGoal {
  code: string;
  perspective: Perspective;
  title: string;
  definition: string;
  imca3Priority: Imca3Priority;
  weightHint: string;
}

export interface BscKpi {
  code: string;
  goalCode: string;
  name: string;
  definition: string;
  unit: string;
  polarity: "Positive" | "Negative";
  period: string;
  equation: string;
  target: string;
  owner: string;
  weightHint: string;
}

export interface BalancedScorecard {
  id: string;
  sourceIdeaTitle: string;
  createdAt: string;
  goals: BscGoal[];
  kpis: BscKpi[];
  narrative: string;
}

export interface TocPathway {
  id: string;
  sourceIdeaTitle: string;
  createdAt: string;
  problem: string;
  stakeholders: string;
  inputs: string[];
  activities: string[];
  outputs: string[];
  outcomes: string[];
  impact: string;
  assumptions: string[];
  risks: string[];
  indicators: string[];
  narrative: string;
}

export interface StrategySubmission {
  id: string;
  answers: IntakeAnswers;
  scorecard: BalancedScorecard;
  toc: TocPathway;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  audience: string;
  eventType: string;
  status: EventStatus;
  notes: string;
  createdAt: string;
}

export interface AppState {
  submissions: StrategySubmission[];
  events: CalendarEvent[];
  proposals: ProjectProposal[];
  managedEvents: ManagedEvent[];
}

export type EventCategory =
  | "Community"
  | "Fundraising"
  | "Religious"
  | "Youth/Educational"
  | "Social";

export type ChecklistTaskStatus = "not_started" | "in_progress" | "complete";

export type EventLeadRole =
  | "overall"
  | "program"
  | "logistics"
  | "marketing"
  | "protocol"
  | "volunteers"
  | "finance";

export type ChecklistPhase = "pre" | "day" | "post";

export interface EventLeads {
  overall: string;
  program: string;
  logistics: string;
  marketing: string;
  protocol: string;
  volunteers: string;
  finance: string;
}

export interface ChecklistTask {
  id: string;
  phase: ChecklistPhase;
  section: string;
  title: string;
  status: ChecklistTaskStatus;
  ownerRole: EventLeadRole | "";
  dueDate: string;
}

export interface ManagedEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  targetAttendance: number;
  budget: number;
  leads: EventLeads;
  tasks: ChecklistTask[];
  done: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface ProposalObjectiveRow {
  objective: string;
  indicator: string;
  target: string;
}

export interface ProposalIssueRow {
  issue: string;
  precondition: string;
  indicator: string;
  target: string;
}

export interface ProposalPartnerRow {
  name: string;
  type: string;
  contribution: string;
}

export interface ProposalStakeholderRow {
  name: string;
  impact: string;
  influence: string;
  evaluation: string;
}

export interface LogframeRow {
  description: string;
  target: string;
  evidence: string;
  assumption: string;
}

export interface ProposalRiskRow {
  no: number;
  risk: string;
  mitigation: string;
}

export interface ProposalMilestoneRow {
  phase: string;
  no: string;
  milestone: string;
  months: string;
}

export interface ProposalCostRow {
  no: number;
  activity: string;
  cost: number;
}

export interface ProjectProposal {
  id: string;
  createdAt: string;
  preparedBy: string;
  projectName: string;
  program: string;
  projectStatus: string;
  cycleNumber: string;
  importance: string;
  description: string;
  strategicObjectives: ProposalObjectiveRow[];
  issuesPreconditions: ProposalIssueRow[];
  yearlyObjectives: Record<string, string>;
  yearlyBudget: Record<string, string>;
  country: string;
  beneficiary: string;
  beneficiaryType: string;
  targetedGroup: string;
  expectedNumber: string;
  partnerships: ProposalPartnerRow[];
  stakeholders: ProposalStakeholderRow[];
  logframe: {
    impact: LogframeRow[];
    outcomes: LogframeRow[];
    outputs: LogframeRow[];
    activities: LogframeRow[];
  };
  risks: ProposalRiskRow[];
  startDate: string;
  endDate: string;
  milestones: ProposalMilestoneRow[];
  costMethod: string;
  costSetter: string;
  activityCosts: ProposalCostRow[];
  totalCost: number;
  cashFlowNotes: string;
}
