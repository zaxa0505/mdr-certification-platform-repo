import type {
  ProjectData,
  RiskIdentificationPromptId,
  RiskBenefitAnalysis,
  RiskManagementPlan,
  RiskRecord,
} from "./project-store";

export const RISK_IDENTIFICATION_PROMPTS: Array<{
  id: RiskIdentificationPromptId;
  title: string;
  description: string;
}> = [
  {
    id: "algorithm-output",
    title: "Incorrect or incomplete algorithm output",
    description:
      "Consider whether outputs could be incorrect, incomplete, delayed or unavailable for the intended use.",
  },
  {
    id: "diagnostic-support",
    title: "Incorrect classification, prediction or diagnostic support",
    description:
      "Consider errors in classification, prediction, prioritisation or diagnostic support and their possible consequences.",
  },
  {
    id: "input-data",
    title: "Input data quality and representativeness",
    description:
      "Consider data quality, missing or corrupted inputs, population coverage and representativeness for intended users and patients.",
  },
  {
    id: "model-generalisation",
    title: "Insufficient model generalisation",
    description:
      "Consider performance changes across sites, populations, workflows, devices or other intended-use conditions.",
  },
  {
    id: "systematic-bias",
    title: "Systematic errors or biased results",
    description:
      "Consider systematic error patterns or unequal performance that could affect clinical decisions or patient groups.",
  },
  {
    id: "output-interpretation",
    title: "Incorrect interpretation of output",
    description:
      "Consider whether healthcare professionals could misunderstand the output, limitations, confidence or intended role.",
  },
  {
    id: "automation-bias",
    title: "Automation bias",
    description:
      "Consider over-reliance on system outputs or reduced independent review by users.",
  },
  {
    id: "model-updates",
    title: "Change in model behaviour after an update",
    description:
      "Consider unintended performance or behaviour changes following software, model, configuration or data updates.",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity threats",
    description:
      "Consider security-related events that could affect device safety, essential performance, data integrity or availability.",
  },
  {
    id: "availability-data-loss",
    title: "System unavailability or data loss",
    description:
      "Consider service interruption, loss, corruption or delayed access to data needed for safe operation or care.",
  },
  {
    id: "use-error-misuse",
    title: "Use error or reasonably foreseeable misuse",
    description:
      "Consider user-interface, workflow, training or foreseeable misuse conditions that could lead to a hazardous situation.",
  },
  {
    id: "interoperability-transfer",
    title: "Interoperability or data-transfer problems",
    description:
      "Consider incompatible formats, incorrect mapping, transmission errors or loss of meaning when exchanging data.",
  },
];

export const EMPTY_RISK_PLAN: RiskManagementPlan = {
  deviceIdentification: "",
  scope: "",
  lifecycleStages: "",
  rolesAndResponsibilities: "",
  personnelCompetence: "",
  riskEvaluationMethod: "",
  riskAcceptabilityCriteria: "",
  controlVerificationApproach: "",
  controlEffectivenessApproach: "",
  lifecycleReviewPlan: "",
  reviewTriggers: "",
  approver: "",
  approvalDate: "",
  version: "1.0",
};

export const EMPTY_RISK_BENEFIT_ANALYSIS: RiskBenefitAnalysis = {
  clinicalBenefits: "",
  clinicalBenefitEvidence: "",
  evidenceReferences: [],
  residualRiskAssessment: "",
  benefitRiskComparison: "",
  conclusion: "not-assessed",
  acceptabilityRationale: "",
  approvalStatus: "draft",
  approver: "",
  approvalDate: "",
};

const PLAN_REQUIRED_FIELDS: Array<{
  key: keyof RiskManagementPlan;
  label: string;
}> = [
  { key: "deviceIdentification", label: "Device identification" },
  { key: "scope", label: "Scope and device configuration" },
  { key: "lifecycleStages", label: "Lifecycle stages" },
  { key: "rolesAndResponsibilities", label: "Roles and responsibilities" },
  { key: "personnelCompetence", label: "Personnel competence" },
  { key: "riskEvaluationMethod", label: "Risk estimation method" },
  { key: "riskAcceptabilityCriteria", label: "Risk acceptability criteria" },
  {
    key: "controlVerificationApproach",
    label: "Risk control and verification approach",
  },
  {
    key: "controlEffectivenessApproach",
    label: "Risk control effectiveness verification",
  },
  { key: "lifecycleReviewPlan", label: "Risk review across the lifecycle" },
  { key: "reviewTriggers", label: "Review and update triggers" },
  { key: "approver", label: "Plan owner / approver" },
];

export function createRiskRecord(
  sourcePromptId?: RiskIdentificationPromptId,
): RiskRecord {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `risk-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    hazard: "",
    ...(sourcePromptId ? { sourcePromptId } : {}),
    foreseeableSequence: "",
    hazardousSituation: "",
    harm: "",
    initialSeverity: null,
    initialProbability: null,
    initialRiskEvaluation: "",
    initialCriteriaComparison: "",
    initialRationale: "",
    riskControls: "",
    inherentlySafeDesign: "",
    inherentlySafeDesignStatus: "not-assessed",
    protectiveMeasures: "",
    protectiveMeasuresStatus: "not-assessed",
    safetyInformationTraining: "",
    safetyInformationTrainingStatus: "not-assessed",
    controlOwner: "",
    controlVerification: "",
    controlImplementationStatus: "not-assessed",
    controlEffectivenessVerification: "",
    controlEffectivenessStatus: "not-assessed",
    controlIntroducedRisks: "",
    evidenceReferences: [],
    residualSeverity: null,
    residualProbability: null,
    residualRiskEvaluation: "",
    residualCriteriaComparison: "",
    residualDecision: "not-assessed",
    residualRationale: "",
    residualUserInformation: "",
    benefitRiskRationale: "",
    assessor: "",
    updatedAt: new Date().toISOString(),
  };
}

function isBlank(value: string | number | null | undefined) {
  return value === null || value === undefined || !String(value).trim();
}

export function getRiskManagementReadiness(project: ProjectData | null) {
  const stage = project?.riskManagement;
  const plan = stage?.plan ?? EMPTY_RISK_PLAN;
  const missingPlan = PLAN_REQUIRED_FIELDS.filter((field) =>
    isBlank(plan[field.key]),
  ).map((field) => field.label);
  const risks = stage?.risks ?? [];
  const missingRisks = risks.flatMap((risk, index) => {
    const missing: string[] = [];
    if (isBlank(risk.hazard)) missing.push("hazard");
    if (isBlank(risk.foreseeableSequence)) missing.push("sequence of events");
    if (isBlank(risk.hazardousSituation)) missing.push("hazardous situation");
    if (isBlank(risk.harm)) missing.push("harm");
    if (typeof risk.initialSeverity === "number") {
      missing.push(
        "review and re-enter initial severity using the manufacturer's method",
      );
    } else if (isBlank(risk.initialSeverity)) {
      missing.push("initial severity");
    }
    if (typeof risk.initialProbability === "number") {
      missing.push(
        "review and re-enter initial probability using the manufacturer's method",
      );
    } else if (isBlank(risk.initialProbability)) {
      missing.push("initial probability per the manufacturer's method");
    }
    if (isBlank(risk.initialRiskEvaluation)) {
      missing.push("initial risk evaluation");
    }
    if (isBlank(risk.initialCriteriaComparison)) {
      missing.push("comparison with the acceptability criteria");
    }
    if (isBlank(risk.initialRationale)) {
      missing.push("initial assessment rationale and assumptions");
    }
    if (isBlank(risk.riskControls)) {
      missing.push("risk control selection and rationale");
    }
    if (isBlank(risk.inherentlySafeDesign)) {
      missing.push("safe design measures or reason not applied");
    }
    if (!risk.inherentlySafeDesignStatus || risk.inherentlySafeDesignStatus === "not-assessed") {
      missing.push("safe design measure status");
    }
    if (isBlank(risk.protectiveMeasures)) {
      missing.push("protective measures or reason not applied");
    }
    if (!risk.protectiveMeasuresStatus || risk.protectiveMeasuresStatus === "not-assessed") {
      missing.push("protective measure status");
    }
    if (isBlank(risk.safetyInformationTraining)) {
      missing.push("safety information/training or reason not applied");
    }
    if (
      !risk.safetyInformationTrainingStatus ||
      risk.safetyInformationTrainingStatus === "not-assessed"
    ) {
      missing.push("safety information/training status");
    }
    if (isBlank(risk.controlOwner)) {
      missing.push("responsibility for risk control measures");
    }
    if (isBlank(risk.controlVerification)) {
      missing.push("risk control implementation verification");
    }
    if (
      !risk.controlImplementationStatus ||
      risk.controlImplementationStatus === "not-assessed"
    ) {
      missing.push("risk control implementation status");
    }
    if (isBlank(risk.controlEffectivenessVerification)) {
      missing.push("risk control effectiveness verification");
    }
    if (
      !risk.controlEffectivenessStatus ||
      risk.controlEffectivenessStatus === "not-assessed"
    ) {
      missing.push("risk control effectiveness status");
    }
    if (isBlank(risk.controlIntroducedRisks)) {
      missing.push("assessment of new risks introduced by controls");
    }
    if (typeof risk.residualSeverity === "number") {
      missing.push(
        "review and re-enter residual severity using the manufacturer's method",
      );
    } else if (isBlank(risk.residualSeverity)) {
      missing.push("residual severity");
    }
    if (typeof risk.residualProbability === "number") {
      missing.push(
        "review and re-enter residual probability using the manufacturer's method",
      );
    } else if (isBlank(risk.residualProbability)) {
      missing.push("residual probability per the manufacturer's method");
    }
    if (isBlank(risk.residualRiskEvaluation)) {
      missing.push("residual risk evaluation");
    }
    if (isBlank(risk.residualCriteriaComparison)) {
      missing.push("comparison of residual risk with the acceptability criteria");
    }
    if (risk.residualDecision === "not-assessed") {
      missing.push("manufacturer's residual risk decision");
    } else if (
      risk.residualDecision !== "acceptable" &&
      risk.residualDecision !== "benefit-risk-justified"
    ) {
      missing.push(
        `Risk ${index + 1}: unresolved manufacturer decision (${risk.residualDecision})`,
      );
    }
    if (isBlank(risk.residualRationale)) {
      missing.push("residual risk acceptability rationale and justification");
    }
    if (isBlank(risk.residualUserInformation)) {
      missing.push("information to provide to users for the residual risk");
    }
    if (
      risk.residualDecision === "benefit-risk-justified" &&
      isBlank(risk.benefitRiskRationale)
    ) {
      missing.push("benefit-risk justification");
    }
    if (isBlank(risk.assessor)) missing.push("assessor");
    return missing.map((field) => `Risk ${index + 1}: ${field}`);
  });

  const missingRegister =
    risks.length === 0 ? ["Add at least one risk scenario."] : missingRisks;
  const benefitRiskAnalysis =
    stage?.benefitRiskAnalysis ?? EMPTY_RISK_BENEFIT_ANALYSIS;
  const missingBenefitRiskAnalysis: string[] = [];
  if (isBlank(benefitRiskAnalysis.clinicalBenefits)) {
    missingBenefitRiskAnalysis.push("Identify the device's clinical benefits.");
  }
  if (isBlank(benefitRiskAnalysis.clinicalBenefitEvidence)) {
    missingBenefitRiskAnalysis.push(
      "Record evidence supporting the clinical benefits.",
    );
  }
  if (isBlank(benefitRiskAnalysis.residualRiskAssessment)) {
    missingBenefitRiskAnalysis.push(
      "Assess the individual and overall residual risks.",
    );
  }
  if (isBlank(benefitRiskAnalysis.benefitRiskComparison)) {
    missingBenefitRiskAnalysis.push(
      "Document the benefit-risk analysis and comparison.",
    );
  }
  if (benefitRiskAnalysis.conclusion === "not-assessed") {
    missingBenefitRiskAnalysis.push(
      "Record the manufacturer's overall benefit-risk conclusion.",
    );
  } else if (
    benefitRiskAnalysis.conclusion !== "acceptable" &&
    benefitRiskAnalysis.conclusion !== "benefit-risk-justified"
  ) {
    missingBenefitRiskAnalysis.push(
      `Resolve the overall benefit-risk conclusion (${benefitRiskAnalysis.conclusion}).`,
    );
  }
  if (isBlank(benefitRiskAnalysis.acceptabilityRationale)) {
    missingBenefitRiskAnalysis.push(
      "Justify the manufacturer's overall acceptability conclusion.",
    );
  }
  const riskIdentificationReview = RISK_IDENTIFICATION_PROMPTS.flatMap(
    (prompt) => {
      const assessment = stage?.riskIdentification?.[prompt.id];
      if (!assessment || assessment.decision === "not-assessed") {
        return [`Review risk identification prompt: ${prompt.title}`];
      }
      if (!assessment.rationale.trim()) {
        return [`Document the assessment rationale: ${prompt.title}`];
      }
      return [];
    },
  );
  const reviewedRiskIdentificationCount =
    RISK_IDENTIFICATION_PROMPTS.length - riskIdentificationReview.length;
  const missingPrerequisites: string[] = [];
  if (!project?.intendedPurpose?.completed) {
    missingPrerequisites.push("Complete Intended Purpose.");
  }
  if (!project?.classification?.completed) {
    missingPrerequisites.push("Complete Classification.");
  }
  if (!project?.requirements?.completed) {
    missingPrerequisites.push("Review Applicable Requirements.");
  }

  const missingApproval: string[] = [];
  if (stage?.planStatus !== "approved") {
    missingApproval.push("Plan is not marked approved by the manufacturer.");
  }
  if (stage?.registerStatus !== "approved") {
    missingApproval.push("Risk Register is not marked approved by the manufacturer.");
  }
  if (
    stage?.planStatus === "approved" &&
    isBlank(plan.approvalDate)
  ) {
    missingApproval.push("Plan approval date is not recorded.");
  }
  if (stage?.registerStatus === "approved") {
    if (isBlank(stage.registerApprover)) {
      missingApproval.push("Risk Register approver is not recorded.");
    }
    if (isBlank(stage.registerApprovalDate)) {
      missingApproval.push("Risk Register approval date is not recorded.");
    }
  }
  if (benefitRiskAnalysis.approvalStatus !== "approved") {
    missingApproval.push(
      "Benefit-Risk Analysis is not marked approved by the manufacturer.",
    );
  } else {
    if (isBlank(benefitRiskAnalysis.approver)) {
      missingApproval.push("Benefit-Risk Analysis approver is not recorded.");
    }
    if (isBlank(benefitRiskAnalysis.approvalDate)) {
      missingApproval.push("Benefit-Risk Analysis approval date is not recorded.");
    }
  }

  return {
    missingPlan,
    missingRegister,
    riskIdentificationReview,
    reviewedRiskIdentificationCount,
    riskIdentificationPromptCount: RISK_IDENTIFICATION_PROMPTS.length,
    missingBenefitRiskAnalysis,
    missingPrerequisites,
    missingApproval,
    canComplete:
      missingPlan.length === 0 &&
      missingRegister.length === 0 &&
      riskIdentificationReview.length === 0 &&
      missingBenefitRiskAnalysis.length === 0 &&
      missingPrerequisites.length === 0 &&
      missingApproval.length === 0,
  };
}
