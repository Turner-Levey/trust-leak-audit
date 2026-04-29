import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
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

const payload = JSON.stringify(body);
const result = await submitIndexNow(endpoint, payload);

console.log(`IndexNow status: ${result.status}`);
if (result.text.trim()) console.log(result.text.trim());
if (![200, 202].includes(result.status)) {
  fail(`IndexNow submission failed with status ${result.status}.`);
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

async function submitIndexNow(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: payload
    });
    return {
      status: response.status,
      text: await response.text()
    };
  } catch (error) {
    const code = error?.cause?.code || error?.code || error?.message || "unknown";
    console.error(`Fetch submission failed (${code}); retrying with curl.`);
    return submitWithCurl(url, payload);
  }
}

function submitWithCurl(url, payload) {
  const response = spawnSync("curl", [
    "--silent",
    "--show-error",
    "--max-time",
    "30",
    "--write-out",
    "\n%{http_code}",
    "--header",
    "Content-Type: application/json; charset=utf-8",
    "--data-binary",
    payload,
    url
  ], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });

  if (response.status !== 0) {
    const detail = response.stderr.trim() || response.stdout.trim() || `exit ${response.status}`;
    fail(`curl IndexNow submission failed: ${detail}`);
  }

  const output = response.stdout;
  const separator = output.lastIndexOf("\n");
  if (separator === -1) fail("curl IndexNow submission did not return an HTTP status.");

  return {
    text: output.slice(0, separator),
    status: Number(output.slice(separator + 1).trim())
  };
}
