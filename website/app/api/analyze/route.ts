const RETRYABLE_STATUS = new Set([502, 503, 504]);

function backendHeaders() {
  const headers: Record<string, string> = {};
  if (process.env.CLYRA_BACKEND_API_KEY) headers["X-CLYRA-API-Key"] = process.env.CLYRA_BACKEND_API_KEY;
  if (process.env.CLYRA_BACKEND_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.CLYRA_BACKEND_BEARER_TOKEN}`;
  return headers;
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function POST(request: Request) {
  const backendUrl = process.env.CLYRA_API_URL;
  if (!backendUrl) {
    return Response.json({ code: "MODEL_BACKEND_NOT_CONNECTED", message: "The external CLYRA model service has not been connected yet." }, { status: 503 });
  }
  try {
    const form = await request.formData();
    const mode = form.get("mode") === "sequence" ? "sequence" : "single";
    const target = `${backendUrl.replace(/\/$/, "")}/api/v1/analyze/${mode}`;
    const headers = backendHeaders();
    let response = await fetch(target, { method: "POST", headers, body: form, cache: "no-store" });

    // Free Hugging Face Spaces can sleep while idle. Wake the service and retry
    // once so a cold start does not immediately become a user-facing failure.
    if (RETRYABLE_STATUS.has(response.status)) {
      await fetch(backendUrl.replace(/\/$/, ""), { headers, cache: "no-store" }).catch(() => undefined);
      await wait(3500);
      response = await fetch(target, { method: "POST", headers, body: form, cache: "no-store" });
    }
    const contentType = response.headers.get("content-type") || "application/json";
    return new Response(response.body, { status: response.status, headers: { "content-type": contentType, "cache-control": "no-store" } });
  } catch {
    return Response.json({ code: "BACKEND_CONNECTION_FAILED", message: "Unable to reach the model service." }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 300;
