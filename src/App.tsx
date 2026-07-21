import { useEffect, useMemo, useState } from "react";
import { AboutView } from "./components/AboutView";
import { CalendarView } from "./components/CalendarView";
import { DraftNoticeModal } from "./components/DraftNoticeModal";
import { EventManagerView } from "./components/EventManagerView";
import { GuidedInterview } from "./components/GuidedInterview";
import { IntakeHub } from "./components/IntakeHub";
import { ProposalHub } from "./components/ProposalHub";
import { ScorecardView } from "./components/ScorecardView";
import { TocView } from "./components/TocView";
import { generateScorecard, generateToc } from "./lib/generators";
import { generateProposal } from "./lib/proposalGenerator";
import {
  PROPOSAL_QUESTIONS,
  emptyProposalAnswers,
} from "./lib/proposalQuestions";
import {
  INTAKE_QUESTIONS,
  emptyAnswers,
  suggestPerspective,
} from "./lib/questions";
import { loadState, saveState } from "./lib/storage";
import type {
  AppState,
  CalendarEvent,
  EventStatus,
  Imca3Priority,
  IntakeAnswers,
  ManagedEvent,
  Perspective,
  StrategySubmission,
} from "./types";
import "./App.css";

type Tab =
  | "about"
  | "intake"
  | "scorecard"
  | "toc"
  | "proposal"
  | "events"
  | "calendar";

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [tab, setTab] = useState<Tab>("about");
  const [interviewing, setInterviewing] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [showDraftNotice, setShowDraftNotice] = useState(() => {
    try {
      return localStorage.getItem("one-imca-draft-notice-v1") !== "dismissed";
    } catch {
      return true;
    }
  });

  function dismissDraftNotice() {
    localStorage.setItem("one-imca-draft-notice-v1", "dismissed");
    setShowDraftNotice(false);
  }

  useEffect(() => {
    saveState(state);
  }, [state]);

  const selected = useMemo(
    () => state.submissions.find((s) => s.id === selectedId) ?? state.submissions[0] ?? null,
    [state.submissions, selectedId],
  );

  useEffect(() => {
    if (!selectedId && state.submissions[0]) {
      setSelectedId(state.submissions[0].id);
    }
  }, [state.submissions, selectedId]);

  useEffect(() => {
    if (!selectedProposalId && state.proposals[0]) {
      setSelectedProposalId(state.proposals[0].id);
    }
  }, [state.proposals, selectedProposalId]);

  function persist(next: AppState) {
    setState(next);
  }

  function handleIntakeComplete(raw: Record<string, string>) {
    const priority = (raw.imca3Priority as Imca3Priority) || "operations";
    const answers: IntakeAnswers = {
      ...emptyAnswers(),
      submitterName: raw.submitterName ?? "",
      submitterRole: raw.submitterRole ?? "",
      ideaTitle: raw.ideaTitle ?? "",
      ideaSummary: raw.ideaSummary ?? "",
      problemNeed: raw.problemNeed ?? "",
      beneficiaries: raw.beneficiaries ?? "",
      imca3Priority: priority,
      perspective:
        (raw.perspective as Perspective) || suggestPerspective(priority),
      activities: raw.activities ?? "",
      outputs: raw.outputs ?? "",
      outcomes: raw.outcomes ?? "",
      longTermImpact: raw.longTermImpact ?? "",
      successMetric: raw.successMetric ?? "",
      targetValue: raw.targetValue ?? "",
      timeframe: raw.timeframe ?? "",
      owner: raw.owner ?? "",
      partners: raw.partners ?? "",
      resourcesNeeded: raw.resourcesNeeded ?? "",
      assumptions: raw.assumptions ?? "",
      risks: raw.risks ?? "",
      createdAt: new Date().toISOString(),
    };

    const submission: StrategySubmission = {
      id: crypto.randomUUID(),
      answers,
      scorecard: generateScorecard(answers),
      toc: generateToc(answers),
    };

    persist({
      ...state,
      submissions: [submission, ...state.submissions],
    });
    setSelectedId(submission.id);
    setInterviewing(false);
    setTab("scorecard");
  }

  function handleProposalComplete(raw: Record<string, string>) {
    const proposal = generateProposal(raw);
    persist({
      ...state,
      proposals: [proposal, ...state.proposals],
    });
    setSelectedProposalId(proposal.id);
    setProposing(false);
  }

  function deleteSubmission(id: string) {
    const submissions = state.submissions.filter((s) => s.id !== id);
    persist({ ...state, submissions });
    if (selectedId === id) setSelectedId(submissions[0]?.id ?? null);
  }

  function deleteProposal(id: string) {
    const proposals = state.proposals.filter((p) => p.id !== id);
    persist({ ...state, proposals });
    if (selectedProposalId === id) setSelectedProposalId(proposals[0]?.id ?? null);
  }

  function addEvent(event: CalendarEvent) {
    persist({ ...state, events: [event, ...state.events] });
  }

  function updateEventStatus(id: string, status: EventStatus) {
    persist({
      ...state,
      events: state.events.map((e) => (e.id === id ? { ...e, status } : e)),
    });
  }

  function deleteEvent(id: string) {
    persist({ ...state, events: state.events.filter((e) => e.id !== id) });
  }

  function createManagedEvent(event: ManagedEvent) {
    persist({ ...state, managedEvents: [event, ...state.managedEvents] });
  }

  function updateManagedEvent(event: ManagedEvent) {
    persist({
      ...state,
      managedEvents: state.managedEvents.map((e) => (e.id === event.id ? event : e)),
    });
  }

  function deleteManagedEvent(id: string) {
    persist({
      ...state,
      managedEvents: state.managedEvents.filter((e) => e.id !== id),
    });
  }

  return (
    <div className="app-shell">
      {showDraftNotice ? <DraftNoticeModal onDismiss={dismissDraftNotice} /> : null}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">IMCA</span>
          <div>
            <strong>One IMCA</strong>
            <p>IMCA 3.0 · About · Scorecard · ToC · Proposals · Events · Calendar</p>
          </div>
        </div>
        <nav className="tabs" aria-label="Main">
          {(
            [
              ["about", "About One IMCA"],
              ["intake", "Objectives"],
              ["scorecard", "Scorecard"],
              ["toc", "Theory of Change"],
              ["proposal", "Project Proposal"],
              ["events", "Event Manager"],
              ["calendar", "IMCA Calendar"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`tab ${tab === id ? "active" : ""}`}
              onClick={() => {
                setTab(id);
                if (id === "intake") setInterviewing(false);
                if (id === "proposal") setProposing(false);
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {tab === "about" ? (
          <AboutView onGoToObjectives={() => setTab("intake")} />
        ) : null}

        {tab === "intake" ? (
          interviewing ? (
            <GuidedInterview
              title="Capture an objective or idea"
              subtitle="I will ask for the details required to draft both a Balanced Scorecard and a Theory of Change."
              questions={INTAKE_QUESTIONS}
              initial={emptyAnswers() as unknown as Record<string, string>}
              onCancel={() => setInterviewing(false)}
              onComplete={handleIntakeComplete}
            />
          ) : (
            <IntakeHub
              submissions={state.submissions}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
              onDelete={deleteSubmission}
              onStartNew={() => setInterviewing(true)}
            />
          )
        ) : null}

        {tab === "scorecard" ? (
          selected ? (
            <ScorecardView submission={selected} />
          ) : (
            <div className="panel empty">
              <h3>No scorecard yet</h3>
              <p>Complete a guided intake under Objectives first.</p>
              <button type="button" className="btn primary" onClick={() => setTab("intake")}>
                Go to Objectives
              </button>
            </div>
          )
        ) : null}

        {tab === "toc" ? (
          selected ? (
            <TocView submission={selected} />
          ) : (
            <div className="panel empty">
              <h3>No Theory of Change yet</h3>
              <p>Complete a guided intake under Objectives first.</p>
              <button type="button" className="btn primary" onClick={() => setTab("intake")}>
                Go to Objectives
              </button>
            </div>
          )
        ) : null}

        {tab === "proposal" ? (
          proposing ? (
            <GuidedInterview
              title="Build an IMCA project proposal"
              subtitle="Modeled on GR-F-07. Use suggested answers, then edit so the proposal matches your project."
              questions={PROPOSAL_QUESTIONS}
              initial={emptyProposalAnswers()}
              completeLabel="Generate proposal"
              onCancel={() => setProposing(false)}
              onComplete={handleProposalComplete}
            />
          ) : (
            <ProposalHub
              proposals={state.proposals}
              selectedId={selectedProposalId}
              onSelect={setSelectedProposalId}
              onDelete={deleteProposal}
              onStartNew={() => setProposing(true)}
            />
          )
        ) : null}

        {tab === "events" ? (
          <EventManagerView
            events={state.managedEvents}
            onCreate={createManagedEvent}
            onUpdate={updateManagedEvent}
            onDelete={deleteManagedEvent}
          />
        ) : null}

        {tab === "calendar" ? (
          <CalendarView
            events={state.events}
            onAdd={addEvent}
            onUpdateStatus={updateEventStatus}
            onDelete={deleteEvent}
          />
        ) : null}
      </main>

      <footer className="footer">
        Indianapolis Muslim Community Association · One IMCA · Local draft data stored in this
        browser · Ready for GitHub iteration
      </footer>
    </div>
  );
}

export default App;
