import { VISIBILITY_LABELS, type UserProfile, type Visibility } from "../types/auth";

interface Props {
  visibility: Visibility;
  sharedWithUserIds: string[];
  directory: UserProfile[];
  ownerId: string;
  onChange: (visibility: Visibility, sharedWithUserIds: string[]) => void;
  disabled?: boolean;
}

export function SharePanel({
  visibility,
  sharedWithUserIds,
  directory,
  ownerId,
  onChange,
  disabled,
}: Props) {
  const others = directory.filter((u) => u.id !== ownerId);

  function toggleUser(id: string) {
    const next = sharedWithUserIds.includes(id)
      ? sharedWithUserIds.filter((x) => x !== id)
      : [...sharedWithUserIds, id];
    onChange(visibility, next);
  }

  return (
    <div className="share-panel">
      <h3>Visibility & sharing</h3>
      <p className="muted small">
        Private by default. Only you can edit or delete. Others see this only if you share or
        raise visibility.
      </p>
      <label className="em-field">
        <span>Who can view</span>
        <select
          disabled={disabled}
          value={visibility}
          onChange={(e) => onChange(e.target.value as Visibility, sharedWithUserIds)}
        >
          {(Object.keys(VISIBILITY_LABELS) as Visibility[]).map((key) => (
            <option key={key} value={key}>
              {VISIBILITY_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <div className="share-people">
        <p className="small">
          <strong>Also invite specific people</strong> (optional)
        </p>
        {others.length === 0 ? (
          <p className="muted small">No other registered users yet.</p>
        ) : (
          <div className="share-checklist">
            {others.map((u) => (
              <label key={u.id} className="share-person">
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={sharedWithUserIds.includes(u.id)}
                  onChange={() => toggleUser(u.id)}
                />
                <span>
                  {u.fullName} <span className="muted">({u.email})</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
