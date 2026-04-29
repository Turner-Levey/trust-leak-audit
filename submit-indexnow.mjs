import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const siteUrl = normalizeSiteUrl(readOption("site-url") || process.env.SITE_URL || "");
const key = readOption("key") || process.env.INDEXNOW_KEY || "4f2e8d9c6b7a4f3a9e1c0d8b6a2f4c1e";
const endpoint = readOption("endpoint") || process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const dryRun = args.includes("--dry-run");
const sitemapPath = join(siteDir, "sitemap.xml");
const keyFile = `${key}.txt`;

if (!siteUrl) fail("Set SITE_URL or pass --site-url=https://example.com.");
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) fail("IndexNow key must be 8-128 alphanumeric/hyphen characters.");
if (!existsSync(join(siteDir, keyFile))) fail(`Missing IndexNow key file: ${keyFile}`);
if (!existsSync(sitemapPath)) fail("Missing sitemap.xml. Generate deployment metadata first.");

const sitemap = readFileSync(sitemapPath, "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (!urlList.length) fail("No sitemap URLs found.");

const host = new URL(siteUrl).host;
for (const url of urlList) {
  const parsed = new URL(url);
  if (parsed.host !== host) fail(`URL host mismatch: ${url}`);
}

const body = {
  host,
  key,
  keyLocation: `${siteUrl}/${keyFile}`,
  urlList
};

if (dryRun) {
  console.log(`Validated IndexNow payload for ${urlList.length} URLs.`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Key location: ${body.keyLocation}`);
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify(body)
});

const text = await response.text();
console.log(`IndexNow status: ${response.status}`);
if (text.trim()) console.log(text.trim());
if (![200, 202].includes(response.status)) {
  fail(`IndexNow submission failed with status ${response.status}.`);
}

function readOption(name) {
  const prefix = `--${name}=`;
  const match = args.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

function normalizeSiteUrl(value) {
  if (!value) return "";
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
