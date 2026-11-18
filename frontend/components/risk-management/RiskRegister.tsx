"use client";

import type {
  RiskAcceptanceDecision,
  RiskArtifactStatus,
  RiskControlStatus,
  RiskIdentificationAssessment,
  RiskIdentificationDecision,
  RiskIdentificationPromptId,
  RiskRecord,
} from "@/lib/project-store";
import RiskEvidenceReferencesEditor from "@/components/risk-management/RiskEvidenceReferencesEditor";
import {
  createRiskRecord,
  RISK_IDENTIFICATION_PROMPTS,
} from "@/lib/risk-management";

type Props = {
  risks: RiskRecord[];
  riskIdentification: Partial<
    Record<RiskIdentificationPromptId, RiskIdentificationAssessment>
  >;
  status: RiskArtifactStatus;
  registerApprover: string;
  registerApprovalDate: string;
  onChange: (risks: RiskRecord[]) => void;
  onApprovalChange: (approver: string, approvalDate: string) => void;
  onRiskIdentificationChange: (
    assessments: Partial<
      Record<RiskIdentificationPromptId, RiskIdentificationAssessment>
    >,
  ) => void;
  onAddRiskFromPrompt: (promptId: RiskIdentificationPromptId) => void;
  onStatusChange: (status: RiskArtifactStatus) => void;
};

const decisionOptions: Array<{
  value: RiskAcceptanceDecision;
  label: string;
}> = [
  { value: "not-assessed", label: "Not assessed" },
  { value: "acceptable", label: "Acceptable — manufacturer decision" },
  {
    value: "benefit-risk-justified",
    label: "Benefit-risk justified — manufacturer decision",
  },
  { value: "not-acceptable", label: "Not acceptable — manufacturer decision" },
  {
    value: "additional-controls-required",
    label: "Additional controls required",
  },
];

const controlStatusOptions: Array<{
  value: RiskControlStatus;
  label: string;
}> = [
  { value: "not-assessed", label: "Not assessed" },
  { value: "not-applicable", label: "Not applicable" },
  { value: "planned", label: "Planned" },
  { value: "implemented", label: "Implemented" },
  { value: "verified", label: "Verified" },
];

const textFields: Array<{
  key:
    | "hazard"
    | "foreseeableSequence"
    | "hazardousSituation"
    | "harm"
    | "residualRationale"
    | "residualUserInformation"
    | "assessor";
  label: string;
  rows: number;
}> = [
  { key: "hazard", label: "Hazard", rows: 2 },
  { key: "foreseeableSequence", label: "Foreseeable sequence of events", rows: 3 },
  { key: "hazardousSituation", label: "Hazardous situation", rows: 3 },
  { key: "harm", label: "Potential harm", rows: 2 },
  {
    key: "residualRationale",
    label: "Residual risk acceptability rationale and justification",
    rows: 3,
  },
  {
    key: "residualUserInformation",
    label: "Information to provide to the user for this residual risk",
    rows: 3,
  },
  { key: "assessor", label: "Assessor / responsible person", rows: 1 },
];

function isRiskArtifactStatus(value: string): value is RiskArtifactStatus {
  return value === "draft" || value === "in-review" || value === "approved";
}

function isRiskAcceptanceDecision(
  value: string,
): value is RiskAcceptanceDecision {
  return decisionOptions.some((option) => option.value === value);
}

function isRiskIdentificationDecision(
  value: string,
): value is RiskIdentificationDecision {
  return (
    value === "not-assessed" ||
    value === "relevant" ||
    value === "not-applicable"
  );
}

function isRiskControlStatus(value: string): value is RiskControlStatus {
  return controlStatusOptions.some((option) => option.value === value);
}

function riskControlStatusField(
  id: string,
  label: string,
  value: RiskControlStatus | undefined,
  onValue: (value: RiskControlStatus) => void,
) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value ?? "not-assessed"}
        onChange={(event) => {
          const nextValue = event.currentTarget.value;
          if (isRiskControlStatus(nextValue)) onValue(nextValue);
        }}
      >
        {controlStatusOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

function riskAssessmentInput(
  id: string,
  label: string,
  value: string | number | null,
  onValue: (value: string) => void,
  help: string,
  placeholder: string,
) {
  return (
    <div className="risk-form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value ?? ""}
        onChange={(event) => onValue(event.target.value)}
        placeholder={placeholder}
      />
      <small>{help}</small>
    </div>
  );
}

export default function RiskRegister({
  risks,
  riskIdentification,
  status,
  registerApprover,
  registerApprovalDate,
  onChange,
  onApprovalChange,
  onRiskIdentificationChange,
  onAddRiskFromPrompt,
  onStatusChange,
}: Props) {
  const updateRisk = <K extends keyof RiskRecord>(
    index: number,
    key: K,
    value: RiskRecord[K],
  ) => {
    onChange(
      risks.map((risk, riskIndex) =>
        riskIndex === index
          ? { ...risk, [key]: value, updatedAt: new Date().toISOString() }
          : risk,
      ),
    );
  };

  const updateRiskIdentification = (
    promptId: RiskIdentificationPromptId,
    assessment: RiskIdentificationAssessment,
  ) => {
    const nextAssessments = { ...riskIdentification };
    if (
      assessment.decision === "not-assessed" &&
      !assessment.rationale.trim()
    ) {
      delete nextAssessments[promptId];
    } else {
      nextAssessments[promptId] = assessment;
    }
    onRiskIdentificationChange(nextAssessments);
  };

  const artifactClass =
    status === "approved" ? "completed" : status === "in-review" ? "progress" : "pending";

  return (
    <section className="workflow-panel risk-module-panel">
      <div className="panel-header">
        <div>
          <h2>Risk Register</h2>
          <p>
            Record risk scenarios, controls and the manufacturer&apos;s residual risk
            assessment.
          </p>
        </div>
        <span className={`status-badge ${artifactClass}`}>
          {status === "in-review" ? "In review" : status}
        </span>
      </div>

      <div className="risk-register-toolbar">
        <div className="risk-review-notice">
          The manufacturer defines the estimation method, scales and
          acceptability criteria in the plan. This application does not impose
          a universal rating matrix, calculate a risk score or determine
          acceptability. Record the basis, assumptions and comparison with the
          manufacturer&apos;s criteria.
        </div>
        <div className="risk-register-actions">
          <label htmlFor="risk-register-status">Document status</label>
          <select
            id="risk-register-status"
            value={status}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isRiskArtifactStatus(value)) onStatusChange(value);
            }}
          >
            <option value="draft">Draft</option>
            <option value="in-review">In review</option>
            <option value="approved">Approved by manufacturer</option>
          </select>
          <button
            className="primary-button"
            type="button"
            onClick={() => onChange([...risks, createRiskRecord()])}
          >
            + Add risk
          </button>
        </div>
      </div>

      <div className="risk-form-grid risk-register-approval">
        <div className="risk-form-field">
          <label htmlFor="risk-register-approver">
            Risk Register approver / responsible person
          </label>
          <input
            id="risk-register-approver"
            type="text"
            value={registerApprover}
            onChange={(event) =>
              onApprovalChange(event.target.value, registerApprovalDate)
            }
            placeholder="Name and role"
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="risk-register-approval-date">Approval date</label>
          <input
            id="risk-register-approval-date"
            type="date"
            value={registerApprovalDate}
            onChange={(event) =>
              onApprovalChange(registerApprover, event.target.value)
            }
          />
        </div>
      </div>

      <section
        className="risk-identification-panel"
        aria-labelledby="risk-identification-title"
      >
        <div className="risk-identification-heading">
          <div>
            <h3 id="risk-identification-title">Risk identification prompts</h3>
            <p>
              Review these considerations especially for software and AI
              devices. They are prompts for product-specific assessment, not
              confirmed hazards or automatically created risks.
            </p>
          </div>
          <span className="risk-identification-count">
            {RISK_IDENTIFICATION_PROMPTS.filter((prompt) => {
              const decision =
                riskIdentification[prompt.id]?.decision ?? "not-assessed";
              return (
                decision !== "not-assessed" &&
                !!riskIdentification[prompt.id]?.rationale.trim()
              );
            }).length}{" "}
            / {RISK_IDENTIFICATION_PROMPTS.length} reviewed
          </span>
        </div>
        <div className="risk-identification-list">
          {RISK_IDENTIFICATION_PROMPTS.map((prompt, index) => {
            const assessment = riskIdentification[prompt.id] ?? {
              decision: "not-assessed" as const,
              rationale: "",
            };
            const decisionLabel =
              assessment.decision === "relevant"
                ? "Relevant"
                : assessment.decision === "not-applicable"
                  ? "Not applicable"
                  : "Not assessed";

            return (
              <details className="risk-identification-item" key={prompt.id}>
                <summary>
                  <span className="risk-identification-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="risk-identification-title">{prompt.title}</span>
                  <span
                    className={`status-badge ${assessment.decision === "not-assessed" ? "pending" : assessment.rationale.trim() ? "completed" : "progress"}`}
                  >
                    {decisionLabel}
                  </span>
                </summary>
                <div className="risk-identification-body">
                  <p>{prompt.description}</p>
                  <div className="risk-form-grid">
                    <div className="risk-form-field">
                      <label htmlFor={`prompt-${prompt.id}-decision`}>
                        Manufacturer&apos;s assessment
                      </label>
                      <select
                        id={`prompt-${prompt.id}-decision`}
                        value={assessment.decision}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          if (!isRiskIdentificationDecision(value)) return;
                          updateRiskIdentification(prompt.id, {
                            ...assessment,
                            decision: value,
                          });
                        }}
                      >
                        <option value="not-assessed">Not assessed</option>
                        <option value="relevant">Relevant to this device</option>
                        <option value="not-applicable">
                          Not applicable to this device
                        </option>
                      </select>
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`prompt-${prompt.id}-rationale`}>
                        Product-specific rationale
                      </label>
                      <textarea
                        id={`prompt-${prompt.id}-rationale`}
                        rows={3}
                        value={assessment.rationale}
                        onChange={(event) =>
                          updateRiskIdentification(prompt.id, {
                            ...assessment,
                            rationale: event.target.value,
                          })
                        }
                        placeholder="Explain why this consideration applies or does not apply to this device."
                      />
                    </div>
                  </div>
                  {assessment.decision === "relevant" && (
                    <button
                      className="secondary-button risk-identification-add"
                      type="button"
                      onClick={() => onAddRiskFromPrompt(prompt.id)}
                    >
                      Add an individualized risk scenario
                    </button>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {risks.length === 0 ? (
        <div className="risk-empty-state">
          <strong>No risk scenarios recorded yet.</strong>
          <p>Add a risk scenario to begin the register.</p>
        </div>
      ) : (
        <div className="risk-register-list">
          {risks.map((risk, index) => {
            const decisionDocumented =
              !!risk.residualRationale.trim() &&
              !!risk.residualUserInformation?.trim() &&
              (risk.residualDecision === "acceptable" ||
                (risk.residualDecision === "benefit-risk-justified" &&
                  !!risk.benefitRiskRationale?.trim()));

            return (
              <details className="risk-record" key={risk.id} open={index === 0}>
                <summary>
                  <span className="risk-record-number">
                    R-{String(index + 1).padStart(3, "0")}
                  </span>
                  <span className="risk-record-title">
                    {risk.hazard.trim() || "New risk scenario"}
                  </span>
                  <span
                    className={`status-badge ${risk.residualDecision === "not-assessed" ? "pending" : decisionDocumented ? "completed" : "progress"}`}
                  >
                    {decisionOptions.find(
                      (option) => option.value === risk.residualDecision,
                    )?.label ?? "Not assessed"}
                  </span>
                </summary>

                <div className="risk-record-body">
                  <div className="risk-record-actions">
                    <button
                      className="risk-delete-button"
                      type="button"
                      onClick={() =>
                        onChange(risks.filter((item) => item.id !== risk.id))
                      }
                    >
                      Remove risk
                    </button>
                  </div>
                  {risk.sourcePromptId && (
                    <p className="risk-identification-source">
                      Individual scenario created from:{" "}
                      {RISK_IDENTIFICATION_PROMPTS.find(
                        (prompt) => prompt.id === risk.sourcePromptId,
                      )?.title ?? "Risk identification prompt"}
                    </p>
                  )}
                  <div className="risk-form-grid">
                    {textFields.slice(0, 4).map((field) => (
                      <div className="risk-form-field" key={field.key}>
                        <label htmlFor={`${risk.id}-${field.key}`}>
                          {field.label}
                        </label>
                        <textarea
                          id={`${risk.id}-${field.key}`}
                          rows={field.rows}
                          value={risk[field.key]}
                          onChange={(event) =>
                            updateRisk(index, field.key, event.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <h3 className="risk-subheading">Initial risk analysis</h3>
                  <div className="risk-form-grid">
                    {riskAssessmentInput(
                      `${risk.id}-initial-severity`,
                      "Severity of potential harm",
                      risk.initialSeverity,
                      (value) => updateRisk(index, "initialSeverity", value),
                      typeof risk.initialSeverity === "number"
                        ? "Previously saved as a numeric rating. Review and re-enter it using the manufacturer's method."
                        : "Use the qualitative category or value defined in the manufacturer's method.",
                      "As defined in the risk management plan",
                    )}
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-initial-probability`}>
                        Probability of hazardous situation and resulting harm
                      </label>
                      <textarea
                        id={`${risk.id}-initial-probability`}
                        rows={2}
                        value={risk.initialProbability ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "initialProbability",
                            event.target.value,
                          )
                        }
                        placeholder="Enter the estimate(s) required by the manufacturer's method"
                      />
                      <small>
                        {typeof risk.initialProbability === "number"
                          ? "Previously saved as a numeric rating. Review and re-enter it using the manufacturer's method."
                          : "Include the probability of the hazardous situation and resulting harm, and any units or time horizon required by the method."}
                      </small>
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-initial-risk-evaluation`}>
                        Initial risk evaluation
                      </label>
                      <textarea
                        id={`${risk.id}-initial-risk-evaluation`}
                        rows={3}
                        value={risk.initialRiskEvaluation ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "initialRiskEvaluation",
                            event.target.value,
                          )
                        }
                        placeholder="Record the result using the manufacturer's method"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-initial-criteria-comparison`}>
                        Comparison with predefined acceptability criteria
                      </label>
                      <textarea
                        id={`${risk.id}-initial-criteria-comparison`}
                        rows={3}
                        value={risk.initialCriteriaComparison ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "initialCriteriaComparison",
                            event.target.value,
                          )
                        }
                        placeholder="Identify the applicable plan criterion and document the comparison"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-initial-rationale`}>
                        Rationale, evidence and assumptions
                      </label>
                      <textarea
                        id={`${risk.id}-initial-rationale`}
                        rows={3}
                        value={risk.initialRationale}
                        onChange={(event) =>
                          updateRisk(index, "initialRationale", event.target.value)
                        }
                        placeholder="Document data sources, assumptions, rationale and uncertainty"
                      />
                    </div>
                  </div>

                  <h3 className="risk-subheading">Risk control measures</h3>
                  <p className="risk-control-order-note">
                    Apply the control hierarchy where appropriate. For each
                    tier, record the measure or explain why it is not applied.
                  </p>
                  <div className="risk-form-grid">
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-risk-controls`}>
                        Control selection and overall rationale
                      </label>
                      <textarea
                        id={`${risk.id}-risk-controls`}
                        rows={3}
                        value={risk.riskControls}
                        onChange={(event) =>
                          updateRisk(index, "riskControls", event.target.value)
                        }
                        placeholder="Summarise the selected controls and why they are appropriate"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-inherently-safe-design`}>
                        1. Inherently safe design / risk elimination
                      </label>
                      <textarea
                        id={`${risk.id}-inherently-safe-design`}
                        rows={3}
                        value={risk.inherentlySafeDesign ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "inherentlySafeDesign",
                            event.target.value,
                          )
                        }
                        placeholder="Describe the design measure or explain why none is applied"
                      />
                      {riskControlStatusField(
                        `${risk.id}-inherently-safe-design-status`,
                        "Status",
                        risk.inherentlySafeDesignStatus,
                        (value) =>
                          updateRisk(
                            index,
                            "inherentlySafeDesignStatus",
                            value,
                          ),
                      )}
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-protective-measures`}>
                        2. Protective measures
                      </label>
                      <textarea
                        id={`${risk.id}-protective-measures`}
                        rows={3}
                        value={risk.protectiveMeasures ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "protectiveMeasures",
                            event.target.value,
                          )
                        }
                        placeholder="Describe safeguards or explain why none are applied"
                      />
                      {riskControlStatusField(
                        `${risk.id}-protective-measures-status`,
                        "Status",
                        risk.protectiveMeasuresStatus,
                        (value) =>
                          updateRisk(index, "protectiveMeasuresStatus", value),
                      )}
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-safety-information-training`}>
                        3. Information for safety and training
                      </label>
                      <textarea
                        id={`${risk.id}-safety-information-training`}
                        rows={3}
                        value={risk.safetyInformationTraining ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "safetyInformationTraining",
                            event.target.value,
                          )
                        }
                        placeholder="Describe warnings, instructions or training, or explain why none are applied"
                      />
                      {riskControlStatusField(
                        `${risk.id}-safety-information-training-status`,
                        "Status",
                        risk.safetyInformationTrainingStatus,
                        (value) =>
                          updateRisk(
                            index,
                            "safetyInformationTrainingStatus",
                            value,
                          ),
                      )}
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-control-owner`}>
                        Control owner / responsible person(s)
                      </label>
                      <input
                        id={`${risk.id}-control-owner`}
                        type="text"
                        value={risk.controlOwner ?? ""}
                        onChange={(event) =>
                          updateRisk(index, "controlOwner", event.target.value)
                        }
                        placeholder="Name or role responsible for each measure"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-control-implementation`}>
                        Implementation verification evidence
                      </label>
                      <textarea
                        id={`${risk.id}-control-implementation`}
                        rows={3}
                        value={risk.controlVerification}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "controlVerification",
                            event.target.value,
                          )
                        }
                        placeholder="Record how implementation of each measure is verified and evidenced"
                      />
                      {riskControlStatusField(
                        `${risk.id}-control-implementation-status`,
                        "Implementation status",
                        risk.controlImplementationStatus,
                        (value) =>
                          updateRisk(index, "controlImplementationStatus", value),
                      )}
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-control-effectiveness`}>
                        Effectiveness verification evidence
                      </label>
                      <textarea
                        id={`${risk.id}-control-effectiveness`}
                        rows={3}
                        value={risk.controlEffectivenessVerification ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "controlEffectivenessVerification",
                            event.target.value,
                          )
                        }
                        placeholder="Record methods, criteria and results confirming each measure reduces risk as intended"
                      />
                      {riskControlStatusField(
                        `${risk.id}-control-effectiveness-status`,
                        "Effectiveness status",
                        risk.controlEffectivenessStatus,
                        (value) =>
                          updateRisk(index, "controlEffectivenessStatus", value),
                      )}
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-control-introduced-risks`}>
                        Assessment of new risks introduced by controls
                      </label>
                      <textarea
                        id={`${risk.id}-control-introduced-risks`}
                        rows={3}
                        value={risk.controlIntroducedRisks ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "controlIntroducedRisks",
                            event.target.value,
                          )
                        }
                        placeholder="Describe introduced risks or record 'None identified' with the basis; add each identified scenario to the register"
                      />
                    </div>
                    <RiskEvidenceReferencesEditor
                      idPrefix={risk.id}
                      label="Evidence references"
                      references={risk.evidenceReferences ?? []}
                      onChange={(references) =>
                        updateRisk(index, "evidenceReferences", references)
                      }
                    />
                  </div>

                  <div className="risk-form-grid">
                    {textFields.slice(4).map((field) => (
                      <div className="risk-form-field" key={field.key}>
                        <label htmlFor={`${risk.id}-${field.key}`}>
                          {field.label}
                        </label>
                        <textarea
                          id={`${risk.id}-${field.key}`}
                          rows={field.rows}
                          value={risk[field.key]}
                          onChange={(event) =>
                            updateRisk(index, field.key, event.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <h3 className="risk-subheading">Residual risk evaluation</h3>
                  <div className="risk-form-grid">
                    {riskAssessmentInput(
                      `${risk.id}-residual-severity`,
                      "Residual severity",
                      risk.residualSeverity,
                      (value) => updateRisk(index, "residualSeverity", value),
                      typeof risk.residualSeverity === "number"
                        ? "Previously saved as a numeric rating. Review and re-enter it using the manufacturer's method."
                        : "Use the qualitative category or value defined in the manufacturer's method.",
                      "As defined in the risk management plan",
                    )}
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-residual-probability`}>
                        Residual probability of hazardous situation and harm
                      </label>
                      <textarea
                        id={`${risk.id}-residual-probability`}
                        rows={2}
                        value={risk.residualProbability ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "residualProbability",
                            event.target.value,
                          )
                        }
                        placeholder="Enter the estimate(s) required by the manufacturer's method"
                      />
                      <small>
                        {typeof risk.residualProbability === "number"
                          ? "Previously saved as a numeric rating. Review and re-enter it using the manufacturer's method."
                          : "Use the method, units and time horizon defined in the manufacturer's plan."}
                      </small>
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-residual-risk-evaluation`}>
                        Residual risk evaluation
                      </label>
                      <textarea
                        id={`${risk.id}-residual-risk-evaluation`}
                        rows={3}
                        value={risk.residualRiskEvaluation ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "residualRiskEvaluation",
                            event.target.value,
                          )
                        }
                        placeholder="Record the result using the manufacturer's method"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-residual-criteria-comparison`}>
                        Comparison with acceptability criteria
                      </label>
                      <textarea
                        id={`${risk.id}-residual-criteria-comparison`}
                        rows={3}
                        value={risk.residualCriteriaComparison ?? ""}
                        onChange={(event) =>
                          updateRisk(
                            index,
                            "residualCriteriaComparison",
                            event.target.value,
                          )
                        }
                        placeholder="Compare residual risk with the manufacturer's predefined criteria"
                      />
                    </div>
                    <div className="risk-form-field">
                      <label htmlFor={`${risk.id}-decision`}>
                        Manufacturer&apos;s residual risk decision
                      </label>
                      <select
                        id={`${risk.id}-decision`}
                        value={risk.residualDecision}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          if (isRiskAcceptanceDecision(value)) {
                            updateRisk(index, "residualDecision", value);
                          }
                        }}
                      >
                        {decisionOptions.map((option) => (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="risk-form-grid">
                    {textFields.slice(6).map((field) => (
                      <div className="risk-form-field" key={field.key}>
                        <label htmlFor={`${risk.id}-${field.key}`}>
                          {field.label}
                        </label>
                        <textarea
                          id={`${risk.id}-${field.key}`}
                          rows={field.rows}
                          value={risk[field.key]}
                          onChange={(event) =>
                            updateRisk(index, field.key, event.target.value)
                          }
                        />
                      </div>
                    ))}
                    {risk.residualDecision === "benefit-risk-justified" && (
                      <div className="risk-form-field">
                        <label htmlFor={`${risk.id}-benefit-risk-rationale`}>
                          Benefit-risk justification
                        </label>
                        <textarea
                          id={`${risk.id}-benefit-risk-rationale`}
                          rows={3}
                          value={risk.benefitRiskRationale ?? ""}
                          onChange={(event) =>
                            updateRisk(
                              index,
                              "benefitRiskRationale",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}
