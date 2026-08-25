export async function POST(request: Request) {
  const backendUrl = process.env.CLYRA_API_URL;
  try {
    const form = await request.formData();
    const mode = form.get("mode") === "sequence" ? "sequence" : "single";
    const headers: Record<string,string> = {};
    let target: string;

    if (backendUrl) {
      target = `${backendUrl.replace(/\/$/, "")}/api/v1/analyze/${mode}`;
      if (process.env.CLYRA_BACKEND_API_KEY) headers["X-CLYRA-API-Key"] = process.env.CLYRA_BACKEND_API_KEY;
      if (process.env.CLYRA_BACKEND_BEARER_TOKEN) headers.Authorization = `Bearer ${process.env.CLYRA_BACKEND_BEARER_TOKEN}`;
    } else {
      target = process.env.CLYRA_PROXY_URL || "https://clyra-brain-ct.samaareda-sr.chatgpt.site/api/analyze";
    }

    const response = await fetch(target, { method: "POST", headers, body: form });
    const contentType = response.headers.get("content-type") || "application/json";
    return new Response(response.body, { status: response.status, headers: { "content-type": contentType, "cache-control": "no-store" } });
  } catch {
    return Response.json({ code: "BACKEND_CONNECTION_FAILED", message: "Unable to reach the model service." }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 300;
