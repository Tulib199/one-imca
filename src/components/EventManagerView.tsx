import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import {
  EVENT_CATEGORIES,
  LEAD_ROLES,
  PHASE_LABELS,
  buildChecklistTasks,
  checklistProgress,
  emptyLeads,
  leadDisplayName,
} from "../data/eventChecklist";
import type {
  ChecklistPhase,
  ChecklistTask,
  ChecklistTaskStatus,
  EventCategory,
  EventLeadRole,
  ManagedEvent,
} from "../types";

interface Props {
  events: ManagedEvent[];
  onCreate: (event: ManagedEvent) => void;
  onUpdate: (event: ManagedEvent) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: { value: ChecklistTaskStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
];

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function emptyForm() {
  return {
    title: "",
    category: "Community" as EventCategory,
    date: "",
    time: "",
    venue: "",
    targetAttendance: "",
    budget: "",
    leads: emptyLeads(),
  };
}

export function EventManagerView({ events, onCreate, onUpdate, onDelete }: Props) {
  const [mode, setMode] = useState<"list" | "create" | "detail">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");
  const [activePhase, setActivePhase] = useState<ChecklistPhase>("pre");

  const activeEvents = useMemo(
    () => events.filter((e) => !e.done).sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const completedByMonth = useMemo(() => {
    const done = events
      .filter((e) => e.done)
      .sort((a, b) => (b.completedAt || b.date).localeCompare(a.completedAt || a.date));
    const groups: { month: string; items: ManagedEvent[] }[] = [];
    for (const event of done) {
      const keyDate = event.completedAt || event.date || event.createdAt;
      let monthLabel = "Undated";
      try {
        monthLabel = format(parseISO(keyDate.slice(0, 10)), "MMMM yyyy");
      } catch {
        /* keep Undated */
      }
      const existing = groups.find((g) => g.month === monthLabel);
      if (existing) existing.items.push(event);
      else groups.push({ month: monthLabel, items: [event] });
    }
    return groups;
  }, [events]);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  function openCreate() {
    setForm(emptyForm());
    setError("");
    setMode("create");
  }

  function openDetail(id: string) {
    setSelectedId(id);
    setActivePhase("pre");
    setMode("detail");
  }

  function setLead(role: EventLeadRole, value: string) {
    setForm((prev) => ({ ...prev, leads: { ...prev.leads, [role]: value } }));
  }

  function submitCreate() {
    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!form.date) {
      setError("Event date is required.");
      return;
    }
    if (!form.leads.overall.trim()) {
      setError("Please assign an Overall Event Lead / Director.");
      return;
    }

    const event: ManagedEvent = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      time: form.time,
      venue: form.venue.trim(),
      targetAttendance: Number(form.targetAttendance) || 0,
      budget: Number(String(form.budget).replace(/[^0-9.]/g, "")) || 0,
      leads: { ...form.leads },
      tasks: buildChecklistTasks(),
      done: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    onCreate(event);
    setSelectedId(event.id);
    setMode("detail");
  }

  function patchTask(taskId: string, patch: Partial<ChecklistTask>) {
    if (!selected) return;
    const tasks = selected.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
    onUpdate({ ...selected, tasks });
  }

  function markDone() {
    if (!selected) return;
    onUpdate({
      ...selected,
      done: true,
      completedAt: new Date().toISOString(),
    });
    setMode("list");
    setSelectedId(null);
  }

  function reopen(event: ManagedEvent) {
    onUpdate({ ...event, done: false, completedAt: null });
    setSelectedId(event.id);
    setMode("detail");
  }

  if (mode === "create") {
    return (
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Event Manager</p>
            <h2>Create event & assign leads</h2>
            <p className="muted">
              Capture basics and leadership. A full IMCA phase checklist will be generated
              automatically.
            </p>
          </div>
          <button type="button" className="btn ghost" onClick={() => setMode("list")}>
            Cancel
          </button>
        </div>

        <div className="em-form">
          <h3>1. Event basic info</h3>
          <div className="em-grid">
            <label className="em-field span-2">
              <span>Event Title</span>
              <input
                value={form.title}
                placeholder="e.g., Annual Fundraising Gala, Eid Festival, Youth Conference"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="em-field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as EventCategory })
                }
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="em-field">
              <span>Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <label className="em-field">
              <span>Time</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </label>
            <label className="em-field span-2">
              <span>Venue / Location</span>
              <input
                value={form.venue}
                placeholder="e.g., IMCA Main Center, Local Banquet Hall, Outdoor Park"
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </label>
            <label className="em-field">
              <span>Target Attendance (Pax)</span>
              <input
                type="number"
                min={0}
                value={form.targetAttendance}
                placeholder="e.g., 250"
                onChange={(e) => setForm({ ...form, targetAttendance: e.target.value })}
              />
            </label>
            <label className="em-field">
              <span>Event Budget ($)</span>
              <input
                value={form.budget}
                placeholder="e.g., 15000"
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </label>
          </div>

          <h3>2. Team & leadership assignment</h3>
          <div className="em-grid">
            {LEAD_ROLES.map((role) => (
              <label key={role.id} className="em-field span-2">
                <span>{role.label}</span>
                <input
                  value={form.leads[role.id]}
                  placeholder="Full name"
                  onChange={(e) => setLead(role.id, e.target.value)}
                />
              </label>
            ))}
          </div>

          {error ? <p className="error">{error}</p> : null}

          <div className="guide-actions">
            <div className="spacer" />
            <button type="button" className="btn primary" onClick={submitCreate}>
              Create event & open checklist
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "detail" && selected) {
    const progress = checklistProgress(selected.tasks);
    const phaseTasks = selected.tasks.filter((t) => t.phase === activePhase);
    const sections = [...new Set(phaseTasks.map((t) => t.section))];

    return (
      <div className="em-detail">
        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{selected.category}</p>
              <h2>{selected.title}</h2>
              <p className="muted">
                {selected.date || "Date TBD"}
                {selected.time ? ` · ${selected.time}` : ""}
                {selected.venue ? ` · ${selected.venue}` : ""}
                {" · "}
                Target {selected.targetAttendance || "—"} pax
                {" · "}
                Budget {money(selected.budget)}
              </p>
            </div>
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setMode("list")}>
                Back to list
              </button>
              {!selected.done ? (
                <button type="button" className="btn primary" onClick={markDone}>
                  Mark event done
                </button>
              ) : (
                <button type="button" className="btn ghost" onClick={() => reopen(selected)}>
                  Reopen event
                </button>
              )}
            </div>
          </div>

          <div className="em-progress">
            <div className="progress-bar">
              <span style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="muted small">
              Checklist: {progress.complete}/{progress.total} complete ({progress.percent}%)
              {progress.inProgress ? ` · ${progress.inProgress} in progress` : ""}
            </p>
          </div>

          <div className="em-leads-strip">
            {LEAD_ROLES.map((role) => (
              <div key={role.id} className="em-lead-chip">
                <strong>{role.label.replace(" Lead", "").replace(" / Director", "")}</strong>
                <span>{selected.leads[role.id] || "Unassigned"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">IMCA Event Checklist</p>
              <h2>Phase-based task manager</h2>
            </div>
          </div>

          <div className="em-phase-tabs">
            {(Object.keys(PHASE_LABELS) as ChecklistPhase[]).map((phase) => {
              const count = selected.tasks.filter((t) => t.phase === phase).length;
              const done = selected.tasks.filter(
                (t) => t.phase === phase && t.status === "complete",
              ).length;
              return (
                <button
                  key={phase}
                  type="button"
                  className={`em-phase-tab ${activePhase === phase ? "active" : ""}`}
                  onClick={() => setActivePhase(phase)}
                >
                  {PHASE_LABELS[phase]}
                  <span>
                    {done}/{count}
                  </span>
                </button>
              );
            })}
          </div>

          {sections.map((section) => (
            <div key={section} className="em-section">
              <h3>{section}</h3>
              <div className="em-tasks">
                {phaseTasks
                  .filter((t) => t.section === section)
                  .map((task) => (
                    <div key={task.id} className={`em-task ${task.status}`}>
                      <p className="em-task-title">{task.title}</p>
                      <div className="em-task-controls">
                        <label>
                          <span>Status</span>
                          <select
                            value={task.status}
                            onChange={(e) =>
                              patchTask(task.id, {
                                status: e.target.value as ChecklistTaskStatus,
                              })
                            }
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Assigned Lead</span>
                          <select
                            value={task.ownerRole}
                            onChange={(e) =>
                              patchTask(task.id, {
                                ownerRole: e.target.value as EventLeadRole | "",
                              })
                            }
                          >
                            <option value="">Unassigned</option>
                            {LEAD_ROLES.map((role) => (
                              <option key={role.id} value={role.id}>
                                {leadDisplayName(selected.leads, role.id)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>Due Date</span>
                          <input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => patchTask(task.id, { dueDate: e.target.value })}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="em-layout">
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Event Manager</p>
            <h2>Active events</h2>
            <p className="muted">
              Create an event, assign leads, and work the Pre-Event → Day-of → Post-Event
              checklist.
            </p>
          </div>
          <button type="button" className="btn primary" onClick={openCreate}>
            Create event
          </button>
        </div>

        {activeEvents.length === 0 ? (
          <div className="empty">
            <h3>No active events</h3>
            <p>Create your first IMCA event to generate the phase checklist.</p>
          </div>
        ) : (
          <div className="list">
            {activeEvents.map((event) => {
              const progress = checklistProgress(event.tasks);
              return (
                <button
                  key={event.id}
                  type="button"
                  className="list-item"
                  onClick={() => openDetail(event.id)}
                >
                  <div>
                    <strong>{event.title}</strong>
                    <p className="muted small">
                      {event.category} · {event.date || "Date TBD"}
                      {event.time ? ` ${event.time}` : ""} · Lead:{" "}
                      {event.leads.overall || "Unassigned"} · {progress.percent}% checklist
                    </p>
                  </div>
                  <span
                    className="linkish"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event.id);
                    }}
                  >
                    Delete
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Archive</p>
            <h2>Finished events</h2>
            <p className="muted">Marked-done events appear here under month labels.</p>
          </div>
        </div>

        {completedByMonth.length === 0 ? (
          <div className="empty compact">
            <p>No finished events yet. Mark an event done when wrap-up is complete.</p>
          </div>
        ) : (
          <div className="em-archive">
            {completedByMonth.map((group) => (
              <div key={group.month} className="em-month-group">
                <h3>{group.month}</h3>
                <div className="list">
                  {group.items.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      className="list-item"
                      onClick={() => openDetail(event.id)}
                    >
                      <div>
                        <strong>{event.title}</strong>
                        <p className="muted small">
                          {event.category} · Event date {event.date || "—"} ·{" "}
                          {event.venue || "Venue TBD"}
                        </p>
                      </div>
                      <span className="status-badge confirmed">Done</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
