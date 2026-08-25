"use client";

import type { AnalysisResult, Screen } from "./types";
import { AppShell, Icon, MedicalDisclaimer, ProgressSteps, ScanImage } from "./ui";

export default function Results({
  result,
  sidebarOpen,
  setSidebarOpen,
  onNavigate,
  onSignOut,
  onReport,
  onNew,
}: {
  result: AnalysisResult;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  onNavigate: (screen: Screen) => void;
  onSignOut: () => void;
  onReport: () => void;
  onNew: () => void;
}) {
  const maskImage = result.maskImage || result.sourceImage;
  const overlayImage = result.overlayImage || result.sourceImage;
  const hasFiveSliceSequence = result.sequenceImages?.length === 5;

  return (
    <AppShell
      current="results"
      title="AI Analysis Results"
      eyebrow={`Case ${result.caseId}`}
      description="Analysis completed successfully."
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <ProgressSteps active={3} complete />
      <div className="result-status">
        <Icon name="check" />
        <span>Analysis completed</span>
        {result.isDemo && <strong>Illustrative Demo Case</strong>}
      </div>

      <section className={`results-grid ${!hasFiveSliceSequence ? "results-grid--two" : ""}`}>
        <article className="result-card stage-one">
          <h2>Stage 1 — CT Classification</h2>
          <div className="classification-main">
            <ScanImage src={result.sourceImage} alt="Center axial CT image" />
            <div className="classification-copy">
              <small>Predicted CT Category</small>
              <h3>{result.category}</h3>
              <small>Confidence</small>
              <strong className="confidence">{result.confidence.toFixed(2)}%</strong>
            </div>
          </div>
          <div className="prob-list">
            {result.classProbabilities.map((probability) => (
              <div key={probability.label}>
                <span>{probability.label}</span>
                <i>
                  <b
                    style={{ width: `${probability.value}%` }}
                    className={probability.label === "Hemorrhagic" ? "danger" : ""}
                  />
                </i>
                <strong>{probability.value}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="result-card stage-two">
          <div className="card-title-row">
            <h2>Stage 2 — Lesion Segmentation</h2>
            <span className={`status-chip ${result.lesionDetected ? "status-chip--success" : ""}`}>
              {result.lesionDetected ? "Lesion detected" : "No lesion detected"}
            </span>
          </div>
          <div className="imaging-trio">
            <figure>
              <figcaption>Original CT</figcaption>
              <ScanImage src={result.sourceImage} alt="Original center CT" />
            </figure>
            <figure>
              <figcaption>Predicted Lesion Mask</figcaption>
              <ScanImage src={maskImage} alt="Predicted lesion mask" mask={result.isDemo} />
            </figure>
            <figure>
              <figcaption>Segmentation Overlay</figcaption>
              <ScanImage src={overlayImage} alt="Segmentation overlay" overlay={result.isDemo} />
            </figure>
          </div>
        </article>

        {hasFiveSliceSequence && (
          <article className="result-card stage-three">
            <h2>Stage 3 — Hemorrhage Subtypes</h2>
            <span className={`status-chip ${result.stage3Status === "Completed" ? "status-chip--success" : ""}`}>
              {result.stage3Status === "Completed" ? "Five-slice context validated" : result.stage3Status}
            </span>
            <div className="slice-row">
              {result.sequenceImages!.map((src, index) => (
                <div key={index} className={index === 2 ? "center" : ""}>
                  <img src={src} alt={`Context slice ${index + 1}`} />
                  {index === 2 && <small>Center</small>}
                </div>
              ))}
            </div>
            <div className="subtype-list">
              {result.subtypes.map((item) => (
                <div key={item.code}>
                  <span>{item.code}</span>
                  <i><b style={{ width: `${item.probability}%` }} /></i>
                  <strong>{item.probability}%</strong>
                  <em className={item.detected ? "detected" : ""}>
                    {item.detected ? "Detected" : "Below threshold"}
                  </em>
                </div>
              ))}
            </div>
            <small className="multi-label-note">Multiple subtypes may be predicted independently.</small>
          </article>
        )}
      </section>

      <section className="summary-strip">
        <span><Icon name="brain" size={38} /></span>
        <div>
          <h2>CLYRA Summary</h2>
          <p>{result.impression}</p>
        </div>
        <div className="summary-actions">
          <button className="button button--primary" onClick={onReport}><Icon name="file" /> View Final Report</button>
          <button className="button button--outline" onClick={onReport}><Icon name="download" /> Download Report</button>
          <button className="button button--outline" onClick={onNew}><Icon name="plus" /> New Analysis</button>
        </div>
      </section>
      <MedicalDisclaimer />
    </AppShell>
  );
}
