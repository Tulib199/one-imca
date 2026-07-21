interface Props {
  onDismiss: () => void;
}

export function DraftNoticeModal({ onDismiss }: Props) {
  return (
    <div className="draft-overlay" role="dialog" aria-modal="true" aria-labelledby="draft-title">
      <div className="draft-modal">
        <p className="eyebrow">Notice</p>
        <h2 id="draft-title">This is a first draft</h2>
        <p>
          Welcome to <strong>One IMCA</strong>. This workspace is an early draft of our IMCA
          3.0 planning tools. Features, wording, and workflows may change as leadership and
          teams provide feedback.
        </p>
        <p className="muted">
          Please explore, share comments with your department head or the Executive Director,
          and treat saved entries as working drafts—not final Board documents.
        </p>
        <div className="guide-actions">
          <div className="spacer" />
          <button type="button" className="btn primary" onClick={onDismiss}>
            I understand — continue
          </button>
        </div>
      </div>
    </div>
  );
}
