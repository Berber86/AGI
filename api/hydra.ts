type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  send: (body: string) => VercelResponse;
};

const HYDRA_URL = "https://api.hydraai.ru/v1/chat/completions";

/**
 * Same-origin proxy for the game. The browser sends prompts here; the Hydra
 * secret is read only by the Vercel Function and is never bundled into Vite.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).setHeader("Allow", "POST").json({ error: { message: "Только POST." } });
  }

  const key = process.env.HYDRA_API_KEY?.trim();
  if (!key) {
    return res.status(500).json({ error: { message: "На Vercel не задана переменная HYDRA_API_KEY." } });
  }

  const body = req.body && typeof req.body === "object" ? req.body as Record<string, unknown> : {};
  const payload = {
    model: typeof body.model === "string" ? body.model : "gpt-6-luna",
    messages: Array.isArray(body.messages) ? body.messages : [],
    temperature: typeof body.temperature === "number" ? body.temperature : 0.8,
    max_tokens: typeof body.max_tokens === "number" ? body.max_tokens : 1200,
    ...(body.response_format ? { response_format: body.response_format } : {}),
  };

  try {
    const upstream = await fetch(HYDRA_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    return res.status(upstream.status)
      .setHeader("Content-Type", upstream.headers.get("content-type") || "application/json")
      .setHeader("Cache-Control", "no-store")
      .send(text);
  } catch {
    return res.status(502).json({ error: { message: "Нет связи с Hydra API." } });
  }
}
