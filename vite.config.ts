import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Connect, type PreviewServer, type ViteDevServer } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HYDRA_URL = "https://api.hydraai.ru/v1/chat/completions";

/**
 * Локальный двойник /api/hydra (серверной функции Vercel из api/hydra.js),
 * чтобы ключ ИИ так же автоматически подхватывался из окружения и во время
 * `npm run dev`/`vite preview` в этой песочнице — без единого ручного ввода
 * ключа где-либо в игре. На Vercel эту же роль играет api/hydra.js.
 */
function hydraDevProxy(key: string) {
  const middleware: Connect.NextHandleFunction = (req, res) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: { message: "Method not allowed" } }));
      return;
    }
    if (!key.trim()) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        error: { message: "Локально не задан HYDRA_API_KEY: добавьте его в .env (переменная HYDRA_API_KEY=...) или в окружение процесса. На Vercel — в Project Settings → Environment Variables." },
      }));
      return;
    }
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", async () => {
      try {
        const upstream = await fetch(HYDRA_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${key.trim()}`, "Content-Type": "application/json" },
          body: raw || "{}",
        });
        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader("Content-Type", "application/json");
        res.end(text);
      } catch {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: { message: "Нет связи с api.hydraai.ru." } }));
      }
    });
  };
  return {
    name: "hydra-dev-proxy",
    configureServer(server: ViteDevServer) { server.middlewares.use("/api/hydra", middleware); },
    configurePreviewServer(server: PreviewServer) { server.middlewares.use("/api/hydra", middleware); },
  };
}

export default defineConfig(({ mode }) => {
  // loadEnv читает .env-файлы без ограничения префиксом VITE_ — нужен прямой доступ
  // к серверной переменной HYDRA_API_KEY здесь, в Node-конфиге, а не в клиентском коде.
  const env = loadEnv(mode, process.cwd(), "");
  const hydraKey = env.HYDRA_API_KEY || process.env.HYDRA_API_KEY || "";

  return {
    plugins: [react(), tailwindcss(), viteSingleFile(), hydraDevProxy(hydraKey)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // The Arena preview is proxied under a generated host, so don't restrict it
    // to localhost. Bind to all interfaces for local and preview use alike.
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
    preview: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
