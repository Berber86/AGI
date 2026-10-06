// Vercel serverless function: прокси к Hydra API.
//
// Ключ больше никогда не вводится игроком и не попадает в браузер — он лежит
// только в переменной окружения, которую нужно один раз задать в настройках
// проекта на Vercel (Project Settings → Environment Variables).
// Клиент (src/game/cards.ts) обращается сюда по относительному пути /api/hydra
// без какого-либо ключа; эта функция сама подставляет Authorization-заголовок.
//
// Важно про окружения Vercel: переменная включается ОТДЕЛЬНО для Production,
// Preview и Development. Ключ, заданный только для Production, не виден
// превью-деплою pull request'а — тогда игра отвечает «ИИ недоступен», хотя
// «в настройках ключ есть». Чтобы это было видно сразу:
//   • GET /api/hydra — диагностика без ключа: жива ли функция, какое окружение
//     (VERCEL_ENV), найдена ли переменная и какой коммит задеплоен;
//   • ошибка 500 называет окружение, в котором ключа не оказалось.
// Ответ отдаётся базовым Node API (statusCode/setHeader/end), поэтому функция
// не зависит от Express-подобных хелперов рантайма.
const HYDRA_URL = "https://api.hydraai.ru/v1/chat/completions";

// Основное имя — HYDRA_API_KEY; два других принимаются на случай, если в панели
// Vercel переменная заведена под соседним именем. Значение ключа наружу не уходит.
const KEY_NAMES = ["HYDRA_API_KEY", "HYDRA_API_TOKEN", "HYDRA_KEY"];
const SETUP_HINT =
  "На Vercel: Project → Settings → Environment Variables → " +
  `${KEY_NAMES[0]} → отметить Production, Preview и Development → Save, затем Redeploy.`;

function readKey() {
  for (const name of KEY_NAMES) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return { name, value: value.trim() };
  }
  return null;
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  if (typeof res.status === "function") res.status(status);
  else res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  if (typeof res.send === "function") res.send(body);
  else res.end(body);
}

export default async function handler(req, res) {
  const env = process.env.VERCEL_ENV || "локальная сборка";
  const commit = String(process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7);
  const found = readKey();

  // Диагностика: можно открыть /api/hydra в браузере и увидеть, что знает функция.
  if (req.method === "GET") {
    sendJson(res, found ? 200 : 500, {
      ok: Boolean(found),
      runtime: "node",
      env,
      commit,
      keyFound: found ? found.name : null,
      upstream: HYDRA_URL,
      hint: found
        ? "Прокси готов: POST /api/hydra принимает запросы к модели."
        : `Переменная ${KEY_NAMES[0]} не видна в окружении «${env}». ${SETUP_HINT}`,
    });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: { message: "Method not allowed" } });
    return;
  }

  if (!found) {
    sendJson(res, 500, {
      error: {
        message:
          `Сервер не настроен: ${KEY_NAMES[0]} не задана для окружения «${env}». ${SETUP_HINT}`,
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
      headers: { Authorization: `Bearer ${found.value}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", "application/json");
    res.end(text);
  } catch (e) {
    sendJson(res, 502, {
      error: { message: `Нет связи с api.hydraai.ru (окружение «${env}»).` },
    });
  }
}
