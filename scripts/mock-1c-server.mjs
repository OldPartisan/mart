import { createServer } from "node:http";

const catalog = Array.from({ length: 20 }, (_, i) => ({
  externalId: `mock-${i + 1}`,
  sku: `SKU-${1000 + i}`,
  name: `Тестовый товар ${i + 1}`,
  price: 100 + i * 10,
  stock: 10 + i,
  unit: "шт",
  warehouseId: "main",
  updatedAt: new Date().toISOString(),
}));

createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/hs/site/v1/health") return res.end(JSON.stringify({ ok: true }));
  if (req.url?.startsWith("/hs/site/v1/catalog")) return res.end(JSON.stringify({ items: catalog, total: catalog.length }));
  if (req.url?.startsWith("/hs/site/v1/stocks")) return res.end(JSON.stringify({ items: catalog.map(({ externalId, stock, warehouseId }) => ({ externalId, stock, warehouseId })) }));
  if (req.method === "POST" && req.url === "/hs/site/v1/orders") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => res.end(JSON.stringify({ ok: true, orderNumber: `MOCK-${Date.now()}`, body: JSON.parse(body || "{}") })));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not found" }));
}).listen(4010, "127.0.0.1", () => console.log("mock 1C: http://127.0.0.1:4010"));
