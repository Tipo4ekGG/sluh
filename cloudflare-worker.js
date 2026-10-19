// Прокси для «Слушателя»: пересылает запросы на FreeCodex и добавляет заголовки,
// без которых браузер не пускает сайт к серверу (CORS).
// Вставить целиком в редактор Cloudflare Worker и нажать Deploy.

const TARGET = "https://freecodex.fun";          // куда пересылать
const ALLOWED = "https://tipo4ekgg.github.io";   // какой сайт может пользоваться прокси

export default {
  async fetch(req) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, content-type, x-api-key, anthropic-version",
      "Access-Control-Max-Age": "86400",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(req.url);
    const headers = new Headers(req.headers);
    ["origin", "referer", "host"].forEach((h) => headers.delete(h));

    const res = await fetch(TARGET + url.pathname + url.search, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
    });

    const out = new Response(res.body, res);
    Object.entries(cors).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  },
};
