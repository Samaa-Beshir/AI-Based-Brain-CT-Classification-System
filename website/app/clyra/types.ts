export type Screen = "login" | "overview" | "upload" | "analysis" | "results" | "report" | "history" | "system" | "error";
export type UploadMode = "single" | "sequence";

export interface UploadRequest {
  mode: UploadMode;
  files: File[];
  demo: boolean;
}

export interface SubtypeResult {
  code: "EDH" | "IPH" | "IVH" | "SAH" | "SDH";
  probability: number;
  threshold: number;
  detected: boolean;
}

export interface AnalysisResult {
  caseId: string;
  generatedAt: string;
  inputMode: UploadMode;
  category: "Normal" | "Ischemic" | "Hemorrhagic";
  confidence: number;
  classProbabilities: { label: string; value: number }[];
  lesionDetected: boolean;
  stage3Status: "Completed" | "Not requested" | "Not applicable";
  subtypes: SubtypeResult[];
  impression: string;
  sourceImage: string;
  maskImage?: string;
  overlayImage?: string;
  sequenceImages?: string[];
  isDemo: boolean;
}

export interface AnalysisError {
  title: string;
  message: string;
  code: string;
  requestId: string;
  phase: "upload" | "analysis";
  fixes: string[];
  retryable: boolean;
}

export const DEMO_RESULT: AnalysisResult = {
  caseId: "CLY-2026-0048",
  generatedAt: "24 Aug 2026, 09:24 EEST",
  inputMode: "sequence",
  category: "Hemorrhagic",
  confidence: 97.48,
  classProbabilities: [
    { label: "Normal", value: 0.8 },
    { label: "Ischemic", value: 1.7 },
    { label: "Hemorrhagic", value: 97.5 },
  ],
  lesionDetected: true,
  stage3Status: "Completed",
  subtypes: [
    { code: "EDH", probability: 6, threshold: 36, detected: false },
    { code: "IPH", probability: 82, threshold: 42, detected: true },
    { code: "IVH", probability: 41, threshold: 55, detected: false },
    { code: "SAH", probability: 18, threshold: 48, detected: false },
    { code: "SDH", probability: 11, threshold: 52, detected: false },
  ],
  impression: "Hemorrhagic CT pattern with a localized lesion. IPH exceeded its decision threshold and was identified as the primary predicted subtype.",
  sourceImage: "https://clyra-brain-ct.samaareda-sr.chatgpt.site/assets/clyra-demo-ct.png",
  isDemo: true,
};

export const INVALID_SEQUENCE_ERROR: AnalysisError = {
  title: "We couldn’t process this sequence",
  message: "The five uploaded PNG slices could not be validated as consecutive images from the same CT series. No prediction has been generated.",
  code: "INVALID_SEQUENCE_CONTEXT",
  requestId: "REQ-8C21A4",
  phase: "upload",
  fixes: ["Upload exactly five consecutive PNG slices", "Use images from the same CT series", "Remove duplicate slices and verify their order"],
  retryable: false,
};
