// ===== Клиент LLM (OpenAI-совместимый API: OpenRouter, OpenAI, DeepSeek, локальный Ollama и т.п.) =====
// Ключ хранится в localStorage браузера (Настройки) и уходит напрямую к провайдеру.

export interface LLMCfg {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function llmChat(
  cfg: LLMCfg,
  messages: ChatMsg[],
  opts?: { temperature?: number; json?: boolean },
): Promise<string> {
  if (!cfg.apiKey) throw new Error('Не задан API-ключ ИИ (Настройки → ИИ)');
  const base = cfg.baseUrl.replace(/\/+$/, '');
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
      'HTTP-Referer': location.origin,
      'X-Title': 'Self Conveyor',
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      temperature: opts?.temperature ?? 0.7,
      ...(opts?.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`LLM ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  if (!text.trim()) throw new Error('Пустой ответ модели');
  return text;
}

/** Достаёт JSON из ответа модели (с учётом ```json-блоков и мусора вокруг). */
export function extractJSON<T>(text: string): T {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fence ? fence[1] : text;
  const start = candidate.search(/[{[]/);
  if (start < 0) throw new Error('Модель не вернула JSON');
  const slice = candidate.slice(start);
  // Пробуем с конца по последнюю сбалансированную скобку
  for (let end = slice.length; end > 0; end--) {
    const ch = slice[end - 1];
    if (ch !== '}' && ch !== ']') continue;
    try {
      return JSON.parse(slice.slice(0, end)) as T;
    } catch {
      /* пробуем короче */
    }
  }
  throw new Error('Не удалось распарсить JSON из ответа модели');
}
