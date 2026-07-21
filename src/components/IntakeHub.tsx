import { perspectiveLabel, priorityLabel } from "../data/imca30";
import type { StrategySubmission } from "../types";

interface Props {
  submissions: StrategySubmission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onStartNew: () => void;
}

export function IntakeHub({
  submissions,
  selectedId,
  onSelect,
  onDelete,
  onStartNew,
}: Props) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">One IMCA</p>
          <h2>Objectives & ideas</h2>
          <p className="muted">
            Answer guiding questions. The system builds a Balanced Scorecard and Theory of
            Change draft aligned to IMCA 3.0.
          </p>
        </div>
        <button type="button" className="btn primary" onClick={onStartNew}>
          New guided intake
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="empty">
          <h3>No submissions yet</h3>
          <p>
            Start a guided intake. You will be asked the details needed for both BSC KPIs
            and a Theory of Change pathway.
          </p>
        </div>
      ) : (
        <div className="list">
          {submissions.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`list-item ${selectedId === s.id ? "active" : ""}`}
              onClick={() => onSelect(s.id)}
            >
              <div>
                <strong>{s.answers.ideaTitle}</strong>
                <p className="muted small">
                  {s.answers.submitterName} · {priorityLabel(s.answers.imca3Priority)} ·{" "}
                  {perspectiveLabel(s.answers.perspective)}
                </p>
              </div>
              <span
                className="linkish"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
              >
                Delete
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
