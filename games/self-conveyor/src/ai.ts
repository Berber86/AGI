// ===== ИИ-действия конвейера (промпты + разбор ответов) =====
import { llmChat, extractJSON, type LLMCfg } from './llm';

const SYS = `Ты — помощник персональной системы продуктивности «Конвейер управления собой».
Отвечай по-русски, кратко и по делу. Без воды, без морализаторства.
Твоя роль — инструмент: дивергенция (мозговой штурм), декомпозиция и критика.
Решения принимает человек — не навязывай ему приоритеты.`;

async function ask(cfg: LLMCfg, user: string, json = false, temperature = 0.7): Promise<string> {
  return llmChat(
    cfg,
    [
      { role: 'system', content: SYS },
      { role: 'user', content: user },
    ],
    { json, temperature },
  );
}

// --- SMART-формулировка желания ---
export interface SmartFormulation {
  title: string;
  criteria: string;
  result: string;
}

export async function aiSmartFormulate(cfg: LLMCfg, desire: string, notes: string): Promise<SmartFormulation> {
  const raw = await ask(
    cfg,
    `Переформулируй желание в цель по правилам:
1) совершенный вид глагола («что сделать», не «что делать»);
2) измеримость (количественно или явный критерий достижения);
3) достижимость для обычного человека.
Желание: «${desire}»
Контекст: ${notes || 'нет'}
Верни JSON: {"title": "новая формулировка", "criteria": "как пойму, что достигнуто", "result": "какой осязаемый результат я получу (1 фраза)"}`,
    true,
    0.4,
  );
  return extractJSON<SmartFormulation>(raw);
}

// --- Декомпозиция цели на атомарные шаги ---
export interface Decomposition {
  steps: string[];
}

export async function aiDecompose(cfg: LLMCfg, goal: string, notes: string): Promise<Decomposition> {
  const raw = await ask(
    cfg,
    `Разбей цель на 5–12 атомарных шагов.
Требования к шагам: короткие, конкретные, очевидные при выполнении (без размышлений), каждый — действие с осязаемым результатом.
Цель: «${goal}»
Контекст: ${notes || 'нет'}
Верни JSON: {"steps": ["шаг 1", "шаг 2"]}`,
    true,
    0.5,
  );
  return extractJSON<Decomposition>(raw);
}

// --- «Прокурор»: критика желания при фильтрации ---
export async function aiProsecute(cfg: LLMCfg, desire: string, notes: string): Promise<string> {
  return ask(
    cfg,
    `Ты — прокурор, а не адвокат. Найди слабые места этого желания:
— это навязано извне (ожидания, реклама, «так надо»)?
— это минутная слабость / эйфория?
— какой здесь риск ложной продуктивности (движение без результата)?
— что будет, если этого НЕ сделать (реально важное потеряем)?
Желание: «${desire}»
Контекст: ${notes || 'нет'}
Дай 4–7 коротких тезисов списком. Вердикт выносит человек.`,
    false,
    0.6,
  );
}

// --- Мозговой штурм (дивергенция) ---
export async function aiBrainstorm(cfg: LLMCfg, prompt: string): Promise<string[]> {
  const raw = await ask(
    cfg,
    `${prompt}
Верни JSON: {"ideas": ["идея 1", "идея 2", ...]} — 8–12 коротких конкретных идей.`,
    true,
    0.9,
  );
  return extractJSON<{ ideas: string[] }>(raw).ideas ?? [];
}

// --- Триаж входящего потока (мысли, брейншторм) ---
export interface TriageResult {
  desires: string[];
  projects: { title: string; steps: string[] }[];
  junk: string[];
}

export async function aiTriage(cfg: LLMCfg, text: string): Promise<TriageResult> {
  const raw = await ask(
    cfg,
    `Разбери «входящее» — поток мыслей/идей/задач — на категории:
— desires: короткие желания/хотелки (в список желаний);
— projects: оформленные идеи с конкретным результатом (title + 3–8 атомарных шагов);
— junk: мусор, хлам, бессмысленное, повторы.
Текст:
"""
${text}
"""
Верни JSON: {"desires": [], "projects": [{"title": "", "steps": []}], "junk": []}`,
    true,
    0.4,
  );
  return extractJSON<TriageResult>(raw);
}

// --- Ретроспектива (PDCA, стадия Act) ---
export async function aiRetro(cfg: LLMCfg, statsJson: string): Promise<string> {
  return ask(
    cfg,
    `Данные итерации конвейера (статистика закрытых/сорванных дел, метрики, заметки):
${statsJson}
Проведи ретроспективу в формате:
1) Что работает (2–4 тезиса)
2) Что буксует и почему (2–4 тезиса, с гипотезами причин)
3) Точечные изменения конвейера на следующую итерацию (3–5 конкретных правок)
Без общих слов. Только выводы из цифр.`,
    false,
    0.5,
  );
}

// --- HADI: предложить проверочный эксперимент ---
export interface HadiSuggestion {
  action: string;
  data: string;
}

export async function aiHadi(cfg: LLMCfg, hypothesis: string): Promise<HadiSuggestion> {
  const raw = await ask(
    cfg,
    `Гипотеза (из цикла HADI): «${hypothesis}»
Предложи один дешёвый быстрый эксперимент для её проверки:
— action: что именно сделать (одно действие, измеримое);
— data: какие данные собрать и какой результат подтвердит/опровергнет гипотезу.
Верни JSON: {"action": "", "data": ""}`,
    true,
    0.5,
  );
  return extractJSON<HadiSuggestion>(raw);
}

// --- Тест подключения ---
export async function aiPing(cfg: LLMCfg): Promise<string> {
  const raw = await llmChat(cfg, [
    { role: 'user', content: 'Ответь одним словом: готов' },
  ]);
  return raw.trim().slice(0, 60);
}
