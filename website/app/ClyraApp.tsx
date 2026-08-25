"use client";

import { useEffect, useState } from "react";
import Analysis from "./clyra/Analysis";
import ErrorView from "./clyra/ErrorView";
import History from "./clyra/History";
import Login from "./clyra/Login";
import Overview from "./clyra/Overview";
import Report from "./clyra/Report";
import Results from "./clyra/Results";
import SystemInfo from "./clyra/SystemInfo";
import Upload from "./clyra/Upload";
import { AnalysisError, AnalysisResult, DEMO_RESULT, INVALID_SEQUENCE_ERROR, Screen, UploadRequest } from "./clyra/types";

const STAGE3_IMAGE_SIZE = 384;

function createRequestId() {
  return `REQ-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

async function prepareStage3Png(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("INVALID_PNG_IMAGE"));
      image.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = STAGE3_IMAGE_SIZE;
    canvas.height = STAGE3_IMAGE_SIZE;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("IMAGE_PREPARATION_FAILED");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, STAGE3_IMAGE_SIZE, STAGE3_IMAGE_SIZE);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => value ? resolve(value) : reject(new Error("IMAGE_PREPARATION_FAILED")), "image/png");
    });
    const filename = file.name.replace(/\.[^.]+$/, "") + ".png";
    return new File([blob], filename, { type: "image/png", lastModified: file.lastModified });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ClyraApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [request, setRequest] = useState<UploadRequest | null>(null);
  const [result, setResult] = useState<AnalysisResult>(DEMO_RESULT);
  const [cases, setCases] = useState<AnalysisResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<AnalysisError>(INVALID_SEQUENCE_ERROR);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("clyra-analysis-history");
      if (saved) setCases(JSON.parse(saved));
    } catch {}
  }, []);

  function remember(next: AnalysisResult) {
    setCases((current) => {
      const updated = [next, ...current.filter((item) => item.caseId !== next.caseId)].slice(0, 12);
      try { localStorage.setItem("clyra-analysis-history", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  function navigate(next: Screen) {
    if (next === "report" && !result) {
      setScreen("history");
      return;
    }
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function signOut() {
    setScreen("login");
    setSidebarOpen(false);
    setRequest(null);
  }

  function view(item: AnalysisResult) {
    setResult(item);
    setScreen("results");
  }

  async function analyze(next: UploadRequest) {
    setRequest(next);
    setScreen("analysis");
    setProgress(8);
    const interval = setInterval(
      () => setProgress((current) => Math.min(current + Math.floor(Math.random() * 10 + 6), 88)),
      350,
    );
    try {
      if (next.demo) {
        await new Promise((resolve) => setTimeout(resolve, 2600));
        const demo = {
          ...DEMO_RESULT,
          generatedAt: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Cairo" }) + " EEST",
        };
        setResult(demo);
        remember(demo);
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 350));
        setScreen("results");
        return;
      }

      const uploadFiles = next.mode === "sequence"
        ? await Promise.all(next.files.map(prepareStage3Png))
        : next.files;
      const form = new FormData();
      form.set("mode", next.mode);
      uploadFiles.forEach((file) => form.append("files", file));
      const response = await fetch("/api/analyze", { method: "POST", body: form });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail?.code || `HTTP_${response.status}`);
      }
      const payload = await response.json();
      const live: AnalysisResult = {
        ...payload,
        isDemo: false,
        sourceImage: payload.sourceImage || URL.createObjectURL(next.files[Math.floor(next.files.length / 2)]),
        generatedAt: payload.generatedAt || new Date().toLocaleString("en-GB"),
      };
      setResult(live);
      remember(live);
      setProgress(100);
      setScreen("results");
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "ANALYSIS_FAILED";
      const isSizeError = code === "HTTP_413" || code === "FILE_TOO_LARGE";
      const isImageError = code === "INVALID_PNG_IMAGE" || code === "IMAGE_PREPARATION_FAILED";
      setError({
        title: isSizeError ? "The uploaded sequence is too large" : isImageError ? "We couldn’t prepare these PNG images" : "Analysis service is temporarily unavailable",
        message: isSizeError
          ? "The five images exceed the secure upload limit. No prediction or report has been generated."
          : isImageError
            ? "At least one selected file could not be decoded as a valid PNG image."
            : "The secure model service could not complete this request. No prediction or report has been generated.",
        code,
        requestId: createRequestId(),
        phase: isSizeError || isImageError ? "upload" : "analysis",
        fixes: isSizeError
          ? ["Use the original 384×384 Stage 3 PNG slices", "Remove unnecessary metadata from the PNG files", "Choose the five files again"]
          : isImageError
            ? ["Choose five valid PNG images", "Keep the images in anatomical order", "Ensure the third image is the center slice"]
            : ["Try the request again after a short wait", "Choose the five PNG files again", "Use the Sample Case to explore the interface"],
        retryable: !isImageError,
      });
      setScreen("error");
    } finally {
      clearInterval(interval);
    }
  }

  const shared = { sidebarOpen, setSidebarOpen, onNavigate: navigate, onSignOut: signOut };
  if (screen === "login") return <Login onDemo={() => setScreen("overview")} />;
  if (screen === "overview") return <Overview {...shared} cases={cases} onView={view} />;
  if (screen === "upload") return <Upload {...shared} onAnalyze={analyze} />;
  if (screen === "analysis") return <Analysis {...shared} mode={request?.mode || "sequence"} progress={progress} />;
  if (screen === "results") return <Results {...shared} result={result} onReport={() => setScreen("report")} onNew={() => setScreen("upload")} />;
  if (screen === "report") return <Report {...shared} result={result} onBack={() => setScreen("results")} onNew={() => setScreen("upload")} />;
  if (screen === "history") return <History {...shared} cases={cases} onView={view} />;
  if (screen === "system") return <SystemInfo {...shared} />;
  return <ErrorView {...shared} error={error} onDifferent={() => setScreen("upload")} onRetry={() => request && analyze(request)} />;
}
