# Инструкция по Деплою на GitHub Pages и Vercel

## 1. Сборка проекта
```bash
npm install
npm test
npm run build
```
Статические файлы сборки создаются в директории `dist/`.

## 2. GitHub Pages (GitHub Actions Workflow)
Для автоматического деплоя создайте файл `.github/workflows/deploy.yml` в вашем репозитории (требуется разрешение `workflows` в настройках токена):

```yaml
name: Deploy Cog Empires to GitHub Pages

on:
  push:
    branches: [ main, arena/01a0ca6d-agi ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
```

## 3. Деплой на Vercel
1. Импортируйте репозиторий в панели Vercel.
2. Build Command: `npm run build`
3. Output Directory: `dist`
