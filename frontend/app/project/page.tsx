"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getProjects,
  addProject,
  saveProject,
  createEmptyProject,
  deleteProject,
  ProjectData,
} from "@/lib/project-store";

export default function ProjectPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [manufacturer, setManufacturer] = useState("");

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const createProject = () => {
    if (!projectName.trim()) return;

    const newProject: ProjectData = createEmptyProject(
      projectName.trim(),
      manufacturer.trim(),
    );

    addProject(newProject);
    setProjects((prev) => [newProject, ...prev]);

    setShowForm(false);
    setProjectName("");
    setManufacturer("");

    // show confirmation then navigate
    showToast("Projekt bol uložen");
    setTimeout(() => router.push("/"), 700);
  };

  const openNewProject = () => {
    setProjectName("");
    setManufacturer("");
    setShowForm(true);
  };

  // toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
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
          <button className="nav-item" onClick={() => router.push("/")}>
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="nav-item active"
            onClick={() => router.push("/project")}
          >
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
            <div className="breadcrumb">Projects</div>

            <h1>Projects</h1>
          </div>

          <button className="primary-button" onClick={openNewProject}>
            + New Project
          </button>
        </header>

        <div className="page-container">
          <div className="page-header">
            <span className="step-label">PROJECT MANAGEMENT</span>

            <h2>Your MDR certification projects</h2>

            <p>
              Select a project to continue working through the MDR certification
              workflow.
            </p>
          </div>

          <section className="project-grid">
            {projects.map((p) => (
              <div key={p.id} className="project-card-wrapper">
                <div
                  className="project-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    saveProject(p);
                    showToast("Projekt bol uložen");
                    setTimeout(() => router.push("/"), 600);
                  }}
                >
                  <div className="project-card-top">
                    <div className="project-icon">MDR</div>

                    <span className="project-status">Active</span>
                  </div>

                  <h3>{p.name}</h3>

                  <p>{p.manufacturer || "Manufacturer not specified"}</p>

                  <div className="project-card-footer">
                    <span>MDR certification</span>

                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <strong>Open project →</strong>
                      <button
                        className="project-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!confirm("Naozaj vymazať projekt?")) return;
                          deleteProject(p.id);
                          setProjects((prev) =>
                            prev.filter((x) => x.id !== p.id),
                          );
                          showToast("Projekt bol vymazaný");
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="new-project-card" onClick={openNewProject}>
              <div className="new-project-icon">+</div>

              <h3>Create new project</h3>

              <p>Start a new MDR certification workflow.</p>
            </button>
          </section>

          {showForm && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-header">
                  <div>
                    <span className="step-label">NEW PROJECT</span>

                    <h2>Create MDR project</h2>
                  </div>

                  <button
                    className="modal-close"
                    onClick={() => setShowForm(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="form-field">
                  <label>
                    Project / device name
                    <span>*</span>
                  </label>

                  <input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. AI Diagnostic System"
                  />
                </div>

                <div className="form-field">
                  <label>Manufacturer</label>

                  <input
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="Manufacturer / organisation"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    disabled={!projectName.trim()}
                    onClick={createProject}
                  >
                    Create project →
                  </button>
                </div>
              </div>
            </div>
          )}
          {toast && (
            <div className="toast" role="status">
              {toast}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
