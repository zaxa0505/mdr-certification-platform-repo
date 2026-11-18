"use client";

import type { RiskEvidenceReference } from "@/lib/project-store";

type Props = {
  idPrefix: string;
  label: string;
  references: RiskEvidenceReference[];
  onChange: (references: RiskEvidenceReference[]) => void;
};

function createReferenceId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `evidence-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function RiskEvidenceReferencesEditor({
  idPrefix,
  label,
  references,
  onChange,
}: Props) {
  return (
    <fieldset className="risk-evidence-editor">
      <legend>{label}</legend>
      <p>
        Add HTTP or HTTPS links to supporting records. These links will appear
        in the generated report.
      </p>
      {references.map((reference, index) => (
        <div className="risk-evidence-row" key={reference.id}>
          <div className="risk-form-field">
            <label htmlFor={`${idPrefix}-evidence-${reference.id}-label`}>
              Evidence title / reference
            </label>
            <input
              id={`${idPrefix}-evidence-${reference.id}-label`}
              type="text"
              value={reference.label}
              onChange={(event) =>
                onChange(
                  references.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, label: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder="Validation report, clinical study, test record..."
            />
          </div>
          <div className="risk-form-field">
            <label htmlFor={`${idPrefix}-evidence-${reference.id}-url`}>
              Evidence URL
            </label>
            <input
              id={`${idPrefix}-evidence-${reference.id}-url`}
              type="url"
              value={reference.url}
              onChange={(event) =>
                onChange(
                  references.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, url: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder="https://..."
            />
          </div>
          <button
            className="risk-delete-button risk-evidence-remove"
            type="button"
            onClick={() =>
              onChange(references.filter((item) => item.id !== reference.id))
            }
            aria-label={`Remove evidence reference ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="secondary-button risk-evidence-add"
        type="button"
        onClick={() =>
          onChange([
            ...references,
            { id: createReferenceId(), label: "", url: "" },
          ])
        }
      >
        + Add evidence link
      </button>
    </fieldset>
  );
}
