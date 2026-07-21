import { PROPOSAL_YEARS } from "./proposalQuestions";
import type { ProjectProposal } from "../types";

function uid(): string {
  return crypto.randomUUID();
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function splitRow(line: string): string[] {
  return line.split("|").map((p) => p.trim());
}

function parseTripleObjectives(text: string) {
  return lines(text).map((line) => {
    const [objective = "", indicator = "", target = ""] = splitRow(line);
    return { objective, indicator, target };
  });
}

function parseIssues(text: string) {
  return lines(text).map((line) => {
    const [issue = "", precondition = "", indicator = "", target = ""] = splitRow(line);
    return { issue, precondition, indicator, target };
  });
}

function parseYearMap(text: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const y of PROPOSAL_YEARS) map[y] = "";
  for (const line of lines(text)) {
    if (line.toUpperCase().startsWith("N/A")) continue;
    const [year = "", value = ""] = splitRow(line);
    const key = year.replace(/[^0-9]/g, "");
    if (key) map[key] = value.replace(/[$,]/g, "").trim() || value.trim();
  }
  return map;
}

function parsePartnerships(text: string) {
  return lines(text).map((line) => {
    const [name = "", type = "", contribution = ""] = splitRow(line);
    return { name, type, contribution };
  });
}

function parseStakeholders(text: string) {
  return lines(text).map((line) => {
    const [name = "", impact = "", influence = "", evaluation = ""] = splitRow(line);
    return { name, impact, influence, evaluation };
  });
}

function parseLogframe(text: string) {
  return lines(text).map((line) => {
    const [description = "", target = "", evidence = "", assumption = ""] = splitRow(line);
    return { description, target, evidence, assumption };
  });
}

function parseRisks(text: string) {
  return lines(text).map((line, i) => {
    const [risk = "", mitigation = ""] = splitRow(line);
    return { no: i + 1, risk, mitigation };
  });
}

function parseMilestones(text: string) {
  return lines(text).map((line) => {
    const [phase = "", no = "", milestone = "", months = ""] = splitRow(line);
    return { phase, no, milestone, months };
  });
}

function parseCosts(text: string) {
  return lines(text).map((line, i) => {
    const [activity = "", costRaw = "0"] = splitRow(line);
    const cost = Number(String(costRaw).replace(/[^0-9.]/g, "")) || 0;
    return { no: i + 1, activity, cost };
  });
}

export function generateProposal(answers: Record<string, string>): ProjectProposal {
  const activityCosts = parseCosts(answers.activityCosts ?? "");
  const totalCost = activityCosts.reduce((sum, row) => sum + row.cost, 0);

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    preparedBy: answers.preparedBy ?? "",
    projectName: answers.projectName ?? "",
    program: answers.program ?? "",
    projectStatus: answers.projectStatus ?? "New",
    cycleNumber: answers.cycleNumber ?? "",
    importance: answers.importance ?? "",
    description: answers.description ?? "",
    strategicObjectives: parseTripleObjectives(answers.strategicObjectives ?? ""),
    issuesPreconditions: parseIssues(answers.issuesPreconditions ?? ""),
    yearlyObjectives: parseYearMap(answers.yearlyObjectives ?? ""),
    yearlyBudget: parseYearMap(answers.yearlyBudget ?? ""),
    country: answers.country ?? "",
    beneficiary: answers.beneficiary ?? "",
    beneficiaryType: answers.beneficiaryType ?? "",
    targetedGroup: answers.targetedGroup ?? "",
    expectedNumber: answers.expectedNumber ?? "",
    partnerships: parsePartnerships(answers.partnerships ?? ""),
    stakeholders: parseStakeholders(answers.stakeholders ?? ""),
    logframe: {
      impact: parseLogframe(answers.logframeImpact ?? ""),
      outcomes: parseLogframe(answers.logframeOutcomes ?? ""),
      outputs: parseLogframe(answers.logframeOutputs ?? ""),
      activities: parseLogframe(answers.logframeActivities ?? ""),
    },
    risks: parseRisks(answers.risks ?? ""),
    startDate: answers.startDate ?? "",
    endDate: answers.endDate ?? "",
    milestones: parseMilestones(answers.milestones ?? ""),
    costMethod: answers.costMethod ?? "",
    costSetter: answers.costSetter ?? "",
    activityCosts,
    totalCost,
    cashFlowNotes: answers.cashFlowNotes ?? "",
  };
}
