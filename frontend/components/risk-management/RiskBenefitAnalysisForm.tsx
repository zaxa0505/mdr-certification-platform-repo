"use client";

import type {
  ProjectData,
  RiskAcceptanceDecision,
  RiskArtifactStatus,
  RiskBenefitAnalysis,
  RiskRecord,
} from "@/lib/project-store";
import RiskEvidenceReferencesEditor from "@/components/risk-management/RiskEvidenceReferencesEditor";

type Props = {
  project: ProjectData | null;
  risks: RiskRecord[];
  analysis: RiskBenefitAnalysis;
  onChange: (analysis: RiskBenefitAnalysis) => void;
};

const conclusionOptions: Array<{
  value: RiskAcceptanceDecision;
  label: string;
}> = [
  { value: "not-assessed", label: "Not assessed" },
  { value: "acceptable", label: "Acceptable — manufacturer decision" },
  {
    value: "benefit-risk-justified",
    label: "Acceptable based on benefit-risk analysis — manufacturer decision",
  },
  { value: "not-acceptable", label: "Not acceptable" },
  {
    value: "additional-controls-required",
    label: "Additional controls required",
  },
];

function decisionLabel(decision: string) {
  return (
    conclusionOptions.find((option) => option.value === decision)?.label ??
    "Not assessed"
  );
}

function isRiskArtifactStatus(value: string): value is RiskArtifactStatus {
  return value === "draft" || value === "in-review" || value === "approved";
}

export default function RiskBenefitAnalysisForm({
  project,
  risks,
  analysis,
  onChange,
}: Props) {
  const updateAnalysis = (updates: Partial<RiskBenefitAnalysis>) =>
    onChange({ ...analysis, ...updates, approvalStatus: "draft" });

  const clinicalEvaluationStatus = project?.clinicalEvaluation?.completed
    ? "Completed"
    : project?.clinicalEvaluation?.inProgress
      ? "In progress"
      : "Not completed";

  return (
    <section className="workflow-panel risk-module-panel">
      <div className="panel-header">
        <div>
          <h2>Benefit-Risk Analysis</h2>
          <p>
            Record the manufacturer&apos;s evaluation of clinical benefits
            against residual risks. This application does not calculate a
            benefit-risk ratio or determine acceptability.
          </p>
        </div>
        <span
          className={`status-badge ${analysis.approvalStatus === "approved" ? "completed" : analysis.approvalStatus === "in-review" ? "progress" : "pending"}`}
        >
          {analysis.approvalStatus === "in-review"
            ? "In review"
            : analysis.approvalStatus === "approved"
              ? "Approved"
              : "Draft"}
        </span>
      </div>

      <div className="risk-plan-linked-context">
        <strong>Linked clinical evaluation</strong>
        <dl>
          <div>
            <dt>Stage status</dt>
            <dd>{clinicalEvaluationStatus}</dd>
          </div>
          <div>
            <dt>Existing summary / notes</dt>
            <dd>
              {project?.clinicalEvaluation?.notes?.trim() || "Not recorded"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="risk-review-notice risk-benefit-notice">
        Base the analysis on the device&apos;s intended purpose, clinical
        evidence, use conditions, and the residual risks recorded in the
        register. The conclusion and its rationale are manufacturer decisions;
        no numeric ratio or automatic acceptance threshold is applied.
      </div>

      <div className="risk-form-grid">
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-clinical-benefits">
            Identified clinical benefits
          </label>
          <textarea
            id="benefit-risk-clinical-benefits"
            rows={4}
            value={analysis.clinicalBenefits}
            onChange={(event) =>
              updateAnalysis({ clinicalBenefits: event.target.value })
            }
            placeholder="Describe the intended clinical benefits and relevant outcomes for the intended population."
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-evidence">
            Evidence supporting the clinical benefits
          </label>
          <textarea
            id="benefit-risk-evidence"
            rows={4}
            value={analysis.clinicalBenefitEvidence}
            onChange={(event) =>
              updateAnalysis({ clinicalBenefitEvidence: event.target.value })
            }
            placeholder="Reference clinical evaluation findings, data sources, endpoints and relevant limitations."
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-residual-risks">
            Assessment of residual risks
          </label>
          <textarea
            id="benefit-risk-residual-risks"
            rows={4}
            value={analysis.residualRiskAssessment}
            onChange={(event) =>
              updateAnalysis({ residualRiskAssessment: event.target.value })
            }
            placeholder="Assess the residual risks individually and overall, including interactions, uncertainty and relevant use conditions. Reference risk IDs."
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-comparison">
            Benefit-risk analysis and comparison
          </label>
          <textarea
            id="benefit-risk-comparison"
            rows={4}
            value={analysis.benefitRiskComparison}
            onChange={(event) =>
              updateAnalysis({ benefitRiskComparison: event.target.value })
            }
            placeholder="Explain how the clinical benefits compare with the residual risks for the intended purpose and population."
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-conclusion">
            Overall manufacturer conclusion
          </label>
          <select
            id="benefit-risk-conclusion"
            value={analysis.conclusion}
            onChange={(event) => {
              const value = event.currentTarget.value;
              const selectedOption = conclusionOptions.find(
                (option) => option.value === value,
              );
              if (selectedOption) {
                onChange({
                  ...analysis,
                  conclusion: selectedOption.value,
                  approvalStatus: "draft",
                });
              }
            }}
          >
            {conclusionOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <small>
            Select the conclusion reached by the manufacturer; this application
            does not infer it from scores or thresholds.
          </small>
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-acceptability-rationale">
            Rationale for acceptability
          </label>
          <textarea
            id="benefit-risk-acceptability-rationale"
            rows={4}
            value={analysis.acceptabilityRationale}
            onChange={(event) =>
              updateAnalysis({ acceptabilityRationale: event.target.value })
            }
            placeholder="Justify the conclusion against the manufacturer's criteria and identify any conditions, limitations or remaining uncertainties."
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-approval-status">
            Document approval status
          </label>
          <select
            id="benefit-risk-approval-status"
            value={analysis.approvalStatus}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isRiskArtifactStatus(value)) {
                onChange({ ...analysis, approvalStatus: value });
              }
            }}
          >
            <option value="draft">Draft</option>
            <option value="in-review">In review</option>
            <option value="approved">Approved by manufacturer</option>
          </select>
          <small>
            This status is manually recorded and does not constitute an
            electronic signature.
          </small>
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-approver">
            Approver / responsible person
          </label>
          <input
            id="benefit-risk-approver"
            type="text"
            value={analysis.approver}
            onChange={(event) =>
              updateAnalysis({ approver: event.target.value })
            }
            placeholder="Name and role"
          />
        </div>
        <div className="risk-form-field">
          <label htmlFor="benefit-risk-approval-date">Approval date</label>
          <input
            id="benefit-risk-approval-date"
            type="date"
            value={analysis.approvalDate}
            onChange={(event) =>
              updateAnalysis({ approvalDate: event.target.value })
            }
          />
        </div>
      </div>

      <div className="risk-form-grid risk-benefit-evidence">
        <RiskEvidenceReferencesEditor
          idPrefix="benefit-risk"
          label="Clinical evidence references"
          references={analysis.evidenceReferences ?? []}
          onChange={(references) =>
            updateAnalysis({ evidenceReferences: references })
          }
        />
      </div>

      <div className="risk-benefit-linked-risks">
        <h3>Residual risks in the register</h3>
        {risks.length > 0 ? (
          <ul>
            {risks.map((risk, index) => (
              <li key={risk.id}>
                R-{String(index + 1).padStart(3, "0")} ·{" "}
                {risk.hazard.trim() || "Hazard not specified"} —{" "}
                {decisionLabel(risk.residualDecision)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No risk scenarios have been recorded yet.</p>
        )}
      </div>
    </section>
  );
}
