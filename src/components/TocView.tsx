import type { StrategySubmission } from "../types";

function Column({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "impact";
}) {
  return (
    <div className={`toc-col ${tone ?? ""}`}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function TocView({ submission }: { submission: StrategySubmission }) {
  const { toc } = submission;

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Theory of Change</p>
          <h2>{toc.sourceIdeaTitle}</h2>
          <p className="muted">
            Problem → inputs → activities → outputs → outcomes → impact
          </p>
        </div>
      </div>

      <div className="toc-block">
        <h3>Problem / need</h3>
        <p>{toc.problem}</p>
        <h3>Stakeholders / beneficiaries</h3>
        <p>{toc.stakeholders}</p>
      </div>

      <div className="toc-flow">
        <Column title="Inputs" items={toc.inputs} />
        <Column title="Activities" items={toc.activities} />
        <Column title="Outputs" items={toc.outputs} />
        <Column title="Outcomes" items={toc.outcomes} />
        <Column title="Impact" items={[toc.impact]} tone="impact" />
      </div>

      <div className="toc-grid">
        <div>
          <h3>Assumptions</h3>
          <ul>
            {toc.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Risks</h3>
          <ul>
            {toc.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Indicators</h3>
          <ul>
            {toc.indicators.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      <pre className="narrative">{toc.narrative}</pre>
    </div>
  );
}
