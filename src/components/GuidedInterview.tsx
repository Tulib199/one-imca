import { useMemo, useState } from "react";
import type { GuideQuestion } from "../lib/questions";

type AnswerMap = Record<string, string>;

interface Props {
  title: string;
  subtitle: string;
  questions: GuideQuestion[];
  initial: AnswerMap;
  onComplete: (answers: AnswerMap) => void;
  onCancel?: () => void;
  completeLabel?: string;
}

export function GuidedInterview({
  title,
  subtitle,
  questions,
  initial,
  onComplete,
  onCancel,
  completeLabel = "Generate frameworks",
}: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(initial);
  const [error, setError] = useState("");

  const q = questions[step];
  const progress = useMemo(
    () => Math.round(((step + 1) / questions.length) * 100),
    [step, questions.length],
  );

  function update(value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setError("");
  }

  function applySuggestion(suggestion: string) {
    if (q.type === "textarea") {
      const current = String(answers[q.id] ?? "").trim();
      update(current ? `${current}\n${suggestion}` : suggestion);
      return;
    }
    update(suggestion);
  }

  function next() {
    const value = String(answers[q.id] ?? "").trim();
    if (q.required && !value) {
      setError("Please answer this question before continuing.");
      return;
    }
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    onComplete(answers);
  }

  function back() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  const suggestions = q.suggestions ?? [];

  return (
    <div className="guide panel">
      <div className="guide-head">
        <div>
          <p className="eyebrow">Guided intake</p>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="progress-wrap" aria-label={`${progress}% complete`}>
          <div className="progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">
            Question {step + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="guide-chat">
        <div className="bubble ai">
          <strong>IMCA Guide</strong>
          <p>{q.prompt}</p>
          <p className="help">{q.help}</p>
        </div>

        {suggestions.length > 0 ? (
          <div className="suggestions">
            <p className="suggestions-label">Suggested answers — click to use (you can edit after):</p>
            <div className="suggestion-list">
              {suggestions.map((s, idx) => (
                <button
                  key={`${q.id}-sug-${idx}`}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => applySuggestion(s)}
                >
                  {s.length > 180 ? `${s.slice(0, 180)}…` : s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="bubble user">
          {q.type === "select" ? (
            <select
              value={String(answers[q.id] ?? "")}
              onChange={(e) => update(e.target.value)}
            >
              {(q.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : q.type === "textarea" ? (
            <textarea
              rows={7}
              value={String(answers[q.id] ?? "")}
              placeholder={q.placeholder}
              onChange={(e) => update(e.target.value)}
            />
          ) : q.id.toLowerCase().includes("date") ? (
            <input
              type="date"
              value={String(answers[q.id] ?? "")}
              onChange={(e) => update(e.target.value)}
            />
          ) : (
            <input
              type="text"
              value={String(answers[q.id] ?? "")}
              placeholder={q.placeholder}
              onChange={(e) => update(e.target.value)}
            />
          )}
          {error ? <p className="error">{error}</p> : null}
        </div>
      </div>

      <div className="guide-actions">
        <button type="button" className="btn ghost" onClick={back} disabled={step === 0}>
          Back
        </button>
        <div className="spacer" />
        {onCancel ? (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="button" className="btn primary" onClick={next}>
          {step === questions.length - 1 ? completeLabel : "Continue"}
        </button>
      </div>
    </div>
  );
}
