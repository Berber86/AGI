// ===== ИИ-подсказка протокола избегания (единственный ИИ-хук продукта) =====
import { llmChat, extractJSON, type LLMCfg } from './llm';

export interface ProtocolHelp {
  fears: string[];
  microStep: string;
}

/** Помогает назвать страх и сформулировать микро-шаг «сделать плохо, на 2 минуты». */
export async function aiProtocolHelp(cfg: LLMCfg, title: string, notes: string): Promise<ProtocolHelp> {
  const raw = await llmChat(
    cfg,
    [
      {
        role: 'system',
        content:
          'Ты — короткий терапевтический помощник от прокрастинации. Прокрастинация — избегание негативной эмоции, а не лень. Отвечай по-русски, кратко, без морализаторства.',
      },
      {
        role: 'user',
        content: `Человек избегает дела: «${title}»
Контекст: ${notes || 'нет'}

1) Предложи 3–4 коротких варианта, какой страх/эмоция может стоять за избеганием (одна фраза каждый: «получится плохо и…», «непонятно с чего начать», «надоедливо/скучно», «огромно и пугает» и т.п. — подбери под дело).
2) Предложи один микро-шаг: конкретное физическое действие на 2 минуты, которое человек имеет право сделать ПЛОХО (без качества, без результата — только старт).

Верни JSON: {"fears": ["…", "…"], "microStep": "…"}`,
      },
    ],
    { json: true, temperature: 0.7 },
  );
  return extractJSON<ProtocolHelp>(raw);
}

/** Тест подключения */
export async function aiPing(cfg: LLMCfg): Promise<string> {
  const raw = await llmChat(cfg, [{ role: 'user', content: 'Ответь одним словом: готов' }]);
  return raw.trim().slice(0, 60);
}
