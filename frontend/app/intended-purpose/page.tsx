"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  saveStageData,
  saveStageAndComplete,
  saveStageInProgress,
} from "@/lib/project-store";
import { useAutosave } from "@/lib/use-autosave";
import StageControls from "@/components/StageControls";

type FormData = {
  deviceName: string;
  manufacturer: string;
  intendedPurpose: string;
  targetUsers: string;
  targetPatients: string;
  medicalCondition: string;
  clinicalUse: string;
  environment: string;
  primaryFunction: string;
};

const initialForm: FormData = {
  deviceName: "",
  manufacturer: "",
  intendedPurpose: "",
  targetUsers: "",
  targetPatients: "",
  medicalCondition: "",
  clinicalUse: "",
  environment: "",
  primaryFunction: "",
};

export default function IntendedPurposePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [isDirty, setIsDirty] = useState(false);

  const { saveNow } = useAutosave("intendedPurpose", form, {
    delay: 1000,
    enabled: isDirty,
  });

  useEffect(() => {
    let restoredForm: FormData | null = null;
    const project = getProject();
    if (project?.intendedPurpose) {
      restoredForm = {
        ...initialForm,
        ...project.intendedPurpose,
      };
    } else {
      const savedPurpose = localStorage.getItem("mdr-intended-purpose");
      if (savedPurpose) {
        try {
          const parsed = JSON.parse(savedPurpose);
          restoredForm = {
            ...initialForm,
            ...parsed,
          };
          saveStageData("intendedPurpose", parsed);
        } catch {
          console.error("Unable to load intended purpose data.");
        }
      }
    }

    if (restoredForm) {
      const timer = window.setTimeout(() => {
        setForm(restoredForm);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const saveAndContinue = async () => {
    // manual save
    await saveNow();

    setTimeout(() => {
      router.push("/classification");
    }, 400);
  };

  const saveDraft = async () => {
    saveStageInProgress("intendedPurpose", form);
  };

  const backToProject = async () => {
    await saveNow();
    await new Promise((res) => setTimeout(res, 150));
    router.push("/project");
  };

  const finishStage = async () => {
    // ensure latest data saved then mark complete
    if (!isValid) {
      // do not allow finishing if required fields are missing
      window.alert(
        "Please complete required fields before finishing this stage.",
      );
      return;
    }

    await saveNow();
    // prefer atomic helper in project-store
    saveStageAndComplete("intendedPurpose", form);

    // refresh local UI from persisted project, then navigate
    try {
      const proj = getProject();
      if (proj?.intendedPurpose) {
        setForm({
          ...initialForm,
          ...(proj.intendedPurpose as Partial<FormData>),
        });
      }
    } catch {}

    await new Promise((res) => setTimeout(res, 200));
    router.push("/project");
  };

  const isValid =
    form.deviceName.trim() &&
    form.manufacturer.trim() &&
    form.intendedPurpose.trim() &&
    form.targetUsers.trim() &&
    form.primaryFunction.trim();

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
            onClick={() => router.push("/intended-purpose")}
          >
            <span>✓</span>
            MDR Workflow
          </button>

          <button className="nav-item">
            <span>▤</span>
            Documents
          </button>

          <button className="nav-item">
            <span>⚖</span>
            Regulatory Sources
          </button>

          <button className="nav-item">
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

            <button>Open Assistant</button>
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
              Projects / AI Medical Device / Intended Purpose
            </div>

            <h1>Intended Purpose</h1>
          </div>

          <StageControls
            onPrev={() => router.push("/qualification")}
            onSaveDraft={saveDraft}
            onBackToProject={backToProject}
            onFinish={finishStage}
            onPrimary={saveAndContinue}
            primaryDisabled={!isValid}
          />
        </header>

        <div className="page-container">
          <div className="page-header">
            <span className="step-label">STEP 02 · INTENDED PURPOSE</span>

            <h2>Define the intended purpose of the medical device</h2>

            <p>
              The intended purpose is one of the key elements used throughout
              the MDR assessment. Provide a clear description of what the device
              is intended to do, for whom and in which clinical context.
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <span>Certification progress</span>
              <strong>Step 2 of 13</strong>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: "15%" }} />
            </div>
          </div>

          <section className="form-card">
            <div className="form-card-header">
              <div>
                <span className="section-number">01</span>

                <div>
                  <h3>Device identification</h3>

                  <p>Basic information about the product being assessed.</p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Device name
                  <span>*</span>
                </label>

                <input
                  value={form.deviceName}
                  onChange={(e) => updateField("deviceName", e.target.value)}
                  placeholder="e.g. AI Diagnostic Assistant"
                />
              </div>

              <div className="form-field">
                <label>
                  Manufacturer
                  <span>*</span>
                </label>

                <input
                  value={form.manufacturer}
                  onChange={(e) => updateField("manufacturer", e.target.value)}
                  placeholder="Manufacturer / organisation"
                />
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-header">
              <div>
                <span className="section-number">02</span>

                <div>
                  <h3>Intended purpose</h3>

                  <p>
                    Describe the medical purpose and function of the device.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>
                What is the intended medical purpose of the device?
                <span>*</span>
              </label>

              <textarea
                value={form.intendedPurpose}
                onChange={(e) => updateField("intendedPurpose", e.target.value)}
                placeholder="Describe what the device is intended to achieve..."
                rows={5}
              />

              <small>
                Describe the intended medical purpose as precisely as possible.
                Avoid describing technical implementation details unless they
                are relevant to the medical function.
              </small>
            </div>

            <div className="form-field">
              <label>
                What is the primary function of the device?
                <span>*</span>
              </label>

              <textarea
                value={form.primaryFunction}
                onChange={(e) => updateField("primaryFunction", e.target.value)}
                placeholder="e.g. Analyse medical images and identify potential abnormalities..."
                rows={4}
              />
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-header">
              <div>
                <span className="section-number">03</span>

                <div>
                  <h3>Intended users and population</h3>

                  <p>
                    Define who will use the device and who the device is
                    intended for.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>
                  Intended users
                  <span>*</span>
                </label>

                <textarea
                  value={form.targetUsers}
                  onChange={(e) => updateField("targetUsers", e.target.value)}
                  placeholder="e.g. physicians, radiologists, laboratory personnel..."
                  rows={4}
                />
              </div>

              <div className="form-field">
                <label>Intended patient population</label>

                <textarea
                  value={form.targetPatients}
                  onChange={(e) =>
                    updateField("targetPatients", e.target.value)
                  }
                  placeholder="Describe the intended patient population..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-header">
              <div>
                <span className="section-number">04</span>

                <div>
                  <h3>Clinical context</h3>

                  <p>
                    Specify the medical condition and environment in which the
                    device is intended to operate.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Medical condition or clinical indication</label>

              <textarea
                value={form.medicalCondition}
                onChange={(e) =>
                  updateField("medicalCondition", e.target.value)
                }
                placeholder="e.g. detection of pulmonary abnormalities..."
                rows={4}
              />
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Clinical use</label>

                <select
                  value={form.clinicalUse}
                  onChange={(e) => updateField("clinicalUse", e.target.value)}
                >
                  <option value="">Select clinical context</option>

                  <option value="diagnosis">Diagnosis</option>

                  <option value="screening">Screening</option>

                  <option value="monitoring">Monitoring</option>

                  <option value="prediction">Prediction / prognosis</option>

                  <option value="treatment">Treatment support</option>

                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label>Intended environment</label>

                <select
                  value={form.environment}
                  onChange={(e) => updateField("environment", e.target.value)}
                >
                  <option value="">Select environment</option>

                  <option value="hospital">Hospital</option>

                  <option value="clinic">Clinical practice</option>

                  <option value="laboratory">Laboratory</option>

                  <option value="home">Home healthcare</option>

                  <option value="mobile">Mobile environment</option>

                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          <div className="regulatory-note">
            <div className="note-icon">⚖</div>

            <div>
              <strong>Regulatory checkpoint</strong>

              <p>
                The intended purpose should remain consistent throughout the
                technical documentation, risk management, clinical evaluation
                and conformity assessment process.
              </p>
            </div>
          </div>

          <StageControls
            onPrev={() => router.push("/qualification")}
            onSaveDraft={saveDraft}
            onBackToProject={backToProject}
            onFinish={finishStage}
            onPrimary={saveAndContinue}
            primaryDisabled={!isValid}
          />
        </div>
      </main>
    </div>
  );
}
