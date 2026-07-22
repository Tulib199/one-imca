import { perspectiveLabel, priorityLabel } from "../data/imca30";
import type {
  BalancedScorecard,
  BscGoal,
  BscKpi,
  IntakeAnswers,
  Perspective,
  TocPathway,
} from "../types";

function uid(): string {
  return crypto.randomUUID();
}

function splitList(text: string): string[] {
  return text
    .split(/[\n;•]+/)
    .map((s) => s.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function perspectiveCode(p: Perspective): string {
  switch (p) {
    case "customer":
      return "C";
    case "internal":
      return "P";
    case "learning":
      return "LG";
    case "financial":
      return "F";
  }
}

function periodFromTimeframe(timeframe: string): string {
  const t = timeframe.toLowerCase();
  if (t.includes("week")) return "Weekly";
  if (t.includes("month") || t.includes("quarter")) return "Quarterly";
  if (t.includes("year") || t.includes("annual")) return "Annual";
  return "Biannual";
}

function inferUnit(metric: string): string {
  const m = metric.toLowerCase();
  if (m.includes("%") || m.includes("percent") || m.includes("rate")) return "%";
  if (m.includes("$") || m.includes("dollar") || m.includes("fund") || m.includes("revenue"))
    return "$";
  if (m.includes("#") || m.includes("number") || m.includes("count") || m.includes("how many"))
    return "#";
  return "% / #";
}

export function generateScorecard(answers: IntakeAnswers): BalancedScorecard {
  const prefix = perspectiveCode(answers.perspective);
  const goalCode = `${prefix}1`;
  const goal: BscGoal = {
    code: goalCode,
    perspective: answers.perspective,
    title: answers.ideaTitle.trim(),
    definition: `${answers.ideaSummary.trim()} This goal advances IMCA 3.0 Priority: ${priorityLabel(answers.imca3Priority)}. It addresses: ${answers.problemNeed.trim()}`,
    imca3Priority: answers.imca3Priority,
    weightHint: "Set relative weight within the perspective during leadership scorecard calibration.",
  };

  const period = periodFromTimeframe(answers.timeframe);
  const unit = inferUnit(answers.successMetric);
  const baseKpi: BscKpi = {
    code: `${goalCode}.1`,
    goalCode,
    name: answers.successMetric.trim() || `% Progress on ${answers.ideaTitle}`,
    definition: `Measures progress on "${answers.ideaTitle}" for beneficiaries (${answers.beneficiaries}). Outcome focus: ${answers.outcomes}`,
    unit,
    polarity: "Positive",
    period,
    equation:
      unit === "%"
        ? "Achieved / Target × 100"
        : unit === "$"
          ? "Actual value achieved vs. planned target"
          : "Count of achieved items / planned items (or absolute count vs. target)",
    target: answers.targetValue.trim() || "To be set with ED / leadership",
    owner: answers.owner.trim() || answers.submitterName.trim() || "TBD",
    weightHint: "100% of this goal until additional KPIs are added",
  };

  const outputKpi: BscKpi = {
    code: `${goalCode}.2`,
    goalCode,
    name: `% / # Completion of planned activities & outputs`,
    definition: `Tracks delivery of activities (${answers.activities}) and outputs (${answers.outputs}).`,
    unit: "%",
    polarity: "Positive",
    period: "Quarterly",
    equation: "Completed planned milestones / Total planned milestones × 100",
    target: "≥ 80% of planned milestones each quarter",
    owner: answers.owner.trim() || "Program lead",
    weightHint: "Supporting KPI",
  };

  const narrative = [
    `Balanced Scorecard draft for "${answers.ideaTitle}"`,
    ``,
    `Perspective: ${perspectiveLabel(answers.perspective)}`,
    `IMCA 3.0 Priority: ${priorityLabel(answers.imca3Priority)}`,
    `Submitted by: ${answers.submitterName} (${answers.submitterRole})`,
    ``,
    `This scorecard places the idea under the ${perspectiveLabel(answers.perspective)} perspective, with one strategic goal and two starter KPIs. Calibrate weights, baselines, and owners before leadership adoption.`,
  ].join("\n");

  return {
    id: uid(),
    sourceIdeaTitle: answers.ideaTitle,
    createdAt: new Date().toISOString(),
    goals: [goal],
    kpis: [baseKpi, outputKpi],
    narrative,
  };
}

export function generateToc(answers: IntakeAnswers): TocPathway {
  const activities = splitList(answers.activities);
  const outputs = splitList(answers.outputs);
  const outcomes = splitList(answers.outcomes);
  const assumptions = splitList(answers.assumptions);
  const risks = splitList(answers.risks);

  const inputs = [
    `People: ${answers.owner || answers.submitterName || "Project lead"}`,
    answers.partners.trim()
      ? `Partners: ${answers.partners}`
      : "Partners: to be confirmed",
    answers.resourcesNeeded.trim()
      ? `Resources: ${answers.resourcesNeeded}`
      : "Resources: budget and volunteer capacity TBD",
    `IMCA 3.0 alignment: ${priorityLabel(answers.imca3Priority)}`,
  ];

  const indicators = [
    answers.successMetric.trim() || "Primary success metric TBD",
    `Target: ${answers.targetValue.trim() || "TBD"}`,
    `Timeframe: ${answers.timeframe.trim() || "TBD"}`,
    ...outputs.slice(0, 2).map((o) => `Output check: ${o}`),
    ...outcomes.slice(0, 2).map((o) => `Outcome check: ${o}`),
  ];

  const narrative = [
    `Theory of Change for "${answers.ideaTitle}"`,
    ``,
    `IF we invest the listed inputs and carry out the activities,`,
    `THEN we will produce the outputs,`,
    `WHICH will lead to the outcomes for ${answers.beneficiaries},`,
    `ULTIMATELY contributing to: ${answers.longTermImpact || answers.ideaSummary}`,
    ``,
    `This pathway assumes enabling conditions hold and that identified risks are mitigated.`,
  ].join("\n");

  return {
    id: uid(),
    sourceIdeaTitle: answers.ideaTitle,
    createdAt: new Date().toISOString(),
    problem: answers.problemNeed,
    stakeholders: answers.beneficiaries,
    inputs,
    activities: activities.length ? activities : [answers.activities || "Activities TBD"],
    outputs: outputs.length ? outputs : [answers.outputs || "Outputs TBD"],
    outcomes: outcomes.length ? outcomes : [answers.outcomes || "Outcomes TBD"],
    impact: answers.longTermImpact || answers.ideaSummary,
    assumptions: assumptions.length
      ? assumptions
      : ["Stakeholders remain engaged", "Required resources are available"],
    risks: risks.length ? risks : ["Execution delays", "Resource constraints"],
    indicators,
    narrative,
  };
}
