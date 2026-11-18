"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RiskBenefitAnalysisForm from "@/components/risk-management/RiskBenefitAnalysisForm";
import RiskManagementPlanForm from "@/components/risk-management/RiskManagementPlanForm";
import RiskManagementReport from "@/components/risk-management/RiskManagementReport";
import RiskRegister from "@/components/risk-management/RiskRegister";
import {
  getProject,
  ProjectData,
  RiskArtifactStatus,
  RiskBenefitAnalysis,
  RiskIdentificationAssessment,
  RiskIdentificationPromptId,
  RiskManagementPlan,
  RiskRecord,
  saveStageAndComplete,
  saveStageInProgress,
} from "@/lib/project-store";
import {
  EMPTY_RISK_PLAN,
  EMPTY_RISK_BENEFIT_ANALYSIS,
  createRiskRecord,
  getRiskManagementReadiness,
} from "@/lib/risk-management";

type RiskTab = "overview" | "plan" | "register" | "benefit-risk" | "report";

const tabs: Array<{ id: RiskTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "plan", label: "Risk Management Plan" },
  { id: "register", label: "Risk Register" },
  { id: "benefit-risk", label: "Benefit-Risk Analysis" },
  { id: "report", label: "Report" },
];

export default function RiskManagementPage() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<RiskManagementPlan>(EMPTY_RISK_PLAN);
  const [risks, setRisks] = useState<RiskRecord[]>([]);
  const [benefitRiskAnalysis, setBenefitRiskAnalysis] =
    useState<RiskBenefitAnalysis>(EMPTY_RISK_BENEFIT_ANALYSIS);
  const [riskIdentification, setRiskIdentification] = useState<
    Partial<Record<RiskIdentificationPromptId, RiskIdentificationAssessment>>
  >({});
  const [planStatus, setPlanStatus] = useState<RiskArtifactStatus>("draft");
  const [registerStatus, setRegisterStatus] =
    useState<RiskArtifactStatus>("draft");
  const [registerApprover, setRegisterApprover] = useState("");
  const [registerApprovalDate, setRegisterApprovalDate] = useState("");
  const [activeTab, setActiveTab] = useState<RiskTab>("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentProject = getProject();
      const riskData = currentProject?.riskManagement;
      setProject(currentProject);
      setNotes(riskData?.notes ?? "");
      setPlan({
        ...EMPTY_RISK_PLAN,
        ...riskData?.plan,
        deviceIdentification:
          riskData?.plan?.deviceIdentification ??
          currentProject?.intendedPurpose?.deviceName ??
          "",
      });
      setRisks(riskData?.risks ?? []);
      setBenefitRiskAnalysis({
        ...EMPTY_RISK_BENEFIT_ANALYSIS,
        ...riskData?.benefitRiskAnalysis,
      });
      setRiskIdentification(riskData?.riskIdentification ?? {});
      setPlanStatus(riskData?.planStatus ?? "draft");
      setRegisterStatus(riskData?.registerStatus ?? "draft");
      setRegisterApprover(riskData?.registerApprover ?? "");
      setRegisterApprovalDate(riskData?.registerApprovalDate ?? "");
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const riskStage = project?.riskManagement;
  const currentRiskData = {
    completed: riskStage?.completed ?? false,
    notes,
    plan,
    planStatus,
    risks,
    benefitRiskAnalysis,
    registerStatus,
    registerApprover,
    registerApprovalDate,
    riskIdentification,
    timestamp: riskStage?.timestamp,
  };
  const readiness = getRiskManagementReadiness(
    project
      ? { ...project, riskManagement: currentRiskData }
      : null,
  );
  const isCompleted =
    (riskStage?.completed ?? false) && readiness.canComplete && !isDirty;
  const needsReview = (riskStage?.completed ?? false) && !readiness.canComplete;
  const stageStatus = isDirty
    ? "Unsaved changes"
    : isCompleted
      ? "Completed"
      : needsReview
        ? "Needs review"
      : riskStage?.inProgress
        ? "In progress"
        : "Not started";
  const stageStatusClass = isCompleted
    ? "completed"
    : isDirty || needsReview || riskStage?.inProgress
      ? "progress"
      : "pending";

  const linkedStages = [
    project?.qualification?.completed,
    project?.intendedPurpose?.completed,
    project?.classification?.completed,
    project?.requirements?.completed,
  ].filter(Boolean).length;
  const applicableRequirements = Object.values(
    project?.requirements?.items ?? {},
  ).filter(Boolean).length;
  const classification =
    project?.classification?.class ??
    project?.classification?.result?.classification ??
    "Not assessed";
  const purpose =
    project?.intendedPurpose?.intendedPurpose?.trim() || "Not specified";

  const stageData = {
    notes,
    plan,
    planStatus,
    risks,
    benefitRiskAnalysis,
    registerStatus,
    registerApprover,
    registerApprovalDate,
    ...(Object.keys(riskIdentification).length > 0
      ? { riskIdentification }
      : {}),
    timestamp: new Date().toISOString(),
  };

  const saveDraft = () => {
    try {
      saveStageInProgress("riskManagement", stageData);
      setProject(getProject());
      setIsDirty(false);
      setMessage("Risk management data saved as a draft.");
      return true;
    } catch (error) {
      console.error("Unable to save risk management draft.", error);
      setMessage("Unable to save the draft. Please try again.");
      return false;
    }
  };

  const continueToClinicalEvaluation = () => {
    if (!saveDraft()) return;
    router.push("/clinical-evaluation");
  };

  const finishStage = () => {
    if (!readiness.canComplete) {
      setActiveTab("overview");
      setMessage(
        "Risk Management cannot be completed yet. Review the outstanding items below.",
      );
      return;
    }

    try {
      saveStageAndComplete("riskManagement", stageData);
      setProject(getProject());
      setIsDirty(false);
      router.push("/project");
    } catch (error) {
      console.error("Unable to complete risk management.", error);
      setMessage("Unable to complete this stage. Please try again.");
    }
  };

  const updatePlan = (nextPlan: RiskManagementPlan) => {
    setPlan(nextPlan);
    setPlanStatus("draft");
    setIsDirty(true);
    setMessage("");
  };

  const updateRisks = (nextRisks: RiskRecord[]) => {
    setRisks(nextRisks);
    setRegisterStatus("draft");
    setIsDirty(true);
    setMessage("");
  };

  const updateRiskIdentification = (
    nextRiskIdentification: Partial<
      Record<RiskIdentificationPromptId, RiskIdentificationAssessment>
    >,
  ) => {
    setRiskIdentification(nextRiskIdentification);
    setRegisterStatus("draft");
    setIsDirty(true);
    setMessage("");
  };

  const updateBenefitRiskAnalysis = (nextAnalysis: RiskBenefitAnalysis) => {
    setBenefitRiskAnalysis(nextAnalysis);
    setIsDirty(true);
    setMessage("");
  };

  const addRiskFromPrompt = (promptId: RiskIdentificationPromptId) => {
    setRisks([...risks, createRiskRecord(promptId)]);
    setRegisterStatus("draft");
    setIsDirty(true);
    setMessage(
      "A blank risk scenario was added from this prompt. Complete it with a product-specific hazard and assessment.",
    );
  };

  const updatePlanStatus = (status: RiskArtifactStatus) => {
    setPlanStatus(status);
    setIsDirty(true);
    setMessage("");
  };

  const updateRegisterStatus = (status: RiskArtifactStatus) => {
    setRegisterStatus(status);
    setIsDirty(true);
    setMessage("");
  };

  const updateRegisterApproval = (approver: string, approvalDate: string) => {
    setRegisterApprover(approver);
    setRegisterApprovalDate(approvalDate);
    setRegisterStatus("draft");
    setIsDirty(true);
    setMessage("");
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
            className="nav-item active"
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
            className="nav-item"
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

      <main className="main-content risk-module-page">
        <header className="topbar risk-module-header">
          <div>
            <div className="breadcrumb">
              {project?.name || "Project"} / MDR Workflow / Risk Management
            </div>
            <h1>Risk Management</h1>
            <p className="topbar-subtitle">
              Manage the plan, risk scenarios and manufacturer assessments
              within this MDR project.
            </p>
          </div>
          <div className="topbar-actions risk-no-print">
            <button
              className="secondary-button"
              onClick={saveDraft}
              disabled={!isLoaded}
            >
              Save draft
            </button>
            <button
              className="secondary-button"
              onClick={finishStage}
              disabled={!isLoaded || isCompleted}
            >
              {isCompleted ? "Stage completed ✓" : "Complete stage"}
            </button>
            <button
              className="primary-button"
              onClick={continueToClinicalEvaluation}
              disabled={!isLoaded}
            >
              Save &amp; Continue →
            </button>
          </div>
        </header>

        <nav className="risk-module-tabs risk-no-print" aria-label="Risk management sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`risk-module-tab ${activeTab === tab.id ? "active" : ""}`}
              aria-current={activeTab === tab.id ? "page" : undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "register" && risks.length > 0 && (
                <span className="risk-tab-count">{risks.length}</span>
              )}
            </button>
          ))}
        </nav>

        {message && (
          <div className="risk-module-message" role="status" aria-live="polite">
            {message}
          </div>
        )}

        {activeTab === "overview" && (
          <>
            <section className="summary-grid" aria-label="Risk management status">
              <div className="summary-card">
                <div className="summary-label">STAGE STATUS</div>
                <div className="progress-row">
                  <div className="progress-circle">
                    <div>{isCompleted ? "✓" : "05"}</div>
                  </div>
                  <div>
                    <strong>{stageStatus}</strong>
                    <p>Risk Management · Stage 5 of 13</p>
                  </div>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-label">LINKED MDR STAGES</div>
                <div className="summary-value">
                  {linkedStages} <span className="risk-summary-total">/ 4</span>
                </div>
                <p>Qualification through applicable requirements</p>
              </div>
              <div className="summary-card">
                <div className="summary-label">DEVICE CLASSIFICATION</div>
                <div className="summary-value">{classification}</div>
                <p>Linked from Classification</p>
              </div>
              <div className="summary-card">
                <div className="summary-label">RISK SCENARIOS</div>
                <div className="summary-value">{risks.length}</div>
                <p>
                  {readiness.missingRegister.length
                    ? `${readiness.missingRegister.length} item(s) require attention`
                    : "Register details recorded"}
                </p>
                <p>
                  {readiness.reviewedRiskIdentificationCount} /{" "}
                  {readiness.riskIdentificationPromptCount} identification
                  prompts reviewed
                </p>
              </div>
            </section>

            <section className="workspace">
              <div className="workflow-panel">
                <div className="panel-header">
                  <div>
                    <h2>Risk Management Workspace</h2>
                    <p>
                      Document the process, evaluate risk scenarios and record
                      manufacturer decisions.
                    </p>
                  </div>
                  <span className="stage-count">ISO 14971</span>
                </div>
                <div className="workflow-list">
                  <button
                    className="workflow-item"
                    onClick={() => setActiveTab("plan")}
                  >
                    <div className="step-circle progress">1</div>
                    <div className="workflow-content">
                      <div className="workflow-title">Risk Management Plan</div>
                      <div className="workflow-description">
                        Identify the device, personnel, risk criteria, control
                        verification and lifecycle reviews.
                      </div>
                    </div>
                    <span
                      className={`status-badge ${planStatus === "approved" ? "completed" : planStatus === "in-review" ? "progress" : "pending"}`}
                    >
                      {planStatus === "in-review" ? "In review" : planStatus}
                    </span>
                  </button>
                  <button
                    className="workflow-item"
                    onClick={() => setActiveTab("register")}
                  >
                    <div className="step-circle pending">2</div>
                    <div className="workflow-content">
                      <div className="workflow-title">Risk Register</div>
                      <div className="workflow-description">
                        Capture hazards, foreseeable sequences, controls and
                        residual risk assessments.
                      </div>
                    </div>
                    <span
                      className={`status-badge ${registerStatus === "approved" ? "completed" : registerStatus === "in-review" ? "progress" : "pending"}`}
                    >
                      {registerStatus === "in-review"
                        ? "In review"
                        : registerStatus}
                    </span>
                  </button>
                  <button
                    className="workflow-item"
                    onClick={() => setActiveTab("benefit-risk")}
                  >
                    <div className="step-circle pending">3</div>
                    <div className="workflow-content">
                      <div className="workflow-title">Benefit-Risk Analysis</div>
                      <div className="workflow-description">
                        Compare documented clinical benefits with the
                        manufacturer&apos;s residual risk assessment.
                      </div>
                    </div>
                    <span
                      className={`status-badge ${benefitRiskAnalysis.conclusion === "acceptable" || benefitRiskAnalysis.conclusion === "benefit-risk-justified" ? "completed" : "pending"}`}
                    >
                      {benefitRiskAnalysis.conclusion === "not-assessed"
                        ? "Not assessed"
                        : benefitRiskAnalysis.conclusion}
                    </span>
                  </button>
                  <button
                    className="workflow-item"
                    onClick={() => setActiveTab("report")}
                  >
                    <div className="step-circle pending">4</div>
                    <div className="workflow-content">
                      <div className="workflow-title">Risk Management Report</div>
                      <div className="workflow-description">
                        Review linked project context and print or save a PDF
                        report.
                      </div>
                    </div>
                    <span className="status-badge pending">Preview</span>
                  </button>
                </div>
              </div>

              <aside className="detail-panel">
                <div className="detail-top">
                  <span className="step-label">LINKED PROJECT CONTEXT</span>
                  <h2>{project?.name || "No project selected"}</h2>
                  <span className={`status-badge ${stageStatusClass}`}>
                    {stageStatus}
                  </span>
                </div>
                <div className="detail-section">
                  <h3>Intended purpose</h3>
                  <p>{purpose}</p>
                </div>
                <div className="detail-section">
                  <h3>Classification</h3>
                  <p>
                    {classification}
                    {project?.classification?.rule ||
                    project?.classification?.result?.rule
                      ? ` · ${project.classification.rule ?? project.classification.result?.rule}`
                      : ""}
                  </p>
                </div>
                <div className="detail-section">
                  <h3>Applicable requirements</h3>
                  <p>
                    {applicableRequirements
                      ? `${applicableRequirements} requirement(s) selected in the previous stage.`
                      : "No applicable requirements are linked yet."}
                  </p>
                </div>
              </aside>
            </section>

            <section className="workflow-panel risk-readiness-panel">
              <div className="panel-header">
                <div>
                  <h2>Readiness and missing information</h2>
                  <p>
                    These checks identify missing records; they do not
                    determine regulatory compliance.
                  </p>
                </div>
                <span
                  className={`status-badge ${readiness.canComplete ? "completed" : "progress"}`}
                >
                  {readiness.canComplete ? "Ready for review" : "Action required"}
                </span>
              </div>
              <div className="risk-readiness-grid">
                <div>
                  <h3>Previous-stage context</h3>
                  {readiness.missingPrerequisites.length ? (
                    <ul>
                      {readiness.missingPrerequisites.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Required upstream stage records are available.</p>
                  )}
                </div>
                <div>
                  <h3>Risk documentation</h3>
                  {readiness.missingPlan.length ||
                  readiness.missingRegister.length ||
                  readiness.riskIdentificationReview.length ||
                  readiness.missingBenefitRiskAnalysis.length ||
                  readiness.missingApproval.length ? (
                    <ul>
                      {readiness.missingPlan.map((field) => (
                        <li key={field}>Plan information missing: {field}</li>
                      ))}
                      {readiness.missingRegister.slice(0, 6).map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                      {readiness.missingRegister.length > 6 && (
                        <li>
                          {readiness.missingRegister.length - 6} more register
                          item(s) require attention.
                        </li>
                      )}
                      {readiness.riskIdentificationReview
                        .slice(0, 6)
                        .map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      {readiness.riskIdentificationReview.length > 6 && (
                        <li>
                          {readiness.riskIdentificationReview.length - 6} more
                          risk identification item(s) require attention.
                        </li>
                      )}
                      {readiness.missingBenefitRiskAnalysis.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                      {readiness.missingApproval.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Plan, identification and register checks are complete.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="workflow-panel risk-notes-panel">
              <div className="panel-header">
                <div>
                  <h2>Existing Risk Management Summary</h2>
                  <p>
                    Preserved from the existing project data and included in
                    the report.
                  </p>
                </div>
              </div>
              <div className="risk-notes-content">
                <label htmlFor="risk-summary">Summary / Notes</label>
                <textarea
                  id="risk-summary"
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                    setIsDirty(true);
                    setMessage("");
                  }}
                  rows={4}
                  placeholder="Briefly summarise the risk management approach..."
                />
              </div>
            </section>

            <section className="risk-framework-note">
              <strong>Regulatory framework for manufacturer review</strong>
              <p>
                MDR Article 10(2) and Annex I (including risk management and
                GSPR), with technical documentation under Annexes II and III.
                Consider ISO 14971:2019 and ISO/TR 24971:2020, together with
                relevant harmonised standards and current MDCG guidance. Verify
                applicability and current status for the device and market.
              </p>
            </section>
          </>
        )}

        {activeTab === "plan" && (
          <RiskManagementPlanForm
            project={project}
            plan={plan}
            status={planStatus}
            onChange={updatePlan}
            onStatusChange={updatePlanStatus}
          />
        )}

        {activeTab === "register" && (
          <RiskRegister
            risks={risks}
            riskIdentification={riskIdentification}
            status={registerStatus}
            registerApprover={registerApprover}
            registerApprovalDate={registerApprovalDate}
            onChange={updateRisks}
            onApprovalChange={updateRegisterApproval}
            onRiskIdentificationChange={updateRiskIdentification}
            onAddRiskFromPrompt={addRiskFromPrompt}
            onStatusChange={updateRegisterStatus}
          />
        )}

        {activeTab === "benefit-risk" && (
          <RiskBenefitAnalysisForm
            project={project}
            risks={risks}
            analysis={benefitRiskAnalysis}
            onChange={updateBenefitRiskAnalysis}
          />
        )}

        {activeTab === "report" && <RiskManagementReport project={{
          ...(project ?? {
            id: "unsaved-project",
            name: "",
            manufacturer: "",
          }),
          riskManagement: {
            ...currentRiskData,
            timestamp: riskStage?.timestamp,
          },
        }} />}
      </main>
    </div>
  );
}
