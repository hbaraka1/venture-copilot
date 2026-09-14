import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { runSourcingWorkflow } from "../../../packages/agents/src/orchestrator.mjs";
import { assertConfig, getConfig } from "../../../packages/shared/src/config.mjs";

const webRoot = fileURLToPath(new URL("../../web/public/", import.meta.url));
const config = getConfig();
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

async function body(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 100_000) throw new Error("Request body is too large");
  }
  return JSON.parse(raw || "{}");
}

function validThesis(thesis) {
  return thesis && typeof thesis.description === "string" && thesis.description.trim().length >= 20;
}

async function staticFile(pathname, response) {
  const requested = pathname === "/" ? "index.html" : pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(webRoot, safePath);
  try {
    if (!(await stat(filePath)).isFile()) throw new Error("not a file");
    response.writeHead(200, { "Content-Type": mime[extname(filePath)] ?? "application/octet-stream" });
    response.end(await readFile(filePath));
  } catch {
    json(response, 404, { error: "Not found" });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  if (request.method === "GET" && url.pathname === "/api/health") return json(response, 200, { ok: true, model: config.model });

  if (request.method === "POST" && url.pathname === "/api/screen") {
    try {
      assertConfig(config);
      const payload = await body(request);
      if (!validThesis(payload.thesis)) return json(response, 400, { error: "Add an investment thesis of at least 20 characters." });
      const result = await runSourcingWorkflow({ thesis: payload.thesis, config });
      return json(response, 200, result);
    } catch (error) {
      console.error(error);
      return json(response, 500, { error: error instanceof Error ? error.message : "Unexpected error" });
    }
  }

  if (request.method !== "GET") return json(response, 405, { error: "Method not allowed" });
  return staticFile(url.pathname, response);
});

server.listen(config.port, () => console.log(`Venture Copilot running at http://localhost:${config.port}`));
