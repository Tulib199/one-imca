import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";
import type { CalendarEvent, EventStatus } from "../types";
import { GuidedInterview } from "./GuidedInterview";
import {
  EVENT_QUESTIONS,
  emptyEventDraft,
} from "../lib/questions";

interface Props {
  events: CalendarEvent[];
  onAdd: (event: CalendarEvent) => void;
  onUpdateStatus: (id: string, status: EventStatus) => void;
  onDelete: (id: string) => void;
}

export function CalendarView({ events, onAdd, onUpdateStatus, onDelete }: Props) {
  const [cursor, setCursor] = useState(new Date());
  const [adding, setAdding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const selectedEvents = useMemo(() => {
    if (!selectedDate) {
      return [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
    return events
      .filter((e) => {
        return e.startDate <= selectedDate && e.endDate >= selectedDate;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedDate]);

  function eventsOn(day: Date) {
    const key = format(day, "yyyy-MM-dd");
    return events.filter((e) => e.startDate <= key && e.endDate >= key);
  }

  if (adding) {
    return (
      <GuidedInterview
        title="Add IMCA calendar event"
        subtitle="Answer each question so we capture logistics, audience, and confirmation status."
        questions={EVENT_QUESTIONS}
        initial={emptyEventDraft() as unknown as Record<string, string>}
        completeLabel="Save event"
        onCancel={() => setAdding(false)}
        onComplete={(draft) => {
          const event: CalendarEvent = {
            id: crypto.randomUUID(),
            title: (draft.title ?? "").trim(),
            description: (draft.description ?? "").trim(),
            startDate: draft.startDate,
            endDate: draft.endDate || draft.startDate,
            startTime: (draft.startTime ?? "").trim(),
            endTime: (draft.endTime ?? "").trim(),
            location: (draft.location ?? "").trim(),
            organizer: (draft.organizer ?? "").trim(),
            audience: (draft.audience ?? "").trim(),
            eventType: draft.eventType,
            status: draft.status === "confirmed" ? "confirmed" : "tentative",
            notes: (draft.notes ?? "").trim(),
            createdAt: new Date().toISOString(),
          };
          onAdd(event);
          setAdding(false);
          setSelectedDate(event.startDate);
        }}
      />
    );
  }

  return (
    <div className="calendar-layout">
      <div className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">IMCA Calendar</p>
            <h2>{format(cursor, "MMMM yyyy")}</h2>
            <p className="muted">
              <span className="legend confirmed">Confirmed</span>
              <span className="legend tentative">Tentative</span>
            </p>
          </div>
          <div className="row-actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setCursor((d) => addMonths(d, -1))}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setCursor(new Date())}
            >
              Today
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setCursor((d) => addMonths(d, 1))}
            >
              Next
            </button>
            <button type="button" className="btn primary" onClick={() => setAdding(true)}>
              Add event
            </button>
          </div>
        </div>

        <div className="cal-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="cal-dow">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsOn(day);
            const inMonth = isSameMonth(day, cursor);
            const selected = selectedDate === key;
            return (
              <button
                type="button"
                key={key}
                className={`cal-cell ${inMonth ? "" : "muted-month"} ${selected ? "selected" : ""} ${isSameDay(day, new Date()) ? "today" : ""}`}
                onClick={() => setSelectedDate(key)}
              >
                <span className="cal-daynum">{format(day, "d")}</span>
                <div className="cal-pills">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={`cal-pill ${e.status}`}
                      title={e.title}
                    >
                      {e.title}
                    </span>
                  ))}
                  {dayEvents.length > 3 ? (
                    <span className="cal-more">+{dayEvents.length - 3}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel side-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">
              {selectedDate
                ? format(parseISO(selectedDate), "EEEE, MMM d")
                : "All upcoming"}
            </p>
            <h2>Events</h2>
          </div>
          {selectedDate ? (
            <button
              type="button"
              className="btn ghost"
              onClick={() => setSelectedDate(null)}
            >
              Show all
            </button>
          ) : null}
        </div>

        {selectedEvents.length === 0 ? (
          <div className="empty compact">
            <p>No events for this selection. Add one to get started.</p>
          </div>
        ) : (
          <div className="event-list">
            {selectedEvents.map((e) => (
              <article key={e.id} className={`event-card ${e.status}`}>
                <div className="event-top">
                  <strong>{e.title}</strong>
                  <span className={`status-badge ${e.status}`}>{e.status}</span>
                </div>
                <p className="muted small">
                  {e.startDate}
                  {e.endDate !== e.startDate ? ` → ${e.endDate}` : ""}
                  {e.startTime ? ` · ${e.startTime}` : ""}
                  {e.endTime ? `–${e.endTime}` : ""}
                </p>
                <p className="small">{e.description}</p>
                <p className="muted small">
                  {e.eventType} · {e.location} · {e.organizer}
                </p>
                <p className="muted small">Audience: {e.audience}</p>
                {e.notes ? <p className="small">Notes: {e.notes}</p> : null}
                <div className="row-actions">
                  {e.status === "tentative" ? (
                    <button
                      type="button"
                      className="btn small primary"
                      onClick={() => onUpdateStatus(e.id, "confirmed")}
                    >
                      Mark confirmed
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => onUpdateStatus(e.id, "tentative")}
                    >
                      Mark tentative
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn small ghost"
                    onClick={() => onDelete(e.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
