export type ProjectData = {
  id: string;
  name: string;
  manufacturer: string;
  regulatorySources?: ProjectRegulatorySources;

  qualification?: {
    completed: boolean;
    inProgress?: boolean;
    answers?: Record<string, string | null>;
    customAnswers?: Record<string, string>;
    timestamp?: string;
    result?: Record<string, unknown>;
    mdrRelevant?: boolean;
    software?: boolean;
    medicalSoftware?: boolean;
    softwareConfiguration?: string | null;
    clinicalDecisionSupport?: boolean;
    aiOutput?: string | null;
    aiOutputDescription?: string | null;
    healthData?: boolean;
    clinicalImpact?: string | null;
  };

  intendedPurpose?: {
    completed: boolean;
    inProgress?: boolean;
    timestamp?: string;
    deviceName?: string;
    manufacturer?: string;
    intendedPurpose?: string;
    targetUsers?: string;
    targetPatients?: string;
    medicalCondition?: string;
    clinicalUse?: string;
    environment?: string;
    primaryFunction?: string;
  };

  classification?: {
    completed: boolean;
    inProgress?: boolean;
    answers?: Record<string, string>;
    result?: {
      classification: string;
      rule: string;
    };
    timestamp?: string;
    class?: string;
    rule?: string;
    justification?: string;
  };

  requirements?: {
    completed: boolean;
    inProgress?: boolean;
    timestamp?: string;
    items?: Record<string, boolean>;
  };

  riskManagement?: RiskManagementData;

  clinicalEvaluation?: {
    completed: boolean;
    inProgress?: boolean;
    notes?: string;
    timestamp?: string;
  };

  technicalDocumentation?: {
    completed: boolean;
  };

  conformityAssessment?: {
    completed: boolean;
  };

  notifiedBody?: {
    completed: boolean;
  };

  declarationOfConformity?: {
    completed: boolean;
  };

  ceMarking?: {
    completed: boolean;
  };

  eudamed?: {
    completed: boolean;
  };

  postMarketSurveillance?: {
    completed: boolean;
  };
};

export type RiskArtifactStatus = "draft" | "in-review" | "approved";

export type RiskManagementPlan = {
  deviceIdentification: string;
  scope: string;
  lifecycleStages: string;
  rolesAndResponsibilities: string;
  personnelCompetence: string;
  riskEvaluationMethod: string;
  riskAcceptabilityCriteria: string;
  controlVerificationApproach: string;
  controlEffectivenessApproach: string;
  lifecycleReviewPlan: string;
  reviewTriggers: string;
  approver: string;
  approvalDate: string;
  version: string;
};

export type RiskAcceptanceDecision =
  | "not-assessed"
  | "acceptable"
  | "benefit-risk-justified"
  | "not-acceptable"
  | "additional-controls-required";

export type RiskIdentificationPromptId =
  | "algorithm-output"
  | "diagnostic-support"
  | "input-data"
  | "model-generalisation"
  | "systematic-bias"
  | "output-interpretation"
  | "automation-bias"
  | "model-updates"
  | "cybersecurity"
  | "availability-data-loss"
  | "use-error-misuse"
  | "interoperability-transfer";

export type RiskIdentificationDecision =
  | "not-assessed"
  | "relevant"
  | "not-applicable";

export type RiskIdentificationAssessment = {
  decision: RiskIdentificationDecision;
  rationale: string;
};

export type RiskControlStatus =
  | "not-assessed"
  | "not-applicable"
  | "planned"
  | "implemented"
  | "verified";

export type RiskEvidenceReference = {
  id: string;
  label: string;
  url: string;
};

export type RiskRecord = {
  id: string;
  hazard: string;
  sourcePromptId?: RiskIdentificationPromptId;
  foreseeableSequence: string;
  hazardousSituation: string;
  harm: string;
  initialSeverity: string | number | null;
  initialProbability: string | number | null;
  initialRiskEvaluation?: string;
  initialCriteriaComparison?: string;
  initialRationale: string;
  riskControls: string;
  inherentlySafeDesign?: string;
  inherentlySafeDesignStatus?: RiskControlStatus;
  protectiveMeasures?: string;
  protectiveMeasuresStatus?: RiskControlStatus;
  safetyInformationTraining?: string;
  safetyInformationTrainingStatus?: RiskControlStatus;
  controlOwner?: string;
  controlVerification: string;
  controlImplementationStatus?: RiskControlStatus;
  controlEffectivenessVerification?: string;
  controlEffectivenessStatus?: RiskControlStatus;
  controlIntroducedRisks?: string;
  evidenceReferences?: RiskEvidenceReference[];
  residualSeverity: string | number | null;
  residualProbability: string | number | null;
  residualRiskEvaluation?: string;
  residualCriteriaComparison?: string;
  residualDecision: RiskAcceptanceDecision;
  residualRationale: string;
  residualUserInformation?: string;
  benefitRiskRationale?: string;
  assessor: string;
  updatedAt: string;
};

export type RiskBenefitAnalysis = {
  clinicalBenefits: string;
  clinicalBenefitEvidence: string;
  evidenceReferences: RiskEvidenceReference[];
  residualRiskAssessment: string;
  benefitRiskComparison: string;
  conclusion: RiskAcceptanceDecision;
  acceptabilityRationale: string;
  approvalStatus: RiskArtifactStatus;
  approver: string;
  approvalDate: string;
};

export type RiskManagementData = {
  completed: boolean;
  inProgress?: boolean;
  notes?: string;
  timestamp?: string;
  plan?: RiskManagementPlan;
  planStatus?: RiskArtifactStatus;
  risks?: RiskRecord[];
  registerStatus?: RiskArtifactStatus;
  registerApprover?: string;
  registerApprovalDate?: string;
  riskIdentification?: Partial<
    Record<RiskIdentificationPromptId, RiskIdentificationAssessment>
  >;
  benefitRiskAnalysis?: RiskBenefitAnalysis;
};

export type RegulatorySourceKind = "legislation" | "standard" | "guidance";

export type RegulatorySourceApplicability =
  | "to-assess"
  | "applicable"
  | "not-applicable";

export type RegulatorySourceHarmonisation =
  | "listed-in-oj"
  | "not-found-in-summary"
  | "not-applicable"
  | "unverified";

export type RegulatorySourceVerification =
  | "verified"
  | "partially-verified"
  | "needs-verification"
  | "user-recorded";

export type RegulatorySourceLink = {
  label: string;
  url: string;
};

export type RegulatorySourceRecord = {
  id: string;
  kind: RegulatorySourceKind;
  title: string;
  reference: string;
  edition: string;
  validity: string;
  verifiedAt: string | null;
  verification: RegulatorySourceVerification;
  harmonisation: RegulatorySourceHarmonisation;
  harmonisationDetails: string;
  scope: string;
  applicabilityGuidance: string;
  verificationNote: string;
  sources: RegulatorySourceLink[];
};

export type RegulatorySourceAssessment = {
  decision: RegulatorySourceApplicability;
  rationale: string;
  evidence: string;
  assessedAt: string | null;
};

export type ProjectRegulatorySources = {
  assessments: Record<string, RegulatorySourceAssessment>;
  customSources: RegulatorySourceRecord[];
};

export type StageKey = Exclude<
  keyof ProjectData,
  "id" | "name" | "manufacturer" | "regulatorySources"
>;
export type StageData<K extends StageKey> = NonNullable<ProjectData[K]> & {
  inProgress?: boolean;
};

const STORAGE_KEY = "mdr-projects";
const CURRENT_PROJECT_KEY = "mdr-current-project-id";

function createProjectId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `project-${Date.now()}`;
}

export const emptyProject: ProjectData = {
  id: "default-project",
  name: "",
  manufacturer: "",
};

export function createEmptyProject(
  name: string,
  manufacturer: string,
  id?: string,
): ProjectData {
  const pid = id ?? createProjectId();

  return {
    id: pid,
    name,
    manufacturer,
    regulatorySources: { assessments: {}, customSources: [] },

    qualification: { completed: false },

    intendedPurpose: { completed: false },

    classification: { completed: false },

    requirements: { completed: false, items: {} },

    riskManagement: { completed: false },

    clinicalEvaluation: { completed: false },

    technicalDocumentation: { completed: false },

    conformityAssessment: { completed: false },

    notifiedBody: { completed: false },

    declarationOfConformity: { completed: false },

    ceMarking: { completed: false },

    eudamed: { completed: false },

    postMarketSurveillance: { completed: false },
  };
}

function isWindow() {
  return typeof window !== "undefined";
}

export function getProjects(): ProjectData[] {
  if (!isWindow()) return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return [parsed];
  } catch {
    return [];
  }

  return [];
}

export function saveProjects(projects: ProjectData[]) {
  if (!isWindow()) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("mdr-projects-updated"));
}

export function getCurrentProjectId(): string | null {
  if (!isWindow()) return null;
  return localStorage.getItem(CURRENT_PROJECT_KEY);
}

export function setCurrentProjectId(id: string | null) {
  if (!isWindow()) return;
  if (id === null) {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  } else {
    localStorage.setItem(CURRENT_PROJECT_KEY, id);
  }
  window.dispatchEvent(new Event("mdr-current-project-changed"));
}

export function deleteProject(id: string) {
  if (!isWindow()) return;

  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  saveProjects(filtered);
}

export function getProject(): ProjectData | null {
  const projects = getProjects();
  if (!projects.length) return null;

  const currentId = getCurrentProjectId();
  if (currentId) {
    const found = projects.find((p) => p.id === currentId);
    if (found) return found;
  }

  return projects[0];
}

export function saveProject(project: ProjectData) {
  if (!isWindow()) return;

  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx !== -1) projects.splice(idx, 1);
  projects.unshift(project);
  saveProjects(projects);
  setCurrentProjectId(project.id);
}

function getProjectForStageUpdate(projects: ProjectData[]) {
  const currentId = getCurrentProjectId();
  const currentProject = currentId
    ? projects.find((project) => project.id === currentId)
    : undefined;

  if (currentProject) return currentProject;
  if (projects.length) return projects[0];

  const draftProject = createEmptyProject("Untitled project", "");
  projects.push(draftProject);
  return draftProject;
}

function persistStageUpdate(projects: ProjectData[], project: ProjectData) {
  saveProjects(projects);
  if (getCurrentProjectId() !== project.id) {
    setCurrentProjectId(project.id);
  }
}

export function addProject(project: ProjectData) {
  if (!isWindow()) return;

  const projects = getProjects();
  projects.unshift(project);
  saveProjects(projects);
  setCurrentProjectId(project.id);
}

export function updateProject(updates: Partial<ProjectData>) {
  const current = getProject() ?? {
    id: createProjectId(),
    name: "",
    manufacturer: "",
  };

  const updated: ProjectData = {
    ...current,
    ...updates,
  };

  saveProject(updated);
  return updated;
}

function updateStage<K extends StageKey>(
  project: ProjectData,
  key: K,
  updates: Partial<StageData<K>>,
) {
  project[key] = {
    ...(project[key] ?? { completed: false }),
    ...updates,
  } as ProjectData[K];
}

export function setStageCompletion<K extends StageKey>(
  key: K,
  completed: boolean,
) {
  if (!isWindow()) return;

  const projects = getProjects();
  const project = getProjectForStageUpdate(projects);

  updateStage(project, key, { completed });
  persistStageUpdate(projects, project);
}

export function saveStageData<K extends StageKey>(
  key: K,
  data: Partial<StageData<K>>,
) {
  if (!isWindow()) return;

  const projects = getProjects();
  const project = getProjectForStageUpdate(projects);

  updateStage(project, key, data);
  persistStageUpdate(projects, project);
}

// Atomically save stage data and mark the stage as in-progress (not completed)
export function saveStageInProgress<K extends StageKey>(
  key: K,
  data: Partial<StageData<K>>,
) {
  if (!isWindow()) return;

  const projects = getProjects();
  const project = getProjectForStageUpdate(projects);

  updateStage(project, key, {
    ...data,
    completed: false,
    inProgress: true,
  });

  persistStageUpdate(projects, project);
}

// Set an explicit stage status: 'notStarted' | 'inProgress' | 'completed'
export function setStageStatus<K extends StageKey>(
  key: K,
  status: "notStarted" | "inProgress" | "completed",
) {
  if (!isWindow()) return;

  const projects = getProjects();
  const project = getProjectForStageUpdate(projects);

  const base = project[key] ?? { completed: false };

  if (status === "completed") {
    updateStage(project, key, { ...base, completed: true, inProgress: false });
  } else if (status === "inProgress") {
    updateStage(project, key, { ...base, completed: false, inProgress: true });
  } else {
    updateStage(project, key, { ...base, completed: false, inProgress: false });
  }

  persistStageUpdate(projects, project);
}

export function markStageNotStarted(key: StageKey) {
  setStageStatus(key, "notStarted");
}

// Atomically save stage data and mark the stage completed for the current project
export function saveStageAndComplete<K extends StageKey>(
  key: K,
  data: Partial<StageData<K>>,
) {
  if (!isWindow()) return;

  const projects = getProjects();
  const project = getProjectForStageUpdate(projects);

  updateStage(project, key, {
    ...data,
    completed: true,
    inProgress: false,
  });

  persistStageUpdate(projects, project);
}

export function getWorkflowStatus(project: ProjectData) {
  return [
    {
      number: 1,
      key: "qualification",
      title: "Regulatory Qualification",
      description: "Overenie, či produkt spadá pod MDR.",
      completed: project.qualification?.completed ?? false,
    },

    {
      number: 2,
      key: "intendedPurpose",
      title: "Intended Purpose",
      description: "Definovanie určeného účelu zdravotníckej pomôcky.",
      completed: project.intendedPurpose?.completed ?? false,
    },

    {
      number: 3,
      key: "classification",
      title: "Classification",
      description: "Určenie klasifikácie podľa Annex VIII.",
      completed: project.classification?.completed ?? false,
    },

    {
      number: 4,
      key: "requirements",
      title: "Applicable Requirements",
      description: "Identifikácia príslušných regulačných požiadaviek.",
      completed: project.requirements?.completed ?? false,
    },

    {
      number: 5,
      key: "riskManagement",
      title: "Risk Management",
      description: "Identifikácia a riadenie rizík.",
      completed: project.riskManagement?.completed ?? false,
    },

    {
      number: 6,
      key: "clinicalEvaluation",
      title: "Clinical Evaluation",
      description: "Posúdenie klinických dôkazov.",
      completed: project.clinicalEvaluation?.completed ?? false,
    },

    {
      number: 7,
      key: "technicalDocumentation",
      title: "Technical Documentation",
      description: "Príprava technickej dokumentácie.",
      completed: project.technicalDocumentation?.completed ?? false,
    },

    {
      number: 8,
      key: "conformityAssessment",
      title: "Conformity Assessment",
      description: "Výber a realizácia postupu posudzovania zhody.",
      completed: project.conformityAssessment?.completed ?? false,
    },

    {
      number: 9,
      key: "notifiedBody",
      title: "Notified Body",
      description: "Posúdenie zdravotníckej pomôcky notifikovanou osobou.",
      completed: project.notifiedBody?.completed ?? false,
    },

    {
      number: 10,
      key: "declarationOfConformity",
      title: "EU Declaration of Conformity",
      description: "Vypracovanie EÚ vyhlásenia o zhode.",
      completed: project.declarationOfConformity?.completed ?? false,
    },

    {
      number: 11,
      key: "ceMarking",
      title: "CE Marking",
      description: "Umiestnenie označenia CE.",
      completed: project.ceMarking?.completed ?? false,
    },

    {
      number: 12,
      key: "eudamed",
      title: "EUDAMED & Market Placement",
      description: "Registrácia a uvedenie pomôcky na trh.",
      completed: project.eudamed?.completed ?? false,
    },

    {
      number: 13,
      key: "postMarketSurveillance",
      title: "Post-Market Surveillance",
      description: "Monitorovanie pomôcky po uvedení na trh.",
      completed: project.postMarketSurveillance?.completed ?? false,
    },
  ];
}
