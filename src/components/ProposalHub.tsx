import { PROPOSAL_YEARS } from "../lib/proposalQuestions";
import type { LogframeRow, ProjectProposal } from "../types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function LogTable({
  title,
  rows,
}: {
  title: string;
  rows: LogframeRow[];
}) {
  return (
    <>
      <h3>{title}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: "18%" }}>Level</th>
              <th>Description</th>
              <th>Target</th>
              <th>Evidence</th>
              <th>Assumption</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${title}-${i}`}>
                <td>{title.replace("Logical Framework — ", "")}</td>
                <td>{r.description}</td>
                <td>{r.target}</td>
                <td>{r.evidence}</td>
                <td>{r.assumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface Props {
  proposals: ProjectProposal[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onStartNew: () => void;
}

export function ProposalHub({
  proposals,
  selectedId,
  onSelect,
  onDelete,
  onStartNew,
}: Props) {
  const selected = proposals.find((p) => p.id === selectedId) ?? proposals[0] ?? null;

  return (
    <div className="proposal-layout">
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">GR-F-07 style</p>
            <h2>Project proposals</h2>
            <p className="muted">
              Answer guided questions with suggested wording. The system drafts a full
              project proposal for ED / leadership review.
            </p>
          </div>
          <button type="button" className="btn primary" onClick={onStartNew}>
            New proposal
          </button>
        </div>

        {proposals.length === 0 ? (
          <div className="empty">
            <h3>No proposals yet</h3>
            <p>Start a guided proposal — suggestions are available on nearly every step.</p>
          </div>
        ) : (
          <div className="list">
            {proposals.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`list-item ${selected?.id === p.id ? "active" : ""}`}
                onClick={() => onSelect(p.id)}
              >
                <div>
                  <strong>{p.projectName}</strong>
                  <p className="muted small">
                    {p.program} · {p.projectStatus}
                    {p.projectStatus === "Repeated" && p.cycleNumber
                      ? ` (cycle ${p.cycleNumber})`
                      : ""}
                  </p>
                </div>
                <span
                  className="linkish"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.id);
                  }}
                >
                  Delete
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected ? <ProposalDocument proposal={selected} /> : null}
    </div>
  );
}

export function ProposalDocument({ proposal }: { proposal: ProjectProposal }) {
  return (
    <div className="panel proposal-doc">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Project Proposal</p>
          <h2>{proposal.projectName}</h2>
          <p className="muted small">
            Prepared by {proposal.preparedBy || "—"} ·{" "}
            {new Date(proposal.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          type="button"
          className="btn ghost"
          onClick={() => window.print()}
        >
          Print / Save PDF
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <tbody>
            <tr>
              <th>Project Name</th>
              <td>{proposal.projectName}</td>
            </tr>
            <tr>
              <th>Program</th>
              <td>{proposal.program}</td>
            </tr>
            <tr>
              <th>Project status</th>
              <td>
                {proposal.projectStatus}
                {proposal.projectStatus === "Repeated"
                  ? ` — current cycle: ${proposal.cycleNumber}`
                  : ""}
              </td>
            </tr>
            <tr>
              <th>Project importance</th>
              <td>{proposal.importance}</td>
            </tr>
            <tr>
              <th>Project Description</th>
              <td>{proposal.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Strategic Objectives</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Strategic Objectives</th>
              <th>Indicators</th>
              <th>Targets (Numeric)</th>
            </tr>
          </thead>
          <tbody>
            {proposal.strategicObjectives.map((r, i) => (
              <tr key={i}>
                <td>{r.objective}</td>
                <td>{r.indicator}</td>
                <td>{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Issues & Preconditions</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Issues</th>
              <th>Preconditions</th>
              <th>Precondition Indicators</th>
              <th>Targets</th>
            </tr>
          </thead>
          <tbody>
            {proposal.issuesPreconditions.map((r, i) => (
              <tr key={i}>
                <td>{r.issue}</td>
                <td>{r.precondition}</td>
                <td>{r.indicator}</td>
                <td>{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Project Objectives (multi-year)</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {PROPOSAL_YEARS.map((y) => (
                <th key={y}>Year {y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {PROPOSAL_YEARS.map((y) => (
                <td key={y}>{proposal.yearlyObjectives[y] || "—"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Budget Required</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {PROPOSAL_YEARS.map((y) => (
                <th key={y}>Year {y}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {PROPOSAL_YEARS.map((y) => (
                <td key={y}>
                  {proposal.yearlyBudget[y]
                    ? money(Number(proposal.yearlyBudget[y]) || 0)
                    : "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Beneficiaries</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Beneficiary</th>
              <th>Type</th>
              <th>Targeted Group</th>
              <th>Expected No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{proposal.country}</td>
              <td>{proposal.beneficiary}</td>
              <td>{proposal.beneficiaryType}</td>
              <td>{proposal.targetedGroup}</td>
              <td>{proposal.expectedNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Expected Partnership</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Type</th>
              <th>Target Financial Contribution</th>
            </tr>
          </thead>
          <tbody>
            {proposal.partnerships.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.contribution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Stakeholders</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Stakeholder</th>
              <th>Impact Description</th>
              <th>Influence (+/−)</th>
              <th>Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {proposal.stakeholders.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.impact}</td>
                <td>{r.influence}</td>
                <td>{r.evaluation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Logical Framework</h3>
      <LogTable title="Impact" rows={proposal.logframe.impact} />
      <LogTable title="Outcomes" rows={proposal.logframe.outcomes} />
      <LogTable title="Outputs" rows={proposal.logframe.outputs} />
      <LogTable title="Activities" rows={proposal.logframe.activities} />

      <h3>Main Project Risks</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Risks</th>
              <th>Mitigation Measures</th>
            </tr>
          </thead>
          <tbody>
            {proposal.risks.map((r) => (
              <tr key={r.no}>
                <td>{r.no}</td>
                <td>{r.risk}</td>
                <td>{r.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Project Implementation Period</h3>
      <p>
        <strong>Start:</strong> {proposal.startDate || "—"} &nbsp;·&nbsp;{" "}
        <strong>End:</strong> {proposal.endDate || "—"}
      </p>

      <h3>Project Milestones</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>No.</th>
              <th>Milestone</th>
              <th>Timing</th>
            </tr>
          </thead>
          <tbody>
            {proposal.milestones.map((m, i) => (
              <tr key={i}>
                <td>{m.phase}</td>
                <td>{m.no}</td>
                <td>{m.milestone}</td>
                <td>{m.months}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Budgeting Exercise</h3>
      <p className="muted small">
        Cost method: <strong>{proposal.costMethod}</strong> · Cost setter:{" "}
        <strong>{proposal.costSetter}</strong>
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Activities</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {proposal.activityCosts.map((r) => (
              <tr key={r.no}>
                <td>{r.no}</td>
                <td>{r.activity}</td>
                <td>{money(r.cost)}</td>
              </tr>
            ))}
            <tr>
              <th colSpan={2}>Total Cost</th>
              <th>{money(proposal.totalCost)}</th>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Projects Cash Flow / Installments</h3>
      <p>{proposal.cashFlowNotes || "—"}</p>
    </div>
  );
}
