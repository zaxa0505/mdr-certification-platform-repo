"use client";

import type {
  ProjectData,
  RiskArtifactStatus,
  RiskManagementPlan,
} from "@/lib/project-store";

type Props = {
  project: ProjectData | null;
  plan: RiskManagementPlan;
  status: RiskArtifactStatus;
  onChange: (plan: RiskManagementPlan) => void;
  onStatusChange: (status: RiskArtifactStatus) => void;
};

const fields: Array<{
  key: Exclude<keyof RiskManagementPlan, "version" | "approvalDate">;
  label: string;
  hint: string;
}> = [
  {
    key: "deviceIdentification",
    label: "Medical device identification",
    hint: "Record the device name, model/configuration, variants, Basic UDI-DI or other identifiers when assigned, and the manufacturer.",
  },
  {
    key: "scope",
    label: "Risk management scope and boundaries",
    hint: "Define the device configurations, accessories, interfaces, intended use and boundaries covered by this plan.",
  },
  {
    key: "lifecycleStages",
    label: "Lifecycle stages",
    hint: "Identify relevant stages from design and development through manufacture, distribution, use, servicing and disposal.",
  },
  {
    key: "rolesAndResponsibilities",
    label: "Responsible persons, roles and responsibilities",
    hint: "Name responsible persons where available and assign risk analysis, review, control, approval and production/post-production responsibilities.",
  },
  {
    key: "personnelCompetence",
    label: "Personnel competence",
    hint: "Define required knowledge, training and experience for people performing risk-management tasks, and how competence is maintained.",
  },
  {
    key: "riskEvaluationMethod",
    label: "Risk estimation method",
    hint: "Define the manufacturer's method for estimating severity and the probability of a hazardous situation and harm, including any scales, units, time horizons, assumptions, data sources and uncertainty handling. The application does not prescribe a universal 1–5 matrix.",
  },
  {
    key: "riskAcceptabilityCriteria",
    label: "Risk acceptability criteria",
    hint: "Enter the manufacturer's criteria for individual and overall residual risk. The application does not set or infer acceptable thresholds.",
  },
  {
    key: "controlVerificationApproach",
    label: "Risk control implementation and verification",
    hint: "Describe how controls are selected, implemented, verified and documented. Prioritise inherently safe design/manufacture, then protective measures, then safety information and training.",
  },
  {
    key: "controlEffectivenessApproach",
    label: "Risk control effectiveness",
    hint: "Define evidence and acceptance criteria used to verify that each implemented control is effective and does not introduce new risks.",
  },
  {
    key: "lifecycleReviewPlan",
    label: "Risk review throughout the product lifecycle",
    hint: "Set planned review points, frequency, responsible reviewers and how production and post-market information feeds back into the risk file.",
  },
  {
    key: "reviewTriggers",
    label: "Review and update triggers",
    hint: "Define event-based triggers such as design changes, new hazards, incidents, complaints, state-of-the-art changes or new evidence.",
  },
  {
    key: "approver",
    label: "Plan owner / approver",
    hint: "Enter the manufacturer's responsible person. This is a recorded declaration, not an electronic signature.",
  },
];

function isRiskArtifactStatus(value: string): value is RiskArtifactStatus {
  return value === "draft" || value === "in-review" || value === "approved";
}

export default function RiskManagementPlanForm({
  project,
  plan,
  status,
  onChange,
  onStatusChange,
}: Props) {
  return (
    <section className="workflow-panel risk-module-panel">
      <div className="panel-header">
        <div>
          <h2>Risk Management Plan</h2>
          <p>
            Define the device-specific process and responsibilities in line
            with ISO 14971 and MDR Annex I, sections 3–4.
          </p>
        </div>
        <span
          className={`status-badge ${status === "approved" ? "completed" : status === "in-review" ? "progress" : "pending"}`}
        >
          {status === "in-review" ? "In review" : status}
        </span>
      </div>

      <div className="risk-plan-linked-context">
        <strong>Linked device context</strong>
        <dl>
          <div>
            <dt>Device</dt>
            <dd>{project?.intendedPurpose?.deviceName || "Not recorded"}</dd>
          </div>
          <div>
            <dt>Manufacturer</dt>
            <dd>
              {project?.intendedPurpose?.manufacturer ||
                project?.manufacturer ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Intended purpose</dt>
            <dd>
              {project?.intendedPurpose?.intendedPurpose || "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Classification</dt>
            <dd>
              {project?.classification?.class ||
                project?.classification?.result?.classification ||
                "Not assessed"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="risk-form-grid">
        {fields.map((field) => (
          <div className="risk-form-field" key={field.key}>
            <label htmlFor={`risk-plan-${field.key}`}>{field.label}</label>
            <textarea
              id={`risk-plan-${field.key}`}
              value={plan[field.key]}
              onChange={(event) =>
                onChange({ ...plan, [field.key]: event.target.value })
              }
              rows={3}
            />
            <small>{field.hint}</small>
          </div>
        ))}

        <div className="risk-form-field">
          <label htmlFor="risk-plan-version">Plan version</label>
          <input
            id="risk-plan-version"
            value={plan.version}
            onChange={(event) =>
              onChange({ ...plan, version: event.target.value })
            }
          />
          <small>Use the versioning convention defined by your quality system.</small>
        </div>

        <div className="risk-form-field">
          <label htmlFor="risk-plan-approval-date">Approval date</label>
          <input
            id="risk-plan-approval-date"
            type="date"
            value={plan.approvalDate}
            onChange={(event) =>
              onChange({ ...plan, approvalDate: event.target.value })
            }
          />
          <small>
            Record the manufacturer&apos;s approval date; this is not an
            electronic signature.
          </small>
        </div>

        <div className="risk-form-field">
          <label htmlFor="risk-plan-status">Document review status</label>
          <select
            id="risk-plan-status"
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
          <small>
            Status is maintained by the project user; this application does not
            provide electronic signatures or approval controls.
          </small>
        </div>
      </div>
    </section>
  );
}
