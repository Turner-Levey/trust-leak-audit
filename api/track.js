const maxBodyBytes = 16384;

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST, OPTIONS");
    res.end("Method Not Allowed");
    return;
  }

  const rawBody = await readBody(req);
  if (rawBody.length > maxBodyBytes) {
    res.statusCode = 413;
    res.end("Payload Too Large");
    return;
  }

  let event = {};
  try {
    event = JSON.parse(rawBody || "{}");
  } catch {
    res.statusCode = 400;
    res.end("Invalid JSON");
    return;
  }

  const source = event.source && typeof event.source === "object" ? event.source : {};
  const logLine = {
    type: "trust_leak_traffic_event",
    at: sanitizeText(event.at, 40),
    name: sanitizeText(event.name, 80),
    pagePath: sanitizeText(source.pagePath, 160),
    pageTitle: sanitizeText(source.pageTitle, 160),
    referrerHost: hostname(source.referrer),
    utmSource: sanitizeText(source.utm_source, 80),
    utmMedium: sanitizeText(source.utm_medium, 80),
    utmCampaign: sanitizeText(source.utm_campaign, 120),
    country: sanitizeText(req.headers["x-vercel-ip-country"], 8),
    userAgentFamily: userAgentFamily(req.headers["user-agent"])
  };

  console.log(JSON.stringify(logLine));
  res.statusCode = 204;
  res.end();
};

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodyBytes) return Buffer.concat(chunks).toString("utf8") + " ".repeat(maxBodyBytes + 1);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]/g, " ").slice(0, maxLength);
}

function hostname(value) {
  if (typeof value !== "string" || !value) return "";
  try {
    return new URL(value).hostname.slice(0, 160);
  } catch {
    return "";
  }
}

function userAgentFamily(value) {
  const ua = String(value || "").toLowerCase();
  if (ua.includes("googlebot")) return "Googlebot";
  if (ua.includes("bingbot")) return "Bingbot";
  if (ua.includes("slurp")) return "Yahoo";
  if (ua.includes("duckduckbot")) return "DuckDuckBot";
  if (ua.includes("baiduspider")) return "Baidu";
  if (ua.includes("yandexbot")) return "Yandex";
  if (ua.includes("facebookexternalhit")) return "Facebook";
  if (ua.includes("twitterbot")) return "Twitter";
  if (ua.includes("linkedinbot")) return "LinkedIn";
  if (ua.includes("curl")) return "curl";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  if (ua.includes("firefox")) return "Firefox";
  return ua ? "Other" : "";
}
