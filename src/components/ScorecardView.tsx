import { perspectiveLabel, priorityLabel } from "../data/imca30";
import type { StrategySubmission } from "../types";

export function ScorecardView({ submission }: { submission: StrategySubmission }) {
  const { scorecard, answers } = submission;

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Balanced Scorecard</p>
          <h2>{scorecard.sourceIdeaTitle}</h2>
          <p className="muted">
            {perspectiveLabel(answers.perspective)} · IMCA 3.0:{" "}
            {priorityLabel(answers.imca3Priority)}
          </p>
        </div>
      </div>

      <pre className="narrative">{scorecard.narrative}</pre>

      <h3>Strategic goal</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Definition</th>
              <th>Weight note</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.goals.map((g) => (
              <tr key={g.code}>
                <td>{g.code}</td>
                <td>{g.title}</td>
                <td>{g.definition}</td>
                <td>{g.weightHint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Key Performance Indicators</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>KPI</th>
              <th>Unit</th>
              <th>Period</th>
              <th>Target</th>
              <th>Owner</th>
              <th>Equation</th>
            </tr>
          </thead>
          <tbody>
            {scorecard.kpis.map((k) => (
              <tr key={k.code}>
                <td>{k.code}</td>
                <td>
                  <strong>{k.name}</strong>
                  <div className="muted small">{k.definition}</div>
                </td>
                <td>{k.unit}</td>
                <td>{k.period}</td>
                <td>{k.target}</td>
                <td>{k.owner}</td>
                <td>{k.equation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
