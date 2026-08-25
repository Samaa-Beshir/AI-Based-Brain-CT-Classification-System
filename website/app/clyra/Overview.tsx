"use client";

import type { AnalysisResult, Screen } from "./types";
import { AppShell, Icon, MedicalDisclaimer } from "./ui";

export default function Overview({
  cases,
  sidebarOpen,
  setSidebarOpen,
  onNavigate,
  onSignOut,
  onView,
}: {
  cases: AnalysisResult[];
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
  onView: (result: AnalysisResult) => void;
}) {
  const siteUrl = "https://clyra-brain-ct.samaareda-sr.chatgpt.site";

  return (
    <AppShell
      current="overview"
      title="Clinical Overview"
      eyebrow="CLYRA workspace"
      description="One secure workflow for brain CT classification, lesion mapping, and hemorrhage subtype analysis."
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <section className="overview-hero">
        <div>
          <span className="status-chip status-chip--success"><i /> System ready</span>
          <h2>See it. Map it. Know it.</h2>
          <p>Start with one CT image for classification and segmentation, or submit a validated five-slice PNG sequence for the complete CLYRA pipeline.</p>
          <button className="button button--primary" onClick={() => onNavigate("upload")}><Icon name="plus" /> New Analysis</button>
        </div>
        <div className="overview-mark"><Icon name="brain" size={86} /><span /><span /></div>
      </section>

      <section className="pipeline-cards">
        {[
          { number: "01", icon: "brain", title: "CT Classification", copy: "DenseNet121 evaluates Normal, Ischemic, and Hemorrhagic patterns." },
          { number: "02", icon: "image", title: "Lesion Segmentation", copy: "U-Net with EfficientNet-B3 maps the predicted lesion region." },
          { number: "03", icon: "layers", title: "Subtype Assessment", copy: "Five independent outputs assess EDH, IPH, IVH, SAH, and SDH." },
        ].map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <Icon name={item.icon} size={36} />
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>

      <section className="share-section">
        <img src="https://clyra-brain-ct.samaareda-sr.chatgpt.site/assets/CLYRA_Website_QR.svg" alt="QR code for the public CLYRA website" />
        <div>
          <p className="eyebrow eyebrow--blue">Open on mobile</p>
          <h2>Share the CLYRA workspace</h2>
          <p>Scan the QR code or copy the secure public link. The same responsive interface works on desktop, tablet, and mobile.</p>
          <code>{siteUrl}</code>
          <div>
            <button className="button button--outline" onClick={() => navigator.clipboard?.writeText(siteUrl)}><Icon name="file" /> Copy Link</button>
            <a className="button button--primary" href="https://clyra-brain-ct.samaareda-sr.chatgpt.site/assets/CLYRA_Website_QR.png" download><Icon name="download" /> Download QR</a>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div><p className="eyebrow eyebrow--blue">Device-local history</p><h2>Recent analyses</h2></div>
          <button className="text-button" onClick={() => onNavigate("history")}>View all</button>
        </div>
        {cases.length ? (
          <div className="case-table">
            {cases.slice(0, 3).map((item) => (
              <button key={item.caseId} onClick={() => onView(item)}>
                <span><strong>{item.caseId}</strong><small>{item.generatedAt}</small></span>
                <span className={`category-pill ${item.category.toLowerCase()}`}>{item.category}</span>
                <span>{item.confidence.toFixed(2)}%</span>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state"><Icon name="clock" size={34} /><div><h3>No completed analyses on this device</h3><p>Run the sample case or submit a supported CT input to populate local history.</p></div></div>
        )}
      </section>
      <MedicalDisclaimer />
    </AppShell>
  );
}
