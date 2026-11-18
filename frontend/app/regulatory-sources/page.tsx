"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  ProjectData,
  RegulatorySourceApplicability,
  RegulatorySourceAssessment,
  RegulatorySourceHarmonisation,
  RegulatorySourceKind,
  RegulatorySourceRecord,
  saveProject,
} from "@/lib/project-store";
import {
  getSafeSourceUrl,
  REGULATORY_SOURCE_CATALOG,
} from "@/lib/regulatory-sources";

type NewSourceForm = {
  kind: RegulatorySourceKind;
  title: string;
  reference: string;
  edition: string;
  validity: string;
  verifiedAt: string;
  scope: string;
  applicabilityGuidance: string;
  harmonisation: RegulatorySourceHarmonisation;
  harmonisationDetails: string;
  sourceUrl: string;
};

const emptyAssessment: RegulatorySourceAssessment = {
  decision: "to-assess",
  rationale: "",
  evidence: "",
  assessedAt: null,
};

const emptySourceForm: NewSourceForm = {
  kind: "guidance",
  title: "",
  reference: "",
  edition: "",
  validity: "",
  verifiedAt: "",
  scope: "",
  applicabilityGuidance: "",
  harmonisation: "unverified",
  harmonisationDetails: "",
  sourceUrl: "",
};

function decisionLabel(decision: RegulatorySourceApplicability) {
  if (decision === "applicable") return "Applies to this project";
  if (decision === "not-applicable") return "Not applicable";
  return "Needs assessment";
}

function verificationLabel(record: RegulatorySourceRecord) {
  switch (record.verification) {
    case "verified":
      return "Verified against listed source";
    case "partially-verified":
      return "Partially verified";
    case "user-recorded":
      return "User-recorded; not independently verified";
    default:
      return "Needs verification";
  }
}

function harmonisationLabel(record: RegulatorySourceRecord) {
  switch (record.harmonisation) {
    case "listed-in-oj":
      return "Reference listed in OJ";
    case "not-found-in-summary":
      return "Not found in Commission summary";
    case "not-applicable":
      return "Not applicable";
    default:
      return "Not verified";
  }
}

function newSourceId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function RegulatorySourcesPage() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [assessments, setAssessments] = useState<
    Record<string, RegulatorySourceAssessment>
  >({});
  const [customSources, setCustomSources] = useState<RegulatorySourceRecord[]>(
    [],
  );
  const [sourceForm, setSourceForm] = useState<NewSourceForm>(emptySourceForm);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentProject = getProject();
      setProject(currentProject);
      setAssessments(
        currentProject?.regulatorySources?.assessments ?? {},
      );
      setCustomSources(
        currentProject?.regulatorySources?.customSources ?? [],
      );
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const records = useMemo(
    () => [...REGULATORY_SOURCE_CATALOG, ...customSources],
    [customSources],
  );
  const reviewedCount = records.filter((record) => {
    const assessment = assessments[record.id];
    return (
      assessment?.decision !== undefined &&
      assessment.decision !== "to-assess" &&
      Boolean(assessment.rationale.trim()) &&
      Boolean(assessment.assessedAt)
    );
  }).length;
  const pendingVerificationCount = records.filter(
    (record) =>
      record.verification === "needs-verification" ||
      record.verification === "partially-verified",
  ).length;

  const getAssessment = (id: string) => assessments[id] ?? emptyAssessment;

  const updateAssessment = (
    id: string,
    updates: Partial<RegulatorySourceAssessment>,
  ) => {
    setAssessments((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? emptyAssessment),
        ...updates,
        assessedAt: null,
      },
    }));
    setMessage("");
  };

  const persistProject = (
    nextAssessments: Record<string, RegulatorySourceAssessment>,
    nextCustomSources: RegulatorySourceRecord[],
    successMessage: string,
  ) => {
    if (!project) {
      setMessage("Select or create a project before saving project decisions.");
      return false;
    }

    const updatedProject: ProjectData = {
      ...project,
      regulatorySources: {
        assessments: nextAssessments,
        customSources: nextCustomSources,
      },
    };

    try {
      saveProject(updatedProject);
      setProject(updatedProject);
      setAssessments(nextAssessments);
      setCustomSources(nextCustomSources);
      setMessage(successMessage);
      return true;
    } catch (error) {
      console.error("Unable to save regulatory source data.", error);
      setMessage("Unable to save these project sources. Please try again.");
      return false;
    }
  };

  const saveAssessment = (record: RegulatorySourceRecord) => {
    const current = getAssessment(record.id);
    if (
      current.decision !== "to-assess" &&
      !current.rationale.trim()
    ) {
      setMessage(
        `Add a project-specific reason before recording "${record.reference}".`,
      );
      return;
    }

    const nextAssessments = {
      ...assessments,
      [record.id]: {
        ...current,
        assessedAt: new Date().toISOString(),
      },
    };
    persistProject(
      nextAssessments,
      customSources,
      `Decision saved for ${record.reference}.`,
    );
  };

  const setFormField = <K extends keyof NewSourceForm>(
    key: K,
    value: NewSourceForm[K],
  ) => {
    setSourceForm((current) => ({ ...current, [key]: value }));
  };

  const addCustomSource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!project) {
      setMessage("Select or create a project before adding a project source.");
      return;
    }

    let url: URL;
    try {
      url = new URL(sourceForm.sourceUrl.trim());
    } catch {
      setMessage("Enter a valid source URL using https:// or http://.");
      return;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      setMessage("Source URLs must use https:// or http://.");
      return;
    }

    const source: RegulatorySourceRecord = {
      id: newSourceId(),
      kind: sourceForm.kind,
      title: sourceForm.title.trim(),
      reference: sourceForm.reference.trim(),
      edition: sourceForm.edition.trim(),
      validity: sourceForm.validity.trim(),
      verifiedAt: sourceForm.verifiedAt || null,
      verification: "user-recorded",
      harmonisation: sourceForm.harmonisation,
      harmonisationDetails:
        sourceForm.harmonisationDetails.trim() ||
        "Not independently verified by the application.",
      scope: sourceForm.scope.trim(),
      applicabilityGuidance:
        sourceForm.applicabilityGuidance.trim() ||
        "Assess against this project's intended purpose and regulatory requirements.",
      verificationNote:
        "Entered by a project user; not independently verified by the application.",
      sources: [{ label: "User-provided source", url: url.toString() }],
    };
    const nextCustomSources = [...customSources, source];
    if (
      persistProject(
        assessments,
        nextCustomSources,
        `${source.reference} added to this project.`,
      )
    ) {
      setSourceForm(emptySourceForm);
      setMessage(
        `${source.reference} added. Its metadata is user-recorded and still requires independent verification.`,
      );
    }
  };

  const removeCustomSource = (record: RegulatorySourceRecord) => {
    if (!project || !window.confirm(`Remove ${record.reference} from this project?`)) {
      return;
    }

    const nextCustomSources = customSources.filter(
      (source) => source.id !== record.id,
    );
    const nextAssessments = { ...assessments };
    delete nextAssessments[record.id];
    persistProject(
      nextAssessments,
      nextCustomSources,
      `${record.reference} removed from this project.`,
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">MDR</div>
          <div>
            <div className="brand-name">MDR Navigator</div>
            <div className="brand-subtitle">Certification Platform</div>
          </div>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          <button className="nav-item" onClick={() => router.push("/")}>
            <span>▦</span>
            Dashboard
          </button>
          <button className="nav-item" onClick={() => router.push("/project")}>
            <span>＋</span>
            Projects
          </button>
          <button
            className="nav-item"
            onClick={() => router.push("/qualification")}
          >
            <span>✓</span>
            MDR Workflow
          </button>
          <button className="nav-item" onClick={() => router.push("/documents")}>
            <span>▤</span>
            Documents
          </button>
          <button
            className="nav-item active"
            aria-current="page"
            onClick={() => router.push("/regulatory-sources")}
          >
            <span>⚖</span>
            Regulatory Sources
          </button>
          <button
            className="nav-item"
            onClick={() => router.push("/compliance-log")}
          >
            <span>◉</span>
            Compliance Log
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="assistant-card">
            <div className="assistant-title">MDR AI Assistant</div>
            <p>
              Regulatory guidance and compliance assistance for your project.
            </p>
            <button onClick={() => router.push("/assistant")}>
              Open Assistant
            </button>
          </div>
          <div className="profile">
            <div className="avatar">U</div>
            <div>
              <strong>User</strong>
              <span>Project Manager</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content regulatory-sources-page">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              {project?.name || "No active project"} / Regulatory Sources
            </div>
            <h1>Regulatory Sources</h1>
            <p className="topbar-subtitle">
              Verify reference metadata and record why each source does or does
              not apply to this device.
            </p>
          </div>
          <button
            className="secondary-button"
            onClick={() => router.push("/project")}
          >
            Select project
          </button>
        </header>

        <div className="regulatory-sources-content">
          <section className="summary-grid" aria-label="Source review status">
            <div className="summary-card">
              <div className="summary-label">ACTIVE PROJECT</div>
              <div className="summary-value regulatory-project-name">
                {project?.name || (isLoaded ? "None selected" : "Loading…")}
              </div>
              <p>{project?.manufacturer || "Manufacturer not specified"}</p>
            </div>
            <div className="summary-card">
              <div className="summary-label">PROJECT DECISIONS</div>
              <div className="summary-value">
                {reviewedCount} <span className="risk-summary-total">/ {records.length}</span>
              </div>
              <p>Decisions saved with a project-specific rationale</p>
            </div>
            <div className="summary-card">
              <div className="summary-label">METADATA TO VERIFY</div>
              <div className="summary-value">{pendingVerificationCount}</div>
              <p>Some entries are explicitly marked incomplete</p>
            </div>
            <div className="summary-card">
              <div className="summary-label">DEVICE CONTEXT</div>
              <div className="summary-value regulatory-context-value">
                {project?.classification?.class ||
                  project?.classification?.result?.classification ||
                  "Not assessed"}
              </div>
              <p>
                {project?.intendedPurpose?.intendedPurpose ||
                  "Intended purpose not recorded"}
              </p>
            </div>
          </section>

          <div className="regulatory-source-notice" role="note">
            <strong>Applicability is not automatic.</strong> Standards are
            generally voluntary; a harmonised reference can support a
            presumption of conformity only for the requirements it covers and
            when published in the Official Journal. MDCG guidance is
            non-binding. The manufacturer must assess each item against the
            device, intended purpose and applicable MDR requirements.
            <p>
              The Commission summary used here was generated on 11 November
              2026 and is for information only. OJ decisions and official
              catalogue records remain the controlling sources.
            </p>
          </div>

          {!project && isLoaded && (
            <div className="regulatory-source-empty" role="status">
              No active project is selected. You can review the catalogue, but
              project decisions cannot be saved until you select or create a
              project.
            </div>
          )}

          {message && (
            <div className="risk-module-message" role="status" aria-live="polite">
              {message}
            </div>
          )}

          <section className="regulatory-source-list" aria-label="Source catalogue">
            {records.map((record) => {
              const assessment = getAssessment(record.id);
              const isCustom = record.id.startsWith("custom-");
              return (
                <article className="regulatory-source-card" key={record.id}>
                  <div className="regulatory-source-heading">
                    <div>
                      <div className="regulatory-source-badges">
                        <span className="regulatory-source-kind">
                          {record.kind}
                        </span>
                        <span
                          className={`regulatory-source-verification ${record.verification}`}
                        >
                          {verificationLabel(record)}
                        </span>
                      </div>
                      <h2>{record.title}</h2>
                      <p className="regulatory-source-reference">
                        {record.reference} · {record.edition}
                      </p>
                    </div>
                    <span
                      className={`regulatory-source-decision ${assessment.decision}`}
                    >
                      {decisionLabel(assessment.decision)}
                    </span>
                  </div>

                  <dl className="regulatory-source-metadata">
                    <div>
                      <dt>Validity / current status</dt>
                      <dd>{record.validity}</dd>
                    </div>
                    <div>
                      <dt>Last verification</dt>
                      <dd>
                        {record.verifiedAt || "Not verified"}
                        {record.verificationNote && (
                          <span className="regulatory-source-detail">
                            {record.verificationNote}
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Harmonisation</dt>
                      <dd>
                        <strong>{harmonisationLabel(record)}</strong>
                        <span className="regulatory-source-detail">
                          {record.harmonisationDetails}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Area / scope</dt>
                      <dd>{record.scope}</dd>
                    </div>
                    <div>
                      <dt>Project-specific applicability</dt>
                      <dd>{record.applicabilityGuidance}</dd>
                    </div>
                    <div>
                      <dt>Sources</dt>
                      <dd className="regulatory-source-links">
                        {record.sources.map((source) => (
                          getSafeSourceUrl(source.url) ? (
                            <a
                              href={getSafeSourceUrl(source.url) ?? undefined}
                              key={`${record.id}-${source.url}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {source.label}
                            </a>
                          ) : (
                            <span key={`${record.id}-${source.url}`}>
                              {source.label} (invalid URL)
                            </span>
                          )
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <div className="regulatory-source-assessment">
                    <div className="regulatory-source-assessment-fields">
                      <div className="risk-form-field">
                        <label htmlFor={`decision-${record.id}`}>
                          Manufacturer&apos;s applicability decision
                        </label>
                        <select
                          id={`decision-${record.id}`}
                          value={assessment.decision}
                          disabled={!project}
                          onChange={(event) =>
                            updateAssessment(record.id, {
                              decision: event.target
                                .value as RegulatorySourceApplicability,
                            })
                          }
                        >
                          <option value="to-assess">Needs assessment</option>
                          <option value="applicable">
                            Applies to this project
                          </option>
                          <option value="not-applicable">Not applicable</option>
                        </select>
                      </div>
                      <div className="risk-form-field">
                        <label htmlFor={`rationale-${record.id}`}>
                          Reason / regulatory link
                        </label>
                        <textarea
                          id={`rationale-${record.id}`}
                          value={assessment.rationale}
                          disabled={!project}
                          placeholder="Explain how the device and MDR requirements support this decision."
                          onChange={(event) =>
                            updateAssessment(record.id, {
                              rationale: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="risk-form-field">
                        <label htmlFor={`evidence-${record.id}`}>
                          Project evidence or document reference
                        </label>
                        <input
                          id={`evidence-${record.id}`}
                          value={assessment.evidence}
                          disabled={!project}
                          placeholder="e.g. intended purpose, GSPR row, test report"
                          onChange={(event) =>
                            updateAssessment(record.id, {
                              evidence: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="regulatory-source-actions">
                      <span>
                        {assessment.assessedAt
                          ? `Saved ${new Date(assessment.assessedAt).toLocaleString()}`
                          : "Decision not saved"}
                      </span>
                      <div>
                        {isCustom && (
                          <button
                            className="secondary-button"
                            type="button"
                            onClick={() => removeCustomSource(record)}
                            disabled={!project}
                          >
                            Remove project source
                          </button>
                        )}
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => saveAssessment(record)}
                          disabled={
                            !project ||
                            !isLoaded ||
                            (assessment.decision !== "to-assess" &&
                              !assessment.rationale.trim())
                          }
                        >
                          Save decision
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <details className="regulatory-source-add">
            <summary>Add a project-specific standard or guidance document</summary>
            <p>
              Record the exact source and its metadata. New entries are marked
              user-recorded and are not independently verified by MDR Navigator.
            </p>
            <form onSubmit={addCustomSource}>
              <div className="risk-form-grid">
                <div className="risk-form-field">
                  <label htmlFor="custom-kind">Source type</label>
                  <select
                    id="custom-kind"
                    value={sourceForm.kind}
                    onChange={(event) =>
                      setFormField(
                        "kind",
                        event.target.value as RegulatorySourceKind,
                      )
                    }
                  >
                    <option value="standard">Standard</option>
                    <option value="guidance">Guidance</option>
                    <option value="legislation">Legislation</option>
                  </select>
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-title">Title</label>
                  <input
                    id="custom-title"
                    required
                    value={sourceForm.title}
                    onChange={(event) => setFormField("title", event.target.value)}
                  />
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-reference">Number / reference</label>
                  <input
                    id="custom-reference"
                    required
                    value={sourceForm.reference}
                    onChange={(event) =>
                      setFormField("reference", event.target.value)
                    }
                  />
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-edition">Edition / revision</label>
                  <input
                    id="custom-edition"
                    required
                    value={sourceForm.edition}
                    onChange={(event) => setFormField("edition", event.target.value)}
                  />
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-validity">
                    Validity or status checked
                  </label>
                  <input
                    id="custom-validity"
                    required
                    value={sourceForm.validity}
                    onChange={(event) =>
                      setFormField("validity", event.target.value)
                    }
                  />
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-verified">Verification date</label>
                  <input
                    id="custom-verified"
                    type="date"
                    value={sourceForm.verifiedAt}
                    onChange={(event) =>
                      setFormField("verifiedAt", event.target.value)
                    }
                  />
                  <small>Leave blank if the current status has not been checked.</small>
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-harmonisation">
                    Harmonisation status
                  </label>
                  <select
                    id="custom-harmonisation"
                    value={sourceForm.harmonisation}
                    onChange={(event) =>
                      setFormField(
                        "harmonisation",
                        event.target.value as RegulatorySourceHarmonisation,
                      )
                    }
                  >
                    <option value="unverified">Not verified</option>
                    <option value="listed-in-oj">Reference found in OJ</option>
                    <option value="not-found-in-summary">
                      Not found in Commission summary
                    </option>
                    <option value="not-applicable">Not applicable</option>
                  </select>
                </div>
                <div className="risk-form-field">
                  <label htmlFor="custom-harmonisation-details">
                    OJ reference or harmonisation note
                  </label>
                  <input
                    id="custom-harmonisation-details"
                    value={sourceForm.harmonisationDetails}
                    onChange={(event) =>
                      setFormField("harmonisationDetails", event.target.value)
                    }
                  />
                </div>
                <div className="risk-form-field regulatory-source-form-wide">
                  <label htmlFor="custom-scope">Area / scope of use</label>
                  <textarea
                    id="custom-scope"
                    required
                    value={sourceForm.scope}
                    onChange={(event) => setFormField("scope", event.target.value)}
                  />
                </div>
                <div className="risk-form-field regulatory-source-form-wide">
                  <label htmlFor="custom-applicability">
                    Applicability conditions for this device
                  </label>
                  <textarea
                    id="custom-applicability"
                    value={sourceForm.applicabilityGuidance}
                    onChange={(event) =>
                      setFormField("applicabilityGuidance", event.target.value)
                    }
                  />
                </div>
                <div className="risk-form-field regulatory-source-form-wide">
                  <label htmlFor="custom-source-url">Official source URL</label>
                  <input
                    id="custom-source-url"
                    type="url"
                    required
                    placeholder="https://"
                    value={sourceForm.sourceUrl}
                    onChange={(event) =>
                      setFormField("sourceUrl", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="bottom-actions">
                <button className="primary-button" type="submit" disabled={!project}>
                  Add source to project
                </button>
              </div>
            </form>
          </details>
        </div>
      </main>
    </div>
  );
}
