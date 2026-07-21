import { DEPARTMENTS, DEPARTMENT_HEADS, EXECUTIVE_DIRECTOR } from "../data/orgStructure";
import { IMCA3_PRIORITIES } from "../data/imca30";

interface Props {
  onGoToObjectives: () => void;
}

export function AboutView({ onGoToObjectives }: Props) {
  return (
    <div className="about-layout">
      <section className="panel about-hero">
        <p className="eyebrow">Start here</p>
        <h2>What is One IMCA (IMCA 3.0)?</h2>
        <p className="about-lead">
          <strong>One IMCA</strong> is our shared name for working as one institution—not as
          separate programs that happen to share a building.{" "}
          <strong>IMCA 3.0</strong> is the Board-authorized Organizational Transformation
          Initiative (Resolution No. 1-2026) that gives us the priorities, systems, and
          tools to get there.
        </p>
        <p className="muted">
          The bigger goal: build a financially sustainable, professionally managed,
          operationally excellent, mission-driven IMCA that serves the religious,
          educational, social, and community needs of current and future generations—with
          faith at the center and youth at the forefront.
        </p>
      </section>

      <section className="panel">
        <p className="eyebrow">Why this matters for you</p>
        <h2>Why every team member should use these tools</h2>
        <div className="about-grid">
          <div className="about-card">
            <h3>Speak one language</h3>
            <p>
              Whether you serve in Operations, Education, Social Services, or Community
              Engagement, we plan and report the same way—so the Board, Executive Director,
              and department heads can support your work clearly.
            </p>
          </div>
          <div className="about-card">
            <h3>Show impact, not only activity</h3>
            <p>
              “We held many events” is not enough. These tools help you show{" "}
              <em>what changed</em> for people—and how we know.
            </p>
          </div>
          <div className="about-card">
            <h3>Make requests stronger</h3>
            <p>
              Budget, volunteers, and Board approval are easier to get when your idea has a
              clear goal, a logic pathway, and measurable targets.
            </p>
          </div>
          <div className="about-card">
            <h3>Protect the amanah</h3>
            <p>
              Donors, members, and the community trust us with resources. Planning and
              measurement are part of good stewardship (amanah) and organizational excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">IMCA 3.0</p>
        <h2>The seven strategic priorities</h2>
        <p className="muted">
          Board Resolution 1-2026 adopted these pillars as the foundation of our
          transformation. When you submit an objective, you link it to one of these.
        </p>
        <ol className="about-priority-list">
          {IMCA3_PRIORITIES.map((p) => (
            <li key={p.id}>
              <strong>
                {p.number}. {p.label}
              </strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <p className="eyebrow">How to work in One IMCA</p>
        <h2>Objectives → Theory of Change → Scorecard</h2>
        <p className="muted">
          Use these three tabs together. Start in <strong>Objectives</strong>; the system
          drafts the other two for you.
        </p>

        <div className="about-flow">
          <div className="about-flow-step">
            <span className="about-step-num">1</span>
            <div>
              <h3>Objectives</h3>
              <p>
                <strong>What it is:</strong> A guided intake where you describe your idea or
                program goal—problem, beneficiaries, activities, outcomes, metric, owner, and
                risks.
              </p>
              <p>
                <strong>Why we need it:</strong> Good ideas often arrive incomplete. This tab
                makes sure every proposal has the details leadership needs to understand,
                prioritize, and support the work.
              </p>
              <p>
                <strong>How it works:</strong> Click <em>New guided intake</em>, answer each
                question, and link your idea to an IMCA 3.0 priority. When you finish, drafts
                appear under Scorecard and Theory of Change.
              </p>
            </div>
          </div>

          <div className="about-flow-step">
            <span className="about-step-num">2</span>
            <div>
              <h3>Theory of Change (ToC)</h3>
              <p>
                <strong>What it is:</strong> The logic chain of your work:{" "}
                <em>
                  Problem → Inputs → Activities → Outputs → Outcomes → Impact
                </em>
                , plus assumptions and risks.
              </p>
              <p>
                <strong>Why we need it:</strong> It answers <em>why this should work</em>. If
                results are weak, we can see where the chain broke—and improve. It also helps
                donors and the Board see the thinking behind a request, not only a wish list.
              </p>
              <p>
                <strong>How it works:</strong> After you complete Objectives, open this tab to
                review the pathway. Refine wording with your department head before Board or
                ED review.
              </p>
            </div>
          </div>

          <div className="about-flow-step">
            <span className="about-step-num">3</span>
            <div>
              <h3>Scorecard (Balanced Scorecard)</h3>
              <p>
                <strong>What it is:</strong> A measurement draft—strategic goal plus KPIs with
                targets, owners, and how success is calculated—across Community, Internal
                Processes, Learning & Growth, and Financial perspectives.
              </p>
              <p>
                <strong>Why we need it:</strong> It answers <em>are we succeeding?</em> So we
                can report progress, compare programs fairly, and decide where to invest time
                and money.
              </p>
              <p>
                <strong>How it works:</strong> Review the auto-generated goal and KPIs, adjust
                targets with your lead, and use them in quarterly / Board reporting.
              </p>
            </div>
          </div>
        </div>

        <div className="about-analogy">
          <h3>Remember it this way</h3>
          <ul>
            <li>
              <strong>Objectives</strong> — What do we want to do?
            </li>
            <li>
              <strong>Theory of Change</strong> — Why will that create change?
            </li>
            <li>
              <strong>Scorecard</strong> — How will we measure if it worked?
            </li>
          </ul>
        </div>

        <div className="guide-actions" style={{ marginTop: "1.25rem" }}>
          <button type="button" className="btn primary" onClick={onGoToObjectives}>
            Start an objective
          </button>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">One institution</p>
        <h2>How IMCA is organized</h2>
        <p className="muted">
          {EXECUTIVE_DIRECTOR.title}: <strong>{EXECUTIVE_DIRECTOR.name}</strong>. Each
          department has a head; each council, school, clinic, and unit has its own director.
        </p>
        <div className="about-org">
          {DEPARTMENTS.map((dept) => {
            const head =
              DEPARTMENT_HEADS.find((h) => h.department === dept.name)?.head ?? dept.head;
            return (
              <div key={dept.id} className="about-org-dept">
                <h3>
                  {dept.name}
                  <span className="muted small"> · Head: {head}</span>
                </h3>
                <ul>
                  {dept.entities.map((e) => (
                    <li key={e.id}>
                      {e.name}
                      {e.directorName ? (
                        <span className="muted"> — {e.directorName}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel about-close">
        <h2>Your part in the bigger goal</h2>
        <p>
          When you use Objectives, Theory of Change, and Scorecard, you are not filling forms
          for their own sake—you are helping One IMCA plan with intention, serve with
          excellence, and prove impact for the community we are entrusted to serve.
        </p>
        <p className="muted small">
          Other tools in this workspace—Project Proposal, Event Manager, and Calendar—support
          the same transformation: clear planning, clear ownership, and clear follow-through.
        </p>
      </section>
    </div>
  );
}
