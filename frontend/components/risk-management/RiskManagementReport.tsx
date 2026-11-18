"use client";

import type {
  ProjectData,
  RiskControlStatus,
  RiskEvidenceReference,
} from "@/lib/project-store";
import {
  getRiskManagementReadiness,
  RISK_IDENTIFICATION_PROMPTS,
} from "@/lib/risk-management";
import {
  getSafeSourceUrl,
  REGULATORY_SOURCE_CATALOG,
} from "@/lib/regulatory-sources";

type Props = {
  project: ProjectData | null;
};

function assessmentLabel(value: string | number | null | undefined) {
  if (value === null || value === undefined || !String(value).trim()) {
    return "Not recorded";
  }
  return typeof value === "number"
    ? `${value} (legacy numeric value — review against the manufacturer's method)`
    : value;
}

function decisionLabel(decision: string) {
  switch (decision) {
    case "acceptable":
      return "Acceptable — manufacturer decision";
    case "benefit-risk-justified":
      return "Benefit-risk justified — manufacturer decision";
    case "not-acceptable":
      return "Not acceptable — manufacturer decision";
    case "additional-controls-required":
      return "Additional controls required";
    default:
      return "Not assessed";
  }
}

function harmonisationLabel(status: string) {
  switch (status) {
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

function controlStatusLabel(status: RiskControlStatus | undefined) {
  switch (status) {
    case "not-applicable":
      return "Not applicable";
    case "planned":
      return "Planned";
    case "implemented":
      return "Implemented";
    case "verified":
      return "Verified";
    default:
      return "Not assessed";
  }
}

function EvidenceReferences({
  references,
}: {
  references?: RiskEvidenceReference[];
}) {
  if (!references?.length) return <p>Not recorded</p>;

  return (
    <ul className="risk-report-evidence">
      {references.map((reference) => {
        const safeUrl = getSafeSourceUrl(reference.url);
        return (
          <li key={reference.id}>
            {reference.label.trim() || "Untitled evidence reference"}{" "}
            {safeUrl ? (
              <a href={safeUrl} target="_blank" rel="noreferrer">
                Open evidence
              </a>
            ) : (
              <span>(no safe HTTP/HTTPS link)</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function RiskManagementReport({ project }: Props) {
  const stage = project?.riskManagement;
  const plan = stage?.plan;
  const risks = stage?.risks ?? [];
  const readiness = getRiskManagementReadiness(project);
  const regulatorySources = [
    ...REGULATORY_SOURCE_CATALOG,
    ...(project?.regulatorySources?.customSources ?? []),
  ];

  return (
    <article className="risk-report-print">
      <header className="risk-report-header">
        <div>
          <span className="step-label">MDR NAVIGATOR · PROJECT DATA</span>
          <h1>Risk Management Report</h1>
          <p>
            Project: <strong>{project?.name || "Unspecified project"}</strong>
            {project?.manufacturer ? ` · Manufacturer: ${project.manufacturer}` : ""}
          </p>
        </div>
        <button
          className="primary-button risk-no-print"
          type="button"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </header>

      <div className="risk-report-warning">
        This report records project information and manufacturer-entered
        assessments. It does not determine conformity, replace the
        manufacturer&apos;s quality management system, or provide an electronic
        approval or signature.
      </div>

      <section className="risk-report-section">
        <h2>Linked device context</h2>
        <dl className="risk-report-context">
          <div>
            <dt>Device</dt>
            <dd>{project?.intendedPurpose?.deviceName || project?.name || "Not specified"}</dd>
          </div>
          <div>
            <dt>Manufacturer</dt>
            <dd>
              {project?.intendedPurpose?.manufacturer ||
                project?.manufacturer ||
                "Not specified"}
            </dd>
          </div>
          <div>
            <dt>Intended purpose</dt>
            <dd>{project?.intendedPurpose?.intendedPurpose || "Not specified"}</dd>
          </div>
          <div>
            <dt>Classification</dt>
            <dd>
              {project?.classification?.class ||
                project?.classification?.result?.classification ||
                "Not assessed"}
            </dd>
          </div>
          <div>
            <dt>Classification rule</dt>
            <dd>
              {project?.classification?.rule ||
                project?.classification?.result?.rule ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Applicable requirements selected</dt>
            <dd>
              {
                Object.values(project?.requirements?.items ?? {}).filter(Boolean)
                  .length
              }
            </dd>
          </div>
        </dl>
      </section>

      <section className="risk-report-section">
        <h2>Risk Management Plan</h2>
        <p>
          Document status: <strong>{stage?.planStatus ?? "draft"}</strong>
          {plan?.version ? ` · Version ${plan.version}` : ""}
        </p>
        <dl className="risk-report-fields">
          <div><dt>Medical device identification</dt><dd>{plan?.deviceIdentification || "Not recorded"}</dd></div>
          <div><dt>Risk management scope and boundaries</dt><dd>{plan?.scope || "Not recorded"}</dd></div>
          <div><dt>Lifecycle stages</dt><dd>{plan?.lifecycleStages || "Not recorded"}</dd></div>
          <div><dt>Responsible persons, roles and responsibilities</dt><dd>{plan?.rolesAndResponsibilities || "Not recorded"}</dd></div>
          <div><dt>Personnel competence</dt><dd>{plan?.personnelCompetence || "Not recorded"}</dd></div>
          <div><dt>Risk estimation method</dt><dd>{plan?.riskEvaluationMethod || "Not recorded"}</dd></div>
          <div><dt>Risk acceptability criteria</dt><dd>{plan?.riskAcceptabilityCriteria || "Not recorded"}</dd></div>
          <div><dt>Risk control implementation and verification</dt><dd>{plan?.controlVerificationApproach || "Not recorded"}</dd></div>
          <div><dt>Risk control effectiveness</dt><dd>{plan?.controlEffectivenessApproach || "Not recorded"}</dd></div>
          <div><dt>Risk review throughout the product lifecycle</dt><dd>{plan?.lifecycleReviewPlan || "Not recorded"}</dd></div>
          <div><dt>Review and update triggers</dt><dd>{plan?.reviewTriggers || "Not recorded"}</dd></div>
          <div><dt>Plan owner / approver</dt><dd>{plan?.approver || "Not recorded"}</dd></div>
          <div><dt>Plan approval date</dt><dd>{plan?.approvalDate || "Not recorded"}</dd></div>
        </dl>
      </section>

      <section className="risk-report-section">
        <h2>Risk identification prompts</h2>
        <p>
          These are screening considerations, particularly for software and AI
          devices. A prompt is not a confirmed hazard unless the manufacturer
          has assessed it for this device and recorded a specific risk scenario.
        </p>
        <dl className="risk-report-fields">
          {RISK_IDENTIFICATION_PROMPTS.map((prompt) => {
            const assessment = stage?.riskIdentification?.[prompt.id];
            const decision =
              assessment?.decision === "relevant"
                ? "Relevant to this device"
                : assessment?.decision === "not-applicable"
                  ? "Not applicable to this device"
                  : "Not assessed";
            return (
              <div key={prompt.id}>
                <dt>{prompt.title}</dt>
                <dd>
                  <strong>{decision}</strong>
                  <p>{assessment?.rationale || "No product-specific rationale recorded."}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="risk-report-section">
        <h2>Risk Register</h2>
        <p>
          Document status:{" "}
          <strong>{stage?.registerStatus ?? "draft"}</strong>
          {" · "}Approver:{" "}
          <strong>{stage?.registerApprover || "Not recorded"}</strong>
          {" · "}Approval date:{" "}
          <strong>{stage?.registerApprovalDate || "Not recorded"}</strong>
        </p>
        <p>
          The manufacturer&apos;s plan defines the estimation method, scales and
          acceptability criteria. This report does not apply a universal
          numerical matrix or calculate risk acceptability.
        </p>
        {risks.length ? (
          risks.map((risk, index) => (
            <section className="risk-report-risk" key={risk.id}>
              <h3>
                R-{String(index + 1).padStart(3, "0")} ·{" "}
                {risk.hazard || "Hazard not specified"}
              </h3>
              <dl className="risk-report-fields">
                {risk.sourcePromptId && (
                  <div>
                    <dt>Risk identification prompt</dt>
                    <dd>
                      {RISK_IDENTIFICATION_PROMPTS.find(
                        (prompt) => prompt.id === risk.sourcePromptId,
                      )?.title ?? "Risk identification prompt"}
                    </dd>
                  </div>
                )}
                <div><dt>Foreseeable sequence of events</dt><dd>{risk.foreseeableSequence || "Not recorded"}</dd></div>
                <div><dt>Hazardous situation</dt><dd>{risk.hazardousSituation || "Not recorded"}</dd></div>
                <div><dt>Potential harm</dt><dd>{risk.harm || "Not recorded"}</dd></div>
                <div><dt>Initial severity of potential harm</dt><dd>{assessmentLabel(risk.initialSeverity)}</dd></div>
                <div><dt>Initial probability of hazardous situation and harm</dt><dd>{assessmentLabel(risk.initialProbability)}</dd></div>
                <div><dt>Initial risk evaluation</dt><dd>{risk.initialRiskEvaluation || "Not recorded"}</dd></div>
                <div><dt>Comparison with predefined acceptability criteria</dt><dd>{risk.initialCriteriaComparison || "Not recorded"}</dd></div>
                <div><dt>Initial rationale, evidence and assumptions</dt><dd>{risk.initialRationale || "Not recorded"}</dd></div>
                <div><dt>Control selection and overall rationale</dt><dd>{risk.riskControls || "Not recorded"}</dd></div>
                <div><dt>Inherently safe design / risk elimination</dt><dd>{risk.inherentlySafeDesign || "Not recorded"} · Status: {controlStatusLabel(risk.inherentlySafeDesignStatus)}</dd></div>
                <div><dt>Protective measures</dt><dd>{risk.protectiveMeasures || "Not recorded"} · Status: {controlStatusLabel(risk.protectiveMeasuresStatus)}</dd></div>
                <div><dt>Information for safety and training</dt><dd>{risk.safetyInformationTraining || "Not recorded"} · Status: {controlStatusLabel(risk.safetyInformationTrainingStatus)}</dd></div>
                <div><dt>Control owner / responsible person(s)</dt><dd>{risk.controlOwner || "Not recorded"}</dd></div>
                <div><dt>Implementation verification evidence</dt><dd>{risk.controlVerification || "Not recorded"} · Status: {controlStatusLabel(risk.controlImplementationStatus)}</dd></div>
                <div><dt>Effectiveness verification evidence</dt><dd>{risk.controlEffectivenessVerification || "Not recorded"} · Status: {controlStatusLabel(risk.controlEffectivenessStatus)}</dd></div>
                <div><dt>New risks introduced by controls</dt><dd>{risk.controlIntroducedRisks || "Not recorded"}</dd></div>
                <div>
                  <dt>Evidence references</dt>
                  <dd><EvidenceReferences references={risk.evidenceReferences} /></dd>
                </div>
                <div><dt>Residual severity</dt><dd>{assessmentLabel(risk.residualSeverity)}</dd></div>
                <div><dt>Residual probability of hazardous situation and harm</dt><dd>{assessmentLabel(risk.residualProbability)}</dd></div>
                <div><dt>Residual risk evaluation</dt><dd>{risk.residualRiskEvaluation || "Not recorded"}</dd></div>
                <div><dt>Residual comparison with acceptability criteria</dt><dd>{risk.residualCriteriaComparison || "Not recorded"}</dd></div>
                <div><dt>Manufacturer&apos;s residual risk decision</dt><dd>{decisionLabel(risk.residualDecision)}</dd></div>
                <div><dt>Residual risk acceptability rationale and justification</dt><dd>{risk.residualRationale || "Not recorded"}</dd></div>
                <div><dt>Information to provide to the user for this residual risk</dt><dd>{risk.residualUserInformation || "Not recorded"}</dd></div>
                {risk.residualDecision === "benefit-risk-justified" && (
                  <div><dt>Benefit-risk justification</dt><dd>{risk.benefitRiskRationale || "Not recorded"}</dd></div>
                )}
                <div><dt>Assessor</dt><dd>{risk.assessor || "Not recorded"}</dd></div>
              </dl>
            </section>
          ))
        ) : (
          <p>No risk scenarios have been recorded.</p>
        )}
      </section>

      <section className="risk-report-section">
        <h2>Approval summary</h2>
        <p>
          Approval entries are manually recorded project data, not electronic
          signatures or a substitute for controlled approval in the
          manufacturer&apos;s quality management system.
        </p>
        <dl className="risk-report-fields">
          <div>
            <dt>Risk Management Plan</dt>
            <dd>
              {stage?.planStatus ?? "draft"} · {plan?.approver || "Approver not recorded"} ·{" "}
              {plan?.approvalDate || "Date not recorded"}
            </dd>
          </div>
          <div>
            <dt>Risk Register</dt>
            <dd>
              {stage?.registerStatus ?? "draft"} ·{" "}
              {stage?.registerApprover || "Approver not recorded"} ·{" "}
              {stage?.registerApprovalDate || "Date not recorded"}
            </dd>
          </div>
          <div>
            <dt>Benefit-Risk Analysis</dt>
            <dd>
              {stage?.benefitRiskAnalysis?.approvalStatus ?? "draft"} ·{" "}
              {stage?.benefitRiskAnalysis?.approver || "Approver not recorded"} ·{" "}
              {stage?.benefitRiskAnalysis?.approvalDate || "Date not recorded"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="risk-report-section">
        <h2>Benefit-Risk Analysis</h2>
        <p>
          Overall manufacturer conclusion:{" "}
          <strong>
            {decisionLabel(
              stage?.benefitRiskAnalysis?.conclusion ?? "not-assessed",
            )}
          </strong>
        </p>
        <p>
          This section records the manufacturer&apos;s analysis. The application
          does not calculate a numeric ratio or determine acceptability.
        </p>
        <dl className="risk-report-fields">
          <div>
            <dt>Identified clinical benefits</dt>
            <dd>{stage?.benefitRiskAnalysis?.clinicalBenefits || "Not recorded"}</dd>
          </div>
          <div>
            <dt>Evidence supporting clinical benefits</dt>
            <dd>
              {stage?.benefitRiskAnalysis?.clinicalBenefitEvidence ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Assessment of residual risks</dt>
            <dd>
              {stage?.benefitRiskAnalysis?.residualRiskAssessment ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Benefit-risk analysis and comparison</dt>
            <dd>
              {stage?.benefitRiskAnalysis?.benefitRiskComparison ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Rationale for acceptability</dt>
            <dd>
              {stage?.benefitRiskAnalysis?.acceptabilityRationale ||
                "Not recorded"}
            </dd>
          </div>
          <div>
            <dt>Clinical evidence references</dt>
            <dd>
              <EvidenceReferences
                references={stage?.benefitRiskAnalysis?.evidenceReferences}
              />
            </dd>
          </div>
        </dl>
        <h3>Residual risk scenarios considered</h3>
        {risks.length > 0 ? (
          <ul>
            {risks.map((risk, index) => (
              <li key={risk.id}>
                R-{String(index + 1).padStart(3, "0")} ·{" "}
                {risk.hazard || "Hazard not specified"} —{" "}
                {decisionLabel(risk.residualDecision)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No risk scenarios have been recorded.</p>
        )}
      </section>

      <section className="risk-report-section">
        <h2>Information requiring attention</h2>
        {readiness.canComplete ? (
          <p>
            Required plan, register, benefit-risk, prerequisite and approval
            checks are recorded.
          </p>
        ) : (
          <ul>
            {readiness.missingPrerequisites.map((item) => <li key={item}>{item}</li>)}
            {readiness.missingPlan.map((field) => <li key={field}>Plan information missing: {field}</li>)}
            {readiness.missingRegister.map((field) => <li key={field}>{field}</li>)}
            {readiness.missingBenefitRiskAnalysis.map((item) => <li key={item}>{item}</li>)}
            {readiness.missingApproval.map((field) => <li key={field}>{field}</li>)}
          </ul>
        )}
        {readiness.riskIdentificationReview.length > 0 && (
          <>
            <p>Risk identification prompts still need review or rationale:</p>
            <ul>
              {readiness.riskIdentificationReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="risk-report-section risk-report-references">
        <h2>Regulatory sources and manufacturer applicability decisions</h2>
        <p>
          These are candidate sources, not a declaration that every source is
          mandatory or applicable. The manufacturer&apos;s project-specific
          rationale and the source verification status are shown below.
        </p>
        {regulatorySources.map((source) => {
          const assessment =
            project?.regulatorySources?.assessments?.[source.id];
          const decision =
            assessment?.decision === "applicable"
              ? "Applies to this project"
              : assessment?.decision === "not-applicable"
                ? "Not applicable"
                : "Needs assessment";

          return (
            <section className="risk-report-risk" key={source.id}>
              <h3>{source.reference} · {source.title}</h3>
              <dl className="risk-report-fields">
                <div><dt>Edition / revision</dt><dd>{source.edition}</dd></div>
                <div><dt>Validity / current status</dt><dd>{source.validity}</dd></div>
                <div><dt>Applicability decision</dt><dd>{decision}</dd></div>
                <div>
                  <dt>Manufacturer&apos;s rationale</dt>
                  <dd>{assessment?.rationale || "Not recorded"}</dd>
                </div>
                <div>
                  <dt>Project evidence</dt>
                  <dd>{assessment?.evidence || "Not recorded"}</dd>
                </div>
                <div>
                  <dt>Harmonisation</dt>
                  <dd>
                    {harmonisationLabel(source.harmonisation)} ·{" "}
                    {source.harmonisationDetails}
                  </dd>
                </div>
                <div><dt>Scope</dt><dd>{source.scope}</dd></div>
                <div>
                  <dt>Verification</dt>
                  <dd>
                    {source.verification} ·{" "}
                    {source.verifiedAt || "verification date not recorded"}
                    {source.verificationNote
                      ? ` · ${source.verificationNote}`
                      : ""}
                  </dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>
                    {source.sources.map((link, index) => (
                      <span key={`${source.id}-${link.url}`}>
                        {index > 0 ? " · " : ""}
                        {getSafeSourceUrl(link.url) ? (
                          <a
                            href={getSafeSourceUrl(link.url) ?? undefined}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label}
                          </a>
                        ) : (
                          `${link.label} (invalid URL)`
                        )}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </section>
          );
        })}
        <p>
          The Commission summary is for information only; confirm relevant
          references and transition dates in the Official Journal. MDCG
          guidance is non-binding and may be revised or archived. See the{" "}
          <a href="/regulatory-sources">project source catalogue</a> to review
          applicability decisions and add project-specific sources.
        </p>
      </section>
    </article>
  );
}
