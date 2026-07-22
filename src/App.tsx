import { useEffect, useMemo, useState } from "react";
import { AboutView } from "./components/AboutView";
import { CalendarView } from "./components/CalendarView";
import { DraftNoticeModal } from "./components/DraftNoticeModal";
import { EventManagerView } from "./components/EventManagerView";
import { GuidedInterview } from "./components/GuidedInterview";
import { IntakeHub } from "./components/IntakeHub";
import { LoginView } from "./components/LoginView";
import { ProposalHub } from "./components/ProposalHub";
import { ScorecardView } from "./components/ScorecardView";
import { SharePanel } from "./components/SharePanel";
import { TocView } from "./components/TocView";
import { AuthProvider, useAuth } from "./lib/authContext";
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
import { useUserWork } from "./lib/useUserWork";
import type {
  CalendarEvent,
  EventStatus,
  Imca3Priority,
  IntakeAnswers,
  ManagedEvent,
  Perspective,
  StrategySubmission,
} from "./types";
import type { Visibility } from "./types/auth";
import { VISIBILITY_LABELS } from "./types/auth";
import "./App.css";

type Tab =
  | "about"
  | "intake"
  | "scorecard"
  | "toc"
  | "proposal"
  | "events"
  | "calendar";

function AppShell() {
  const { user, loading, logout, unitLabel, roleLabel, directory } = useAuth();
  const work = useUserWork(user);
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

  const selected = useMemo(
    () => work.submissions.find((s) => s.id === selectedId) ?? work.submissions[0] ?? null,
    [work.submissions, selectedId],
  );

  const selectedProposal = useMemo(
    () =>
      work.proposals.find((p) => p.id === selectedProposalId) ?? work.proposals[0] ?? null,
    [work.proposals, selectedProposalId],
  );

  useEffect(() => {
    if (!selectedId && work.submissions[0]) setSelectedId(work.submissions[0].id);
  }, [work.submissions, selectedId]);

  useEffect(() => {
    if (!selectedProposalId && work.proposals[0]) {
      setSelectedProposalId(work.proposals[0].id);
    }
  }, [work.proposals, selectedProposalId]);

  if (loading) {
    return (
      <div className="auth-shell">
        <div className="panel">Loading One IMCA…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {showDraftNotice ? <DraftNoticeModal onDismiss={dismissDraftNotice} /> : null}
        <LoginView />
      </>
    );
  }

  function handleIntakeComplete(raw: Record<string, string>) {
    const priority = (raw.imca3Priority as Imca3Priority) || "operations";
    const answers: IntakeAnswers = {
      ...emptyAnswers(),
      submitterName: raw.submitterName || user!.fullName,
      submitterRole: raw.submitterRole || roleLabel,
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
      owner: raw.owner ?? user!.fullName,
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

    work.saveSubmission(submission, "private");
    setSelectedId(submission.id);
    setInterviewing(false);
    setTab("scorecard");
  }

  function handleProposalComplete(raw: Record<string, string>) {
    const proposal = generateProposal(raw);
    work.saveProposal(proposal, "private");
    setSelectedProposalId(proposal.id);
    setProposing(false);
  }

  function deleteSubmission(id: string) {
    const item = work.submissions.find((s) => s.id === id);
    if (!item?.canEdit) {
      alert("You can only delete your own work.");
      return;
    }
    work.removeWork(item.workId);
    if (selectedId === id) setSelectedId(null);
  }

  function deleteProposal(id: string) {
    const item = work.proposals.find((p) => p.id === id);
    if (!item?.canEdit) {
      alert("You can only delete your own work.");
      return;
    }
    work.removeWork(item.workId);
    if (selectedProposalId === id) setSelectedProposalId(null);
  }

  function createManagedEvent(event: ManagedEvent) {
    work.saveManagedEvent(event, undefined, "private");
  }

  function updateManagedEvent(event: ManagedEvent) {
    const existing = work.managedEvents.find((e) => e.id === event.id);
    if (!existing?.canEdit) {
      alert("You can only edit your own events.");
      return;
    }
    work.saveManagedEvent(event, existing.workId, existing.visibility);
  }

  function deleteManagedEvent(id: string) {
    const existing = work.managedEvents.find((e) => e.id === id);
    if (!existing?.canEdit) {
      alert("You can only delete your own events.");
      return;
    }
    work.removeWork(existing.workId);
  }

  function addEvent(event: CalendarEvent) {
    work.saveCalendarEvent(event, undefined, "private");
  }

  function updateEventStatus(id: string, status: EventStatus) {
    const existing = work.events.find((e) => e.id === id);
    if (!existing?.canEdit) {
      alert("You can only edit your own calendar events.");
      return;
    }
    const { workId, visibility, sharedWithUserIds, ownerId, ownerName, canEdit, ...event } =
      existing;
    void sharedWithUserIds;
    void ownerId;
    void ownerName;
    void canEdit;
    work.saveCalendarEvent({ ...event, status }, workId, visibility);
  }

  function deleteEvent(id: string) {
    const existing = work.events.find((e) => e.id === id);
    if (!existing?.canEdit) {
      alert("You can only delete your own calendar events.");
      return;
    }
    work.removeWork(existing.workId);
  }

  function shareSelectedSubmission(visibility: Visibility, sharedWithUserIds: string[]) {
    if (!selected?.canEdit) return;
    work.shareWork(selected.workId, visibility, sharedWithUserIds);
  }

  return (
    <div className="app-shell">
      {showDraftNotice ? <DraftNoticeModal onDismiss={dismissDraftNotice} /> : null}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">IMCA</span>
          <div>
            <strong>One IMCA</strong>
            <p>IMCA 3.0 · Private drafts · Shared by owner</p>
          </div>
        </div>
        <div className="account-chip">
          <div>
            <strong>{user.fullName}</strong>
            <p className="muted small">
              {roleLabel} · {unitLabel}
            </p>
          </div>
          <button type="button" className="btn ghost small" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <nav className="tabs tabs-bar" aria-label="Main">
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

      <main className="main">
        {tab === "about" ? (
          <AboutView onGoToObjectives={() => setTab("intake")} />
        ) : null}

        {tab === "intake" ? (
          interviewing ? (
            <GuidedInterview
              title="Capture an objective or idea"
              subtitle="Saved privately to your account. Share later only if you choose."
              questions={INTAKE_QUESTIONS}
              initial={{
                ...(emptyAnswers() as unknown as Record<string, string>),
                submitterName: user.fullName,
                submitterRole: roleLabel,
              }}
              onCancel={() => setInterviewing(false)}
              onComplete={handleIntakeComplete}
            />
          ) : (
            <IntakeHub
              submissions={work.submissions}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
              onDelete={deleteSubmission}
              onStartNew={() => setInterviewing(true)}
            />
          )
        ) : null}

        {tab === "scorecard" ? (
          selected ? (
            <div className="stack-panels">
              <div className="ownership-banner">
                <span>
                  Owner: <strong>{selected.ownerName}</strong> ·{" "}
                  {VISIBILITY_LABELS[selected.visibility]}
                  {!selected.canEdit ? " · View only" : ""}
                </span>
              </div>
              <ScorecardView submission={selected} />
              {selected.canEdit ? (
                <div className="panel">
                  <SharePanel
                    visibility={selected.visibility}
                    sharedWithUserIds={selected.sharedWithUserIds}
                    directory={directory}
                    ownerId={selected.ownerId}
                    onChange={shareSelectedSubmission}
                  />
                </div>
              ) : null}
            </div>
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
            <div className="stack-panels">
              <div className="ownership-banner">
                <span>
                  Owner: <strong>{selected.ownerName}</strong> ·{" "}
                  {VISIBILITY_LABELS[selected.visibility]}
                  {!selected.canEdit ? " · View only" : ""}
                </span>
              </div>
              <TocView submission={selected} />
              {selected.canEdit ? (
                <div className="panel">
                  <SharePanel
                    visibility={selected.visibility}
                    sharedWithUserIds={selected.sharedWithUserIds}
                    directory={directory}
                    ownerId={selected.ownerId}
                    onChange={shareSelectedSubmission}
                  />
                </div>
              ) : null}
            </div>
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
              subtitle="Saved privately to your account until you share it."
              questions={PROPOSAL_QUESTIONS}
              initial={emptyProposalAnswers()}
              completeLabel="Generate proposal"
              onCancel={() => setProposing(false)}
              onComplete={handleProposalComplete}
            />
          ) : (
            <ProposalHub
              proposals={work.proposals}
              selectedId={selectedProposal?.id ?? null}
              onSelect={setSelectedProposalId}
              onDelete={deleteProposal}
              onStartNew={() => setProposing(true)}
            />
          )
        ) : null}

        {tab === "events" ? (
          <EventManagerView
            events={work.managedEvents}
            onCreate={createManagedEvent}
            onUpdate={updateManagedEvent}
            onDelete={deleteManagedEvent}
          />
        ) : null}

        {tab === "calendar" ? (
          <CalendarView
            events={work.events}
            onAdd={addEvent}
            onUpdateStatus={updateEventStatus}
            onDelete={deleteEvent}
          />
        ) : null}
      </main>

      <footer className="footer">
        Signed in as {user.email} · Work is private by default · Only owners can delete their
        drafts
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
