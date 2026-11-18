"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  ProjectData,
  setStageCompletion,
  saveStageAndComplete,
} from "@/lib/project-store";
import { getRiskManagementReadiness } from "@/lib/risk-management";

function buildWorkflow(project: ProjectData | null) {
  const base = [
    {
      number: 1,
      key: "qualification",
      title: "Regulatory Qualification",
      description: "Overenie, či produkt spadá pod MDR.",
      path: "/qualification",
    },
    {
      number: 2,
      key: "intendedPurpose",
      title: "Intended Purpose",
      description: "Definovanie určeného účelu zdravotníckej pomôcky.",
      path: "/intended-purpose",
    },
    {
      number: 3,
      key: "classification",
      title: "Classification",
      description: "Určenie klasifikácie podľa Annex VIII.",
      path: "/classification",
    },
    {
      number: 4,
      key: "requirements",
      title: "Applicable Requirements",
      description: "Identifikácia príslušných regulačných požiadaviek.",
      path: "/requirements",
    },
    {
      number: 5,
      key: "riskManagement",
      title: "Risk Management",
      description: "Identifikácia a riadenie rizík.",
      path: "/risk-management",
    },
    {
      number: 6,
      key: "clinicalEvaluation",
      title: "Clinical Evaluation",
      description: "Posúdenie klinických dôkazov.",
      path: "/clinical-evaluation",
    },
    {
      number: 7,
      key: "technicalDocumentation",
      title: "Technical Documentation",
      description: "Príprava technickej dokumentácie.",
      path: "/technical-documentation",
    },
    {
      number: 8,
      key: "conformityAssessment",
      title: "Conformity Assessment",
      description: "Výber a realizácia postupu posudzovania zhody.",
      path: "/conformity-assessment",
    },
    {
      number: 9,
      key: "notifiedBody",
      title: "Notified Body",
      description: "Posúdenie zdravotníckej pomôcky notifikovanou osobou.",
      path: "/notified-body",
    },
    {
      number: 10,
      key: "declarationOfConformity",
      title: "EU Declaration of Conformity",
      description: "Vypracovanie EÚ vyhlásenia o zhode.",
      path: "/declaration",
    },
    {
      number: 11,
      key: "ceMarking",
      title: "CE Marking",
      description: "Umiestnenie označenia CE.",
      path: "/ce-marking",
    },
    {
      number: 12,
      key: "eudamed",
      title: "EUDAMED & Market Placement",
      description: "Registrácia a uvedenie pomôcky na trh.",
      path: "/eudamed",
    },
    {
      number: 13,
      key: "postMarketSurveillance",
      title: "Post-Market Surveillance",
      description: "Monitorovanie pomôcky po uvedení na trh.",
      path: "/post-market-surveillance",
    },
  ] as const;

  return base.map((item) => {
    const stage = project?.[item.key];
    const storedAsCompleted = stage?.completed ?? false;
    const riskNeedsReview =
      item.key === "riskManagement" &&
      storedAsCompleted &&
      !getRiskManagementReadiness(project).canComplete;
    const completed = storedAsCompleted && !riskNeedsReview;
    const inProgress =
      !completed &&
      !!stage &&
      (riskNeedsReview ||
        ("inProgress" in stage && stage.inProgress === true));
    return {
      ...item,
      status: completed ? "completed" : inProgress ? "progress" : "pending",
    };
  });
}

export default function Home() {
  const router = useRouter();

  const [selectedStep, setSelectedStep] = useState(0);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setProject(getProject());
  }, []);

  useEffect(() => {
    const onProjectsUpdated = () => setProject(getProject());
    window.addEventListener("mdr-projects-updated", onProjectsUpdated);
    window.addEventListener("mdr-current-project-changed", onProjectsUpdated);
    return () => {
      window.removeEventListener("mdr-projects-updated", onProjectsUpdated);
      window.removeEventListener(
        "mdr-current-project-changed",
        onProjectsUpdated,
      );
    };
  }, []);

  const workflow = buildWorkflow(project);

  const step = workflow[selectedStep];

  const completedSteps = workflow.filter(
    (item) => item.status === "completed",
  ).length;

  const progress = Math.round((completedSteps / workflow.length) * 100);

  const openStep = (index: number) => {
    setSelectedStep(index);
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

        <nav className="navigation">
          <button className="nav-item active">
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

          <button
            className="nav-item"
            onClick={() => router.push("/documents")}
          >
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

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Projects{project?.name ? ` / ${project.name}` : ""}
            </div>

            <h1>{project?.name || ""}</h1>

            {project?.manufacturer && (
              <p className="topbar-subtitle">{project.manufacturer}</p>
            )}
          </div>

          <div className="topbar-actions">
            <button className="secondary-button">Save Progress</button>

            <button className="primary-button">Export MDR Report</button>
          </div>
        </header>

        <section className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">PROJECT STATUS</div>

            <div className="progress-row">
              <div className="progress-circle">
                <div>{progress}%</div>
              </div>

              <div>
                <strong>In progress</strong>

                <p>
                  {completedSteps} of {workflow.length} stages completed
                </p>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-label">DEVICE CLASSIFICATION</div>

            <div className="summary-value">
              {project?.classification?.class ??
                project?.classification?.result?.classification ??
                "Not assessed"}
            </div>

            <p>
              {project?.classification?.rule ??
                project?.classification?.result?.rule ??
                "From the Classification stage"}
            </p>
          </div>

          <div className="summary-card">
            <div className="summary-label">CURRENT STAGE</div>

            <div className="summary-value current">{step.title}</div>

            <p>
              Step {step.number} of {workflow.length}
            </p>
          </div>

          <div className="summary-card">
            <div className="summary-label">COMPLIANCE</div>

            <div className="warning">● Action required</div>

            <p>Human verification required</p>
          </div>
        </section>

        <section className="workspace">
          <div className="workflow-panel">
            <div className="panel-header">
              <div>
                <h2>MDR Certification Workflow</h2>

                <p>
                  Guided certification process according to Regulation (EU)
                  2017/745
                </p>
              </div>

              <span className="stage-count">13 stages</span>
            </div>

            <div className="workflow-list">
              {workflow.map((item, index) => (
                <button
                  key={item.number}
                  className={`workflow-item ${selectedStep === index ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedStep(index);
                    router.push(item.path);
                  }}
                >
                  <div className={`step-circle ${item.status}`}>
                    {item.status === "completed" ? "✓" : item.number}
                  </div>

                  <div className="workflow-content">
                    <div className="workflow-title">{item.title}</div>

                    <div className="workflow-description">
                      {item.description}
                    </div>
                  </div>

                  <span className={`status-badge ${item.status}`}>
                    {item.status === "completed"
                      ? "View / edit"
                      : item.status === "progress"
                        ? "In progress"
                        : "Pending"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <aside className="detail-panel">
            <div className="detail-top">
              <span className="step-label">STEP {step.number}</span>

              <h2>{step.title}</h2>

              <span className="detail-status">
                {step.status === "progress"
                  ? "In progress"
                  : step.status === "completed"
                    ? "Completed"
                    : "Pending"}
              </span>
            </div>

            <div className="detail-section">
              <h3>Purpose</h3>

              <p>{step.description}</p>

              <p className="detail-text">
                This stage represents a regulatory checkpoint within the MDR
                certification process. Required evidence must be provided and
                verified before proceeding to the next stage.
              </p>
            </div>

            <div className="detail-section">
              <h3>Required evidence</h3>

              <label className="check-row">
                <input type="checkbox" />
                Regulatory assessment completed
              </label>

              <label className="check-row">
                <input type="checkbox" />
                Supporting documentation available
              </label>

              <label className="check-row">
                <input type="checkbox" />
                Evidence reviewed
              </label>

              <label className="check-row">
                <input type="checkbox" />
                Compliance decision documented
              </label>
            </div>

            <div className="detail-section">
              <h3>Regulatory basis</h3>

              <div className="source">
                <strong>Regulation (EU) 2017/745</strong>

                <span>Medical Device Regulation</span>
              </div>

              <div className="source">
                <strong>MDCG Guidance</strong>

                <span>Relevant regulatory guidance</span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="secondary-button"
                disabled={selectedStep === 0}
                onClick={() => setSelectedStep(Math.max(0, selectedStep - 1))}
              >
                ← Previous
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  if (!step.key) return;
                  if (step.key === "riskManagement") {
                    if (!getRiskManagementReadiness(getProject()).canComplete) {
                      showToast("Complete the Risk Management readiness checks first.");
                      return;
                    }

                    saveStageAndComplete("riskManagement", {});
                    setProject(getProject());
                    showToast("Risk Management stage completed");
                    return;
                  }

                  try {
                    saveStageAndComplete(step.key, {});
                  } catch {
                    setStageCompletion(step.key, true);
                  }

                  setProject(getProject());
                  showToast("Krok uložený");
                }}
                disabled={step.status === "completed"}
              >
                Save stage
              </button>

              <button
                className="primary-button"
                onClick={() => router.push(step.path)}
              >
                Open stage →
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
