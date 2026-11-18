"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  saveStageAndComplete,
  saveStageInProgress,
} from "@/lib/project-store";
import StageControls from "@/components/StageControls";

type QuestionOption = { value: string; label: string; description?: string };

type Question = {
  id: string;
  title: string;
  description?: string;
  options: QuestionOption[];
};

const questions: Question[] = [
  {
    id: "diagnostic",
    title: "Is the device intended for diagnostic or monitoring purposes?",
    description: "Determine if the output is used for diagnosis or monitoring.",
    options: [
      { value: "yes", label: "YES" },
      { value: "no", label: "NO" },
      { value: "unknown", label: "UNKNOWN" },
    ],
  },
  {
    id: "clinical-decision",
    title: "Can the output be used for clinical decision-making?",
    options: [
      { value: "yes", label: "YES" },
      { value: "no", label: "NO" },
    ],
  },
];

type AnswerMap = Record<string, string>;

export default function ClassificationPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const saved = getProject()?.classification;
    if (!saved) return;

    const timer = window.setTimeout(() => {
      const savedAnswers = saved.answers ?? {};
      setAnswers(savedAnswers);
      setShowResult(
        saved.completed || questions.every((item) => !!savedAnswers[item.id]),
      );

      const firstUnanswered = questions.findIndex(
        (item) => !savedAnswers[item.id],
      );
      setCurrent(firstUnanswered < 0 ? questions.length - 1 : firstUnanswered);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const question = questions[current];

  const answerQuestion = (value: string) =>
    setAnswers((p) => ({ ...p, [question.id]: value }));

  const nextQuestion = () => {
    if (!answers[question.id]) return;
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else setShowResult(true);
  };

  const previousQuestion = () => setCurrent((c) => Math.max(0, c - 1));

  const determineClassification = () => {
    const diagnostic = answers["diagnostic"] === "yes";
    const clinicalDecision = answers["clinical-decision"] === "yes";

    if (clinicalDecision && diagnostic)
      return { classification: "Class IIa", rule: "Rule 11" };
    if (diagnostic)
      return { classification: "Further assessment", rule: "Annex VIII" };
    return { classification: "Class I", rule: "General" };
  };

  const finishStage = async () => {
    const allAnswered = questions.every((q) => !!answers[q.id]);
    if (!allAnswered) {
      window.alert(
        "Please complete the classification assessment before finishing this stage.",
      );
      return;
    }

    const result = determineClassification();
    const classificationData = {
      answers,
      result,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    saveStageAndComplete("classification", classificationData);

    await new Promise((res) => setTimeout(res, 150));
    router.push("/project");
  };

  const saveDraft = () => {
    const data = { answers, timestamp: new Date().toISOString() };
    saveStageInProgress("classification", data);
  };

  const backToProject = async () => {
    saveDraft();
    await new Promise((res) => setTimeout(res, 150));
    router.push("/project");
  };

  const saveAndContinue = async () => {
    const result = determineClassification();
    const classificationData = {
      answers,
      result,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    saveStageAndComplete("classification", classificationData);

    await new Promise((res) => setTimeout(res, 150));
    router.push("/requirements");
  };

  if (showResult) {
    const result = determineClassification();

    return (
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">MDR</div>
            <div>
              <div className="brand-name">MDR Navigator</div>
              <div className="brand-subtitle">Certification Platform</div>
            </div>
          </div>

          <StageControls
            onDashboard={() => router.push("/")}
            onSaveDraft={saveDraft}
            onBackToProject={backToProject}
            onFinish={finishStage}
            onPrimary={saveAndContinue}
            primaryLabel="Continue to Requirements →"
          />
        </header>

        <main className="qualification-container">
          <div className="result-card">
            <div className="result-icon">✓</div>

            <span className="setup-label">STEP 03 · CLASSIFICATION</span>

            <h1>Classification assessment completed</h1>

            <p>Preliminary classification computed from your answers.</p>

            <div className="qualification-result">
              <div>
                <span>Preliminary classification</span>

                <strong>{result.classification}</strong>
              </div>
            </div>

            <div className="result-actions">
              <button
                className="secondary-button"
                onClick={() => setShowResult(false)}
              >
                ← Review answers
              </button>

              <button className="primary-button" onClick={saveAndContinue}>
                Continue to Requirements →
              </button>

              <button className="secondary-button" onClick={finishStage}>
                Finish stage
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">MDR</div>

          <div>
            <div className="brand-name">MDR Navigator</div>

            <div className="brand-subtitle">Certification Platform</div>
          </div>
        </div>

        <StageControls
          onPrev={() => router.push("/qualification")}
          onSaveDraft={saveDraft}
          onBackToProject={backToProject}
        />
      </header>

      <main className="qualification-container">
        <div className="qualification-header">
          <span className="setup-label">STEP 03 · CLASSIFICATION</span>

          <h1>Medical Device Classification</h1>

          <p>
            Walk through a short assessment to derive a preliminary
            classification.
          </p>
        </div>

        <div className="question-card">
          <div className="question-number">QUESTION {current + 1}</div>

          <h2>{question.title}</h2>

          {question.description && (
            <p className="question-description">{question.description}</p>
          )}

          <div className="answer-buttons">
            {question.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`answer-button ${answers[question.id] === option.value ? "selected" : ""}`}
                onClick={() => answerQuestion(option.value)}
              >
                <div>
                  <strong>{option.label}</strong>

                  {option.description && <span>{option.description}</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="question-actions">
            <button
              type="button"
              className="secondary-button"
              disabled={current === 0}
              onClick={previousQuestion}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={!answers[question.id]}
              onClick={nextQuestion}
            >
              {current === questions.length - 1
                ? "Complete assessment"
                : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
