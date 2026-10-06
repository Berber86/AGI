const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const KEY = 'sk-test-hydra-secret';

/**
 * Прокси /api/hydra — единственное место, где живёт HYDRA_API_KEY. На Vercel переменная
 * включается отдельно для Production, Preview и Development, поэтому «ключ в проекте есть»
 * не гарантирует, что его видит превью pull request'а: функция обязана называть окружение,
 * в котором ключа не оказалось, и не требовать Express-хелперов рантайма.
 */
function loadHandler({ env = {}, fetchImpl = async () => ({ status: 200, text: async () => '{}' }) }) {
  const file = path.join(root, 'api', 'hydra.js');
  const source = fs.readFileSync(file, 'utf8').replace(
    'export default async function handler',
    'module.exports = async function handler',
  );
  const mod = { exports: {} };
  vm.runInNewContext(source, {
    module: mod, exports: mod.exports, process: { env }, fetch: fetchImpl, console, JSON,
  }, { filename: file });
  return mod.exports;
}

/** Ответ без status()/send(): проверяем базовый Node-путь (statusCode/setHeader/end). */
function plainRes() {
  const res = { statusCode: 200, headers: {}, body: null };
  res.setHeader = (key, value) => { res.headers[String(key).toLowerCase()] = value; };
  res.end = (body) => { res.body = body; };
  return res;
}

/** Ответ с Express-подобными хелперами Vercel-рантайма. */
function helperRes() {
  const res = { calls: [], headers: {} };
  res.setHeader = (key, value) => { res.headers[String(key).toLowerCase()] = value; };
  res.status = (code) => { res.calls.push(['status', code]); return res; };
  res.send = (body) => { res.calls.push(['send', body]); return res; };
  return res;
}

const json = (res) => JSON.parse(res.body ?? res.calls.find((c) => c[0] === 'send')?.[1] ?? 'null');

test('GET /api/hydra — диагностика: окружение видно, значение ключа наружу не уходит', async () => {
  const handler = loadHandler({ env: { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_SHA: 'abcdef1234567' } });
  const res = plainRes();
  await handler({ method: 'GET' }, res);

  assert.equal(res.statusCode, 500, 'без ключа диагностика отвечает ошибкой');
  const body = json(res);
  assert.equal(body.ok, false);
  assert.equal(body.env, 'preview', 'названо окружение Vercel, в котором ключа нет');
  assert.equal(body.commit, 'abcdef1', 'видно, какой коммит задеплоен');
  assert.equal(body.keyFound, null);
  assert.match(body.hint, /Environment Variables/iu, 'подсказка ведёт в настройки проекта');
  assert.match(body.hint, /Redeploy/iu);
  assert.doesNotMatch(res.body, new RegExp(KEY), 'значение ключа никогда не отдаётся');

  const ready = loadHandler({ env: { VERCEL_ENV: 'production', HYDRA_API_KEY: KEY } });
  const okRes = plainRes();
  await ready({ method: 'GET' }, okRes);
  assert.equal(okRes.statusCode, 200);
  const okBody = json(okRes);
  assert.equal(okBody.ok, true);
  assert.equal(okBody.keyFound, 'HYDRA_API_KEY', 'сообщается только имя переменной');
  assert.doesNotMatch(okRes.body, new RegExp(KEY), 'но не её значение');
  assert.equal(okBody.runtime, 'node');
});

test('POST без ключа объясняет, в каком окружении его не оказалось', async () => {
  const handler = loadHandler({ env: { VERCEL_ENV: 'preview' } });
  const res = plainRes();
  await handler({ method: 'POST', body: { model: 'gpt-6-luna' } }, res);

  assert.equal(res.statusCode, 500);
  assert.equal(res.headers['content-type'], 'application/json');
  assert.match(json(res).error.message, /HYDRA_API_KEY не задана для окружения «preview»/u);
  assert.match(json(res).error.message, /Production, Preview и Development/u, 'перечислены области действия переменной');
});

test('POST с ключом проксирует запрос к Hydra и возвращает ответ как есть', async () => {
  const calls = [];
  const handler = loadHandler({
    env: { VERCEL_ENV: 'production', HYDRA_API_KEY: ` ${KEY} ` },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return { status: 201, text: async () => '{"choices":[{"message":{"content":"готово"}}]}' };
    },
  });
  const payload = { model: 'glm-5.2', messages: [{ role: 'user', content: 'привет' }] };
  const res = plainRes();
  await handler({ method: 'POST', body: payload }, res);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.hydraai.ru/v1/chat/completions');
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${KEY}`, 'ключ подставляется на сервере и обрезается по краям');
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), payload, 'тело запроса проброшено без изменений');
  assert.equal(res.statusCode, 201, 'статус апстрима возвращается клиенту');
  assert.equal(res.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(res.body), { choices: [{ message: { content: 'готово' } }] });
  assert.doesNotMatch(res.body, new RegExp(KEY));
});

test('тело строкой парсится, соседние имена ключа принимаются, прочий метод — 405', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push(init); return { status: 200, text: async () => '{}' }; };

  const byString = loadHandler({ env: { HYDRA_API_KEY: KEY }, fetchImpl });
  await byString({ method: 'POST', body: JSON.stringify({ model: 'gpt-6-luna' }) }, plainRes());
  assert.deepEqual(JSON.parse(calls.at(-1).body), { model: 'gpt-6-luna' });

  const byToken = loadHandler({ env: { VERCEL_ENV: 'preview', HYDRA_API_TOKEN: KEY }, fetchImpl });
  const tokenRes = plainRes();
  await byToken({ method: 'GET' }, tokenRes);
  assert.equal(json(tokenRes).keyFound, 'HYDRA_API_TOKEN', 'ключ под соседним именем тоже подхватывается');
  await byToken({ method: 'POST', body: {} }, plainRes());
  assert.equal(calls.at(-1).headers.Authorization, `Bearer ${KEY}`);

  const res = plainRes();
  await byToken({ method: 'PUT' }, res);
  assert.equal(res.statusCode, 405);
});

test('нет связи с апстримом — 502 с понятной причиной, а не голый сбой функции', async () => {
  const handler = loadHandler({
    env: { VERCEL_ENV: 'preview', HYDRA_API_KEY: KEY },
    fetchImpl: async () => { throw new Error('ENOTFOUND'); },
  });
  const res = helperRes();
  await handler({ method: 'POST', body: {} }, res);

  const code = res.calls.find((c) => c[0] === 'status')?.[1];
  assert.equal(code, 502);
  assert.match(JSON.parse(res.calls.find((c) => c[0] === 'send')[1]).error.message, /Нет связи с api\.hydraai\.ru \(окружение «preview»\)/u);
  assert.equal(res.headers['content-type'], 'application/json');
});

test('клиент показывает причину из ответа прокси, а не общий «ИИ недоступен»', () => {
  const cards = fs.readFileSync(path.join(root, 'src', 'game', 'cards.ts'), 'utf8');
  assert.match(cards, /err\?\.error\?\.message \|\| `ИИ недоступен \(HTTP \$\{resp\.status\}\)\.`/u, 'probeApiKey отдаёт текст сервера');
  assert.match(cards, /data\.error\) throw new Error\(data\.error\.message \|\| "Ошибка API"\)/u, 'hydraChat — тоже');
  const forge = fs.readFileSync(path.join(root, 'src', 'pages', 'Forge.tsx'), 'utf8');
  assert.match(forge, /Советник недоступен: \$\{e\?\.message\}/u, 'сообщение доходит до игрока в тосте');
});
