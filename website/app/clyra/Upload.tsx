"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import type { Screen, UploadMode, UploadRequest } from "./types";
import { AppShell, Icon, ProgressSteps } from "./ui";

export default function Upload({
  sidebarOpen,
  setSidebarOpen,
  onNavigate,
  onSignOut,
  onAnalyze,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
  onAnalyze: (request: UploadRequest) => void;
}) {
  const [mode, setMode] = useState<UploadMode>("single");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseMode(nextMode: UploadMode) {
    setMode(nextMode);
    setFiles([]);
    setMessage("");
  }

  function acceptFiles(list: FileList | null) {
    if (!list) return;
    const selected = Array.from(list);
    const limit = mode === "single" ? 1 : 5;
    if (selected.length > limit) {
      setMessage(`Please upload ${mode === "single" ? "one file" : "exactly five PNG slices"}.`);
      setFiles(selected.slice(0, limit));
      return;
    }
    setFiles(selected);
    setMessage("");
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFiles(event.dataTransfer.files);
  }

  function start() {
    const validCount = mode === "single" ? files.length === 1 : files.length === 5;
    if (!validCount) {
      setMessage(mode === "single"
        ? "Upload one CT image to continue."
        : "Upload exactly five consecutive PNG slices to continue.");
      return;
    }
    if (mode === "sequence" && !files.every((file) => file.name.toLowerCase().endsWith(".png"))) {
      setMessage("Five-Slice Sequence accepts PNG images only.");
      return;
    }
    onAnalyze({ mode, files, demo: false });
  }

  return (
    <AppShell
      current="upload"
      title="Upload CT Scan"
      eyebrow="New clinical analysis"
      description="Select a supported input mode and securely submit the case for AI-assisted analysis."
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <ProgressSteps active={1} />
      <div className="upload-layout">
        <div className="upload-main">
          <div className="mode-grid">
            <button className={`mode-card ${mode === "single" ? "selected" : ""}`} onClick={() => chooseMode("single")} aria-pressed={mode === "single"}>
              <span className="radio" />
              <span className="mode-icon"><Icon name="brain" size={44} /></span>
              <span>
                <strong>Single CT Image</strong>
                <small><Icon name="spark" size={18} /> Stage 1 classification + Stage 2 segmentation</small>
                <small><Icon name="image" size={18} /> PNG, JPG, or DICOM</small>
              </span>
            </button>
            <button className={`mode-card ${mode === "sequence" ? "selected" : ""}`} onClick={() => chooseMode("sequence")} aria-pressed={mode === "sequence"}>
              <span className="radio" />
              <span className="mode-icon mode-icon--layers"><Icon name="layers" size={44} /></span>
              <span>
                <strong>Five-Slice Sequence</strong>
                <small><Icon name="spark" size={18} /> Center slice: Stage 1 + Stage 2</small>
                <small><Icon name="layers" size={18} /> Stage 3 for hemorrhagic cases</small>
                <small><Icon name="image" size={18} /> Five consecutive PNG slices</small>
              </span>
            </button>
          </div>

          <div
            className={`dropzone ${dragging ? "is-dragging" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
          >
            <Icon name="upload" size={58} />
            <h2>Drag and drop CT files here</h2>
            <p>or browse from your device</p>
            <small>{mode === "single" ? "Supported: PNG, JPG, DICOM • One file" : "Supported: PNG • Exactly five consecutive slices"}</small>
            <input
              ref={inputRef}
              type="file"
              hidden
              multiple={mode === "sequence"}
              accept={mode === "single" ? ".png,.jpg,.jpeg,.dcm,application/dicom" : ".png,image/png"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFiles(event.target.files)}
            />
          </div>

          {files.length > 0 && (
            <div className="file-list" aria-live="polite">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`}>
                  <span>{mode === "sequence" ? index + 1 : <Icon name="file" size={18} />}</span>
                  <p>
                    <strong>{file.name}</strong>
                    <small>{(file.size / 1024 / 1024).toFixed(2)} MB{mode === "sequence" && index === 2 ? " • Center slice" : ""}</small>
                  </p>
                </div>
              ))}
            </div>
          )}
          {message && <p className="upload-message" role="status">{message}</p>}

          <div className="upload-actions">
            <button className="button button--outline" onClick={() => inputRef.current?.click()}><Icon name="folder" /> Browse Files</button>
            <button className="button button--ghost" onClick={() => { setFiles([]); setMessage(""); }} disabled={!files.length}><Icon name="trash" /> Clear</button>
            <button className="button button--demo" onClick={() => onAnalyze({ mode: "sequence", files: [], demo: true })}><Icon name="monitor" /> Use Sample Case</button>
            <button className="button button--primary push-right" onClick={start}><Icon name="spark" /> Start AI Analysis</button>
          </div>
          <p className="privacy-line"><Icon name="shield" size={18} /> Files are processed securely and deleted after analysis.</p>
        </div>

        <aside className="workflow-card">
          <h2>Clinical Workflow</h2>
          {[["1", "Stage 1", "CT Classification"], ["2", "Stage 2", "Lesion Segmentation"], ["3", "Stage 3", "Hemorrhage Subtypes"]].map(([number, title, detail]) => (
            <div className="workflow-step" key={number}>
              <span>{number}</span>
              <Icon name={number === "3" ? "file" : "brain"} size={30} />
              <p><strong>{title}</strong><small>{detail}</small></p>
            </div>
          ))}
          <div className="workflow-note">
            <Icon name="info" size={20} />
            <p>Stage 3 requires exactly five consecutive PNG slices from the same CT series and a hemorrhagic center slice.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
