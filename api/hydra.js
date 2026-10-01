// Vercel serverless function: прокси к Hydra API.
//
// Ключ больше никогда не вводится игроком и не попадает в браузер — он лежит
// только в переменной окружения HYDRA_API_KEY, которую нужно один раз задать
// в настройках проекта на Vercel (Project Settings → Environment Variables).
// Клиент (src/game/cards.ts) обращается сюда по относительному пути /api/hydra
// без какого-либо ключа; эта функция сама подставляет Authorization-заголовок.
const HYDRA_URL = "https://api.hydraai.ru/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const key = process.env.HYDRA_API_KEY;
  if (!key || !key.trim()) {
    res.status(500).json({
      error: {
        message: "Сервер не настроен: переменная окружения HYDRA_API_KEY не задана на Vercel.",
      },
    });
    return;
  }

  let body = req.body;
  // Некоторые среды выполнения не парсят JSON-тело автоматически.
  if (!body || typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }

  try {
    const upstream = await fetch(HYDRA_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: { message: "Нет связи с api.hydraai.ru." } });
  }
}
