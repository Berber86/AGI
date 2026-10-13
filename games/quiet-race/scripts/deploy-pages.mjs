#!/usr/bin/env node
/**
 * Publishes the production build of «Тихая гонка» to the `gh-pages` branch of
 * this repository (the game now lives inside Berber86/AGI, so that is the
 * repository GitHub Pages serves).
 *
 * Layout of the published branch:
 *
 *   /index.html      маленькая страница со ссылкой на игру
 *   /quiet-race/...  сама игра (сборка dist/)
 *   /.nojekyll       чтобы GitHub Pages не прогонял файлы через Jekyll
 *
 * Everything is assembled in a temporary directory and pushed from there, so the
 * working tree, the branch you are on and .gitignore stay untouched.
 *
 * Usage: npm run deploy
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_PATH = '/AGI/quiet-race/';

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('Нет сборки. Сначала выполните: npm run build');
  process.exit(1);
}

let remote;
try {
  remote = execFileSync('git', ['-C', ROOT, 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
} catch {
  console.error('У репозитория нет remote «origin». Добавьте его и повторите.');
  process.exit(1);
}

const landing = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Arena Game Forge — игры</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0; min-height: 100dvh; display: grid; place-items: center;
        background: linear-gradient(180deg, #cdeeff 0%, #fff3d6 100%);
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #5a4632;
      }
      main { text-align: center; padding: 32px; }
      h1 { font-size: 40px; margin: 0 0 8px; }
      p { color: #6b8f5a; margin: 0 0 28px; }
      a.play {
        display: inline-block; padding: 22px 46px; border-radius: 999px;
        background: #7ed957; color: #2f5c1f; font-size: 26px; font-weight: 700;
        text-decoration: none; box-shadow: 0 6px 0 #4fae33;
      }
      a.play:active { transform: translateY(3px); box-shadow: 0 3px 0 #4fae33; }
      footer { margin-top: 26px; font-size: 15px; }
      footer a { color: #4d9fd1; }
    </style>
  </head>
  <body>
    <main>
      <h1>Тихая гонка 🏁</h1>
      <p>Неспешная гонка для маленькой гонщицы: без проигрыша, с обгонами и финишем-праздником</p>
      <a class="play" href="./quiet-race/">Играть</a>
      <footer>
        Сделано скиллом <a href="https://github.com/Berber86/AGI">arena-game-forge</a> ·
        <a href="https://github.com/Berber86/AGI/tree/main/games/quiet-race">исходники игры</a>
      </footer>
    </main>
  </body>
</html>
`;

const work = path.join(tmpdir(), `quiet-race-pages-${Date.now()}`);
mkdirSync(work, { recursive: true });
cpSync(DIST, path.join(work, 'quiet-race'), { recursive: true });
writeFileSync(path.join(work, '.nojekyll'), '');
writeFileSync(path.join(work, 'index.html'), landing, 'utf8');

const git = (...args) => execFileSync('git', ['-C', work, ...args], { stdio: 'inherit' });
const stamp = new Date().toISOString();

try {
  git('init', '-q', '-b', 'gh-pages');
  git('add', '-A');
  git(
    '-c',
    'user.name=Arena Agent',
    '-c',
    'user.email=agent@arena.ai',
    'commit',
    '-q',
    '-m',
    `Публикация «Тихой гонки» ${stamp}`,
  );
  git('push', '--force', remote, 'gh-pages');
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(`Ветка gh-pages обновлена: ${remote}`);
console.log(`Игра: https://berber86.github.io${SITE_PATH}`);
