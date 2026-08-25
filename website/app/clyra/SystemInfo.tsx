"use client";

import type { Screen } from "./types";
import { AppShell, Icon } from "./ui";

export default function SystemInfo({
  sidebarOpen,
  setSidebarOpen,
  onNavigate,
  onSignOut,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
}) {
  return (
    <AppShell
      current="system"
      title="System Information"
      eyebrow="CLYRA v1.0.0"
      description="Deployment, model, privacy, and clinical-use information."
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <section className="system-grid">
        <article>
          <span className="system-icon"><Icon name="shield" /></span>
          <h2>Privacy by design</h2>
          <p>Uploaded files are processed for the active request and are not added to a training dataset. Device-local history stores summaries only.</p>
        </article>
        <article>
          <span className="system-icon"><Icon name="brain" /></span>
          <h2>Three-stage pipeline</h2>
          <dl>
            <div><dt>Stage 1</dt><dd>DenseNet121 • 3-class classification</dd></div>
            <div><dt>Stage 2</dt><dd>U-Net + EfficientNet-B3 • segmentation</dd></div>
            <div><dt>Stage 3</dt><dd>EfficientNet-B0 + BiGRU • 5 labels</dd></div>
          </dl>
        </article>
        <article>
          <span className="system-icon"><Icon name="file" /></span>
          <h2>Supported inputs</h2>
          <dl>
            <div><dt>Single image</dt><dd>PNG, JPG, or DICOM</dd></div>
            <div><dt>Sequence</dt><dd>Exactly five consecutive PNG slices</dd></div>
            <div><dt>Center slice</dt><dd>Stage 1 and Stage 2 target</dd></div>
          </dl>
        </article>
        <article>
          <span className="system-icon"><Icon name="info" /></span>
          <h2>Clinical-use statement</h2>
          <p>CLYRA is an AI-assisted decision-support prototype. Outputs require review by a qualified physician and do not replace clinical diagnosis.</p>
        </article>
      </section>
      <section className="version-strip">
        <span className="status-chip status-chip--success"><i /> Interface ready</span>
        <span>Frontend v1.0.0</span>
        <span>Model registry v1</span>
        <span>Report schema v1</span>
      </section>
    </AppShell>
  );
}
