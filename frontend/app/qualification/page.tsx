"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProject,
  saveStageAndComplete,
  saveStageInProgress,
} from "@/lib/project-store";
import StageControls from "@/components/StageControls";

type Answer = string | null;

type QuestionOption = {
  value: string;
  label: string;
  description?: string;
};

type Question = {
  id: string;
  category: string;
  title: string;
  description: string;
  legalBasis: string;
  options: QuestionOption[];
  allowCustomInput?: boolean;
  customInputLabel?: string;
  customInputPlaceholder?: string;
};

const questions: Question[] = [
  {
    id: "medical-purpose",
    category: "Regulatory qualification",
    title: "Je výrobok výrobcom určený na medicínsky účel?",
    description:
      "Posúďte, či výrobca určil výrobku medicínsky účel podľa MDR, napríklad diagnostiku, prevenciu, monitorovanie, predikciu, prognózu, liečbu alebo zmiernenie ochorenia či poranenia.",
    legalBasis: "MDR, článok 2 – definícia zdravotníckej pomôcky",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description: "Výrobok má výrobcom deklarovaný medicínsky účel.",
      },
      {
        value: "no",
        label: "NIE",
        description: "Výrobok nemá deklarovaný medicínsky účel.",
      },
    ],
  },

  {
    id: "software",
    category: "Software qualification",
    title: "Je predmetom posúdenia softvér?",
    description:
      "Určte, či je posudzovaným výrobkom softvér alebo softvérová funkcionalita, ktorá má byť uvedená na trh alebo používaná v rámci zdravotníckej pomôcky.",
    legalBasis: "MDR, článok 2; MDCG 2019-11 Rev.1",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description:
          "Predmetom posúdenia je softvér alebo softvérová funkcionalita.",
      },
      {
        value: "no",
        label: "NIE",
        description: "Predmetom posúdenia nie je softvér.",
      },
    ],
  },

  {
    id: "medical-function",
    category: "Software qualification",
    title: "Vykonáva softvér funkciu s medicínskym účelom?",
    description:
      "Posúďte, či softvér vykonáva funkciu určenú na diagnostiku, prevenciu, monitorovanie, predikciu, prognózu, liečbu alebo zmiernenie ochorenia či iného zdravotného stavu.",
    legalBasis:
      "MDCG 2019-11 Rev.1 – Qualification and Classification of Software",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description: "Softvér vykonáva funkciu s medicínskym účelom.",
      },
      {
        value: "no",
        label: "NIE",
        description: "Softvér nevykonáva funkciu s medicínskym účelom.",
      },
    ],
  },

  {
    id: "software-use",
    category: "Software configuration",
    title: "Ako je softvér používaný v rámci systému?",
    description:
      "Vyberte spôsob, akým je softvér implementovaný a používaný v súvislosti so zdravotníckou pomôckou.",
    legalBasis: "MDR, článok 2; MDCG 2019-11 Rev.1",
    options: [
      {
        value: "standalone",
        label: "Samostatný softvér",
        description:
          "Softvér môže vykonávať svoj určený účel bez toho, aby bol súčasťou inej zdravotníckej pomôcky.",
      },
      {
        value: "integrated",
        label: "Integrovaný softvér",
        description:
          "Softvér je súčasťou alebo komponentom inej zdravotníckej pomôcky.",
      },
      {
        value: "accessory",
        label: "Doplnkový softvér",
        description:
          "Softvér poskytuje doplnkovú funkcionalitu v spojení s inou zdravotníckou pomôckou.",
      },
    ],
  },

  {
    id: "clinical-decision",
    category: "Clinical impact",
    title: "Používa sa výstup softvéru na podporu klinického rozhodovania?",
    description:
      "Posúďte, či výstup systému používa zdravotnícky pracovník alebo iný oprávnený používateľ ako podklad pre diagnostické, terapeutické alebo iné klinické rozhodnutie.",
    legalBasis: "MDR, príloha I; MDCG 2019-11 Rev.1",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description:
          "Výstup môže byť použitý ako podklad pre klinické rozhodnutie.",
      },
      {
        value: "no",
        label: "NIE",
        description: "Výstup nie je určený na podporu klinického rozhodovania.",
      },
    ],
  },

  {
    id: "ai-output",
    category: "AI functionality",
    title: "Aký typ výstupu poskytuje AI systém?",
    description:
      "Vyberte hlavný typ výsledku, ktorý AI systém vytvára na základe spracovaných vstupných údajov. Ak výstup nezodpovedá žiadnej z uvedených kategórií, vyberte možnosť „Iný typ výstupu“ a jeho charakter špecifikujte.",
    legalBasis: "MDR, príloha I; MDR, príloha VIII; relevantné MDCG guidance",
    allowCustomInput: true,
    customInputLabel: "Špecifikujte typ výstupu",
    customInputPlaceholder: "Opíšte, aký výstup AI systém generuje...",
    options: [
      {
        value: "classification",
        label: "Klasifikácia alebo kategorizácia",
      },
      {
        value: "prediction",
        label: "Predikcia alebo prognóza",
      },
      {
        value: "detection",
        label: "Detekcia alebo lokalizácia",
      },
      {
        value: "measurement",
        label: "Meranie alebo kvantifikácia",
      },
      {
        value: "recommendation",
        label: "Generovanie odporúčania",
      },
      {
        value: "text",
        label: "Generovanie textu alebo správy",
      },
      {
        value: "visualization",
        label: "Spracovanie alebo vizualizácia údajov",
      },
      {
        value: "other",
        label: "Iný typ výstupu",
      },
    ],
  },

  {
    id: "health-data",
    category: "Data processing",
    title: "Spracúva softvér údaje súvisiace so zdravím pacienta?",
    description:
      "Určte, či systém spracúva údaje, ktoré súvisia so zdravotným stavom, diagnostikou, liečbou, monitorovaním alebo iným aspektom zdravotného stavu pacienta.",
    legalBasis:
      "MDR, článok 2; relevantné požiadavky MDR na bezpečnosť a klinické hodnotenie",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description: "Systém spracúva údaje súvisiace so zdravím pacienta.",
      },
      {
        value: "no",
        label: "NIE",
        description: "Systém nespracúva údaje súvisiace so zdravím pacienta.",
      },
    ],
  },

  {
    id: "clinical-impact-risk",
    category: "Risk indication",
    title: "Môže mať nesprávny výstup softvéru vplyv na klinické rozhodnutie?",
    description:
      "Posúďte, či nesprávny, nepresný alebo oneskorený výstup systému môže viesť k nesprávnemu klinickému rozhodnutiu alebo ovplyvniť zdravotnú starostlivosť.",
    legalBasis: "MDR, príloha I; ISO 14971:2019",
    options: [
      {
        value: "yes",
        label: "ÁNO",
        description:
          "Nesprávny výstup môže ovplyvniť klinické rozhodnutie alebo zdravotnú starostlivosť.",
      },
      {
        value: "no",
        label: "NIE",
        description:
          "Nesprávny výstup nemá predpokladaný vplyv na klinické rozhodovanie.",
      },
      {
        value: "unknown",
        label: "NIE JE ZNÁME",
        description: "Vplyv zatiaľ nebol dostatočne posúdený.",
      },
    ],
  },
];

export default function QualificationPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>(
    {},
  );
  const [showResult, setShowResult] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const saved = getProject()?.qualification;
    if (!saved) return;

    const timer = window.setTimeout(() => {
      const savedAnswers = saved.answers ?? {};
      setAnswers(savedAnswers);
      setCustomAnswers(saved.customAnswers ?? {});
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

  const answerQuestion = (value: string) => {
    setIsDirty(true);
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));

    if (value === "other") {
      return;
    }

    if (current === questions.length - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 250);
      return;
    }

    setTimeout(() => {
      setCurrent((previous) => previous + 1);
    }, 250);
  };

  const continueQuestion = () => {
    if (
      question.id === "ai-output" &&
      answers[question.id] === "other" &&
      !customAnswers[question.id]?.trim()
    ) {
      return;
    }

    if (current === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrent((previous) => previous + 1);
  };

  const reviewAnswers = () => {
    setCurrent(0);
    setShowResult(false);
  };

  const saveQualification = () => {
    const project = getProject();

    const qualification = {
      project,
      answers,
      customAnswers,
      completed: true,

      result: {
        mdrRelevant: answers["medical-purpose"] === "yes",
        software: answers["software"] === "yes",
        medicalSoftware: answers["medical-function"] === "yes",
        softwareConfiguration: answers["software-use"] || null,
        clinicalDecisionSupport: answers["clinical-decision"] === "yes",
        aiOutput: answers["ai-output"] || null,
        aiOutputDescription: customAnswers["ai-output"] || null,
        healthData: answers["health-data"] === "yes",
        clinicalImpact: answers["clinical-impact-risk"] || null,
      },

      timestamp: new Date().toISOString(),
    };

    // persist legacy key for compatibility
    localStorage.setItem("mdr-qualification", JSON.stringify(qualification));

    // also save into project-scoped storage
    saveStageAndComplete("qualification", {
      answers,
      customAnswers,
      result: qualification.result,
      timestamp: qualification.timestamp,
    });
    setIsDirty(false);

    router.push("/classification");
  };

  const saveDraft = () => {
    if (!isDirty && getProject()?.qualification?.completed) return;

    const payload = {
      answers,
      customAnswers,
      timestamp: new Date().toISOString(),
    };

    saveStageInProgress("qualification", payload);
    setIsDirty(false);
  };

  const backToProject = async () => {
    saveDraft();
    await new Promise((res) => setTimeout(res, 150));
    router.push("/project");
  };

  const finishStage = async () => {
    // validate: require answers for all questions and custom inputs when requested
    const allAnswered = questions.every((q) => {
      const a = answers[q.id];
      if (!a) return false;
      if (q.allowCustomInput && a === "other") {
        return !!customAnswers[q.id]?.trim();
      }
      return true;
    });

    if (!allAnswered) {
      window.alert(
        "Please answer all qualification questions before finishing this stage.",
      );
      return;
    }

    // atomically persist qualification and mark complete
    const payload = {
      answers,
      customAnswers,
      result: {
        mdrRelevant: answers["medical-purpose"] === "yes",
        software: answers["software"] === "yes",
        medicalSoftware: answers["medical-function"] === "yes",
        softwareConfiguration: answers["software-use"] || null,
        clinicalDecisionSupport: answers["clinical-decision"] === "yes",
        aiOutput: answers["ai-output"] || null,
        aiOutputDescription: customAnswers["ai-output"] || null,
        healthData: answers["health-data"] === "yes",
        clinicalImpact: answers["clinical-impact-risk"] || null,
      },
      timestamp: new Date().toISOString(),
    };

    saveStageAndComplete("qualification", payload);
    setIsDirty(false);

    // refresh local UI from persisted project
    try {
      const proj = getProject();
      if (proj?.qualification) {
        setAnswers(proj.qualification.answers || {});
        setCustomAnswers(proj.qualification.customAnswers || {});
        setShowResult(true);
      }
    } catch {}

    await new Promise((res) => setTimeout(res, 200));
    // navigate back to projects dashboard
    router.push("/project");
  };

  if (showResult) {
    const medicalPurpose = answers["medical-purpose"] === "yes";
    const software = answers["software"] === "yes";
    const medicalFunction = answers["medical-function"] === "yes";
    const clinicalImpact = answers["clinical-impact-risk"] === "yes";

    return (
      <div className="qualification-page">
        <header className="setup-header">
          <div className="setup-brand">
            <div className="brand-icon">MDR</div>

            <div>
              <strong>MDR Navigator</strong>
              <span>Certification Platform</span>
            </div>
          </div>

          <StageControls
            onDashboard={() => router.push("/")}
            onSaveDraft={saveDraft}
            onBackToProject={backToProject}
            onFinish={finishStage}
            onPrimary={saveQualification}
            primaryLabel="Continue to Classification →"
            finishDisabled={
              !isDirty && getProject()?.qualification?.completed === true
            }
          />
        </header>

        <main className="qualification-container">
          <div className="result-card">
            <div className="result-icon">✓</div>

            <span className="setup-label">REGULATORY QUALIFICATION</span>

            <h1>Qualification assessment completed</h1>

            <p>
              Aplikácia spracovala odpovede zadané používateľom a vytvorila
              predbežný regulačný profil posudzovaného výrobku.
            </p>

            <div className="qualification-summary">
              <div className="summary-item">
                <span>Medical purpose</span>
                <strong>{medicalPurpose ? "Yes" : "No"}</strong>
              </div>

              <div className="summary-item">
                <span>Software</span>
                <strong>{software ? "Yes" : "No"}</strong>
              </div>

              <div className="summary-item">
                <span>Medical function</span>
                <strong>{medicalFunction ? "Yes" : "No"}</strong>
              </div>

              <div className="summary-item">
                <span>Clinical impact</span>
                <strong>
                  {clinicalImpact ? "Potential impact" : "Not indicated"}
                </strong>
              </div>
            </div>

            <section className="saved-answers-section">
              <h2>Vaše odpovede</h2>
              <div className="qualification-summary saved-answers">
                {questions.map((item, index) => {
                  const selectedOption = item.options.find(
                    (option) => option.value === answers[item.id],
                  );
                  const customAnswer = customAnswers[item.id];

                  return (
                    <div className="summary-item saved-answer" key={item.id}>
                      <div className="saved-answer-content">
                        <p className="saved-answer-question">{item.title}</p>
                        <strong>
                          {selectedOption?.label ?? "Nezodpovedané"}
                        </strong>
                        {customAnswer && (
                          <p className="saved-answer-custom">{customAnswer}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setCurrent(index);
                          setShowResult(false);
                        }}
                      >
                        Upraviť
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="qualification-result">
              <div>
                <span>Preliminary regulatory status</span>

                <strong>
                  {medicalPurpose && software && medicalFunction
                    ? "Potential MDR medical device software"
                    : "Further regulatory assessment required"}
                </strong>
              </div>
            </div>

            <div className="result-warning">
              <strong>Regulatory verification required</strong>

              <p>
                Výsledok predstavuje predbežné regulačné posúdenie vytvorené na
                základe zadaných údajov. Nenahrádza odborné regulačné, právne,
                klinické ani certifikačné posúdenie.
              </p>
            </div>

            <div className="result-actions">
              <button className="secondary-button" onClick={reviewAnswers}>
                ← Upraviť odpovede
              </button>

              <button
                className="secondary-button"
                onClick={finishStage}
                disabled={
                  !isDirty && getProject()?.qualification?.completed === true
                }
                title="Mark this stage as finished"
              >
                {getProject()?.qualification?.completed
                  ? "Finished ✓"
                  : "Finish stage"}
              </button>

              <button className="primary-button" onClick={saveQualification}>
                Continue to Classification →
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="qualification-page">
      <header className="setup-header">
        <div className="setup-brand">
          <div className="brand-icon">MDR</div>

          <div>
            <strong>MDR Navigator</strong>
            <span>Certification Platform</span>
          </div>
        </div>

        <StageControls
          onPrev={() => router.push("/project")}
          onSaveDraft={saveDraft}
          onBackToProject={backToProject}
          onFinish={finishStage}
          finishDisabled={
            !isDirty && getProject()?.qualification?.completed === true
          }
        />
      </header>

      <main className="qualification-container">
        <div className="qualification-header">
          <span className="setup-label">
            STEP 01 · REGULATORY QUALIFICATION
          </span>

          <h1>Regulatory Qualification</h1>

          <p>
            Táto časť slúži na predbežné určenie, či posudzovaný výrobok môže
            patriť do pôsobnosti MDR a či vykazuje charakteristiky
            zdravotníckeho softvéru.
          </p>
        </div>

        <div className="qualification-progress">
          <div>
            <span>Assessment progress</span>

            <strong>
              {current + 1} / {questions.length}
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="question-card">
          <div className="question-number">QUESTION {current + 1}</div>

          <h2>{question.title}</h2>

          <p className="question-description">{question.description}</p>

          <div className="legal-basis">
            <span>Regulatory basis</span>
            <strong>{question.legalBasis}</strong>
          </div>

          <div className="answer-buttons">
            {question.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`answer-button ${
                  answers[question.id] === option.value ? "selected" : ""
                }`}
                onClick={() => answerQuestion(option.value)}
              >
                <span className="answer-icon">
                  {option.value === "yes"
                    ? "✓"
                    : option.value === "no"
                      ? "×"
                      : "?"}
                </span>

                <div>
                  <strong>{option.label}</strong>

                  {option.description && <span>{option.description}</span>}
                </div>
              </button>
            ))}
          </div>

          {question.allowCustomInput && answers[question.id] === "other" && (
            <div className="custom-answer">
              <label htmlFor="custom-output">{question.customInputLabel}</label>

              <textarea
                id="custom-output"
                value={customAnswers[question.id] || ""}
                onChange={(event) =>
                  {
                    setIsDirty(true);
                    setCustomAnswers((previous) => ({
                      ...previous,
                      [question.id]: event.target.value,
                    }));
                  }
                }
                placeholder={question.customInputPlaceholder}
                rows={4}
              />

              <small>
                Uveďte konkrétny typ výstupu a stručne opíšte, akú informáciu
                systém používateľovi poskytuje.
              </small>

              <button
                type="button"
                className="primary-button continue-button"
                onClick={continueQuestion}
                disabled={!customAnswers[question.id]?.trim()}
              >
                Continue →
              </button>
            </div>
          )}

          <div className="question-footer">
            <span>
              Odpoveď bude uložená ako súčasť regulačného posúdenia projektu.
            </span>

            {current > 0 && (
              <button
                type="button"
                className="text-button"
                onClick={() => setCurrent((previous) => previous - 1)}
              >
                ← Previous question
              </button>
            )}
          </div>
        </div>

        <div className="regulatory-note">
          <span>⚖</span>

          <div>
            <strong>Regulatory information</strong>

            <p>
              Tento nástroj je určený na navigáciu používateľa regulačným
              procesom. Výsledky predstavujú predbežné posúdenie a nenahrádzajú
              odborné regulačné, právne, klinické alebo certifikačné
              rozhodnutie.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
