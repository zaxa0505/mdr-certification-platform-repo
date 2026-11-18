"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  saveStageAndComplete,
  saveStageInProgress,
} from "@/lib/project-store";
import StageControls from "@/components/StageControls";

export default function ClinicalEvaluationPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = getProject()?.clinicalEvaluation;
      setNotes(saved?.notes ?? "");
      setIsCompleted(saved?.completed ?? false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveDraft = () => {
    if (!isDirty && isCompleted) return;

    saveStageInProgress("clinicalEvaluation", {
      notes,
      timestamp: new Date().toISOString(),
    });
    setIsDirty(false);
    setIsCompleted(false);
  };

  const backToProject = async () => {
    saveDraft();
    await new Promise((resolve) => setTimeout(resolve, 150));
    router.push("/project");
  };

  const finishStage = async () => {
    if (!notes.trim()) {
      window.alert(
        "Please add a summary of the clinical evaluation before finishing this stage.",
      );
      return;
    }

    saveStageAndComplete("clinicalEvaluation", {
      notes,
      timestamp: new Date().toISOString(),
    });
    setIsDirty(false);
    setIsCompleted(true);

    await new Promise((resolve) => setTimeout(resolve, 150));
    router.push("/project");
  };

  return (
    <div className="app-shell">
      <main className="qualification-container">
        <header className="topbar">
          <div>
            <h1>Clinical Evaluation</h1>
          </div>

          <StageControls
            onPrev={() => router.push("/risk-management")}
            onSaveDraft={saveDraft}
            onBackToProject={backToProject}
            onFinish={finishStage}
            finishDisabled={isCompleted && !isDirty}
          />
        </header>

        <div className="page-container">
          <div className="page-header">
            <span className="step-label">STEP 06 · CLINICAL EVALUATION</span>
            <h2>Clinical evidence and evaluation</h2>
            <p>
              Summarise the clinical evidence supporting the safety and
              performance of the device.
            </p>
          </div>

          <section className="form-card">
            <div className="form-field">
              <label htmlFor="clinical-evaluation-notes">
                Clinical evaluation summary
              </label>
              <textarea
                id="clinical-evaluation-notes"
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setIsDirty(true);
                }}
                rows={8}
                placeholder="Summarise the clinical evidence, evaluation methods and conclusions..."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
