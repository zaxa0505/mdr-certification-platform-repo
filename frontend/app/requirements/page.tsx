"use client";

import { useRouter } from "next/navigation";
import { saveStageAndComplete, saveStageInProgress } from "@/lib/project-store";
import StageControls from "@/components/StageControls";

export default function RequirementsPage() {
  const router = useRouter();

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
          onSaveDraft={() =>
            saveStageInProgress("requirements", {
              timestamp: new Date().toISOString(),
            })
          }
          onBackToProject={async () => {
            saveStageInProgress("requirements", {
              timestamp: new Date().toISOString(),
            });
            await new Promise((res) => setTimeout(res, 150));
            router.push("/project");
          }}
          onPrimary={async () => {
            saveStageAndComplete("requirements", {
              timestamp: new Date().toISOString(),
            });
            await new Promise((res) => setTimeout(res, 150));
            router.push("/risk-management");
          }}
          primaryLabel="Continue →"
          onFinish={async () => {
            saveStageAndComplete("requirements", {
              timestamp: new Date().toISOString(),
            });
            await new Promise((res) => setTimeout(res, 150));
            router.push("/project");
          }}
        />
      </header>

      <main className="qualification-container">
        <div className="qualification-header">
          <span className="setup-label">STEP 04 · APPLICABLE REQUIREMENTS</span>

          <h1>Applicable Requirements</h1>

          <p>
            Na základe predchádzajúcich krokov aplikácia identifikuje regulačné
            požiadavky relevantné pre posudzovanú zdravotnícku pomôcku.
          </p>
        </div>

        <div className="question-card">
          <div className="question-number">NEXT STAGE</div>

          <h2>Regulatory requirements</h2>

          <p className="question-description">
            Táto časť bude obsahovať automaticky identifikované požiadavky MDR,
            relevantné prílohy, klasifikačné pravidlá a ďalšie dokumenty
            potrebné pre pokračovanie certifikačného procesu.
          </p>

          <div className="legal-basis">
            <span>Regulatory framework</span>

            <button
              className="secondary-button"
              onClick={() => router.push("/classification")}
            >
              ← Classification
            </button>

            <button
              className="primary-button"
              onClick={async () => {
                saveStageAndComplete("requirements", {
                  timestamp: new Date().toISOString(),
                });
                await new Promise((res) => setTimeout(res, 150));
                router.push("/risk-management");
              }}
            >
              Continue →
            </button>

            <button
              className="secondary-button"
              onClick={async () => {
                saveStageAndComplete("requirements", {
                  timestamp: new Date().toISOString(),
                });
                await new Promise((res) => setTimeout(res, 150));
                router.push("/project");
              }}
            >
              Finish stage
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
