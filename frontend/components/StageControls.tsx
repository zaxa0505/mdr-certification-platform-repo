"use client";

import React, { useState } from "react";

type Props = {
  onDashboard?: () => void;
  onPrev?: () => void;
  onSaveDraft: () => void | Promise<void>;
  onBackToProject: () => void;
  onFinish?: () => void;
  onPrimary?: () => void;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  finishDisabled?: boolean;
  prevLabel?: string;
};

export default function StageControls({
  onDashboard,
  onPrev,
  onSaveDraft,
  onBackToProject,
  onFinish,
  onPrimary,
  primaryLabel = "Save & Continue →",
  primaryDisabled = false,
  finishDisabled = false,
  prevLabel = "← Previous",
}: Props) {
  const [saveMessage, setSaveMessage] = useState("");

  const saveDraft = async () => {
    try {
      await onSaveDraft();
      setSaveMessage("Draft saved ✓");
    } catch (error) {
      console.error("Unable to save draft.", error);
      setSaveMessage("Unable to save draft");
    }

    window.setTimeout(() => setSaveMessage(""), 3000);
  };

  return (
    <div className="stage-controls">
      {onDashboard && (
        <button className="secondary-button" onClick={onDashboard}>
          Dashboard
        </button>
      )}

      {onPrev && (
        <button className="secondary-button" onClick={onPrev}>
          {prevLabel}
        </button>
      )}

      <button className="secondary-button" onClick={saveDraft}>
        {saveMessage || "Save draft"}
      </button>

      <button className="secondary-button" onClick={onBackToProject}>
        Back to project
      </button>

      {onFinish && (
        <button
          className="secondary-button"
          onClick={onFinish}
          disabled={finishDisabled}
        >
          Finish stage
        </button>
      )}

      {onPrimary && (
        <button
          className="primary-button"
          onClick={onPrimary}
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}
