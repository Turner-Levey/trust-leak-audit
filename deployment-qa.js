const qaStorageKey = "trustLeakQaBaseUrl";

const indexablePages = [
  { label: "Toolkit hub", path: "/" },
  { label: "Trust score", path: "/trust-score.html" },
  { label: "ROAS calculator", path: "/roas-calculator.html" },
  { label: "LTV:CAC calculator", path: "/ltv-cac-calculator.html" },
  { label: "Lead funnel calculator", path: "/lead-funnel-calculator.html" },
  { label: "Agency margin calculator", path: "/agency-margin-calculator.html" },
  { label: "SaaS payback calculator", path: "/saas-payback-calculator.html" },
  { label: "Paid traffic break-even calculator", path: "/paid-traffic-break-even-calculator.html" },
  { label: "Local service lead value calculator", path: "/local-service-lead-value-calculator.html" },
  { label: "Ecommerce conversion trust checklist", path: "/ecommerce-conversion-trust-checklist.html" },
  { label: "Sample reports", path: "/sample-reports.html" },
  { label: "Launch notes", path: "/launch-notes.html" },
  { label: "SEC trigger briefs hub", path: "/sec-trigger-briefs-hub.html" },
  { label: "SEC filing trigger briefs", path: "/sec-filing-trigger-briefs.html" },
  { label: "SEC auditor-change briefs", path: "/sec-auditor-change-briefs.html" },
  { label: "SEC leadership-change briefs", path: "/sec-leadership-change-briefs.html" }
];

const operatorPages = [
  { label: "404 support page", path: "/404.html" },
  { label: "Local evidence log", path: "/analytics.html" },
  { label: "Launch kit", path: "/launch-kit.html" },
  { label: "Deployment QA", path: "/deployment-qa.html" }
];

const qaBaseUrl = document.querySelector("#qaBaseUrl");
const runDeploymentQa = document.querySelector("#runDeploymentQa");
const copyQaSummary = document.querySelector("#copyQaSummary");
const downloadQaReport = document.querySelector("#downloadQaReport");
const qaStatus = document.querySelector("#qaStatus");
const qaSummary = document.querySelector("#qaSummary");
const qaRows = document.querySelector("#qaRows");

let currentResults = [];

qaBaseUrl.value = readStoredBaseUrl();
qaSummary.innerHTML = renderSummaryStats({ pass: 0, warn: 0, fail: 0, total: 0 });

qaBaseUrl.addEventListener("input", () => {
  storeBaseUrl(qaBaseUrl.value);
  qaStatus.textContent = normalizeBaseUrl(qaBaseUrl.value)
    ? `Ready to check ${normalizeBaseUrl(qaBaseUrl.value)}.`
    : "Enter the deployed URL or run from the deployed host.";
});

runDeploymentQa.addEventListener("click", () => {
  runQa();
});

copyQaSummary.addEventListener("click", async () => {
  await copyText(renderReport(currentResults), copyQaSummary, "Copied");
  track("deployment_qa_summary_copied", { checks: currentResults.length });
});

downloadQaReport.addEventListener("click", () => {
  downloadText(renderReport(currentResults), `trust-leak-deployment-qa-${new Date().toISOString().slice(0, 10)}.md`, "text/markdown;charset=utf-8");
  setButtonFeedback(downloadQaReport, "Downloaded");
  track("deployment_qa_report_downloaded", { checks: currentResults.length });
});

if (normalizeBaseUrl(qaBaseUrl.value)) {
  qaStatus.textContent = `Ready to check ${normalizeBaseUrl(qaBaseUrl.value)}.`;
}

async function runQa() {
  const baseUrl = normalizeBaseUrl(qaBaseUrl.value);
  currentResults = [];
  renderRows();

  if (!baseUrl) {
    addResult("Setup", "Public site URL", "fail", "Enter an http:// or https:// site URL before running QA.");
    finishRun();
    return;
  }

  runDeploymentQa.disabled = true;
  runDeploymentQa.textContent = "Checking...";
  qaStatus.textContent = `Checking ${baseUrl}.`;
  track("deployment_qa_started", { baseUrl });

  let sitemapUrls = [];
  try {
    sitemapUrls = await checkSitemap(baseUrl);
    await checkRobots(baseUrl);
    await checkManifest(baseUrl);
    await checkLlms(baseUrl);
    await checkTrafficBeacon(baseUrl);

    for (const page of indexablePages) {
      await checkHtmlPage(baseUrl, page, { shouldIndex: true, sitemapUrls });
    }

    for (const page of operatorPages) {
      await checkHtmlPage(baseUrl, page, { shouldIndex: false, sitemapUrls });
    }
  } catch (error) {
    addResult("Runtime", "QA runner", "fail", error.message || "Unexpected QA failure.");
  }

  finishRun();
}

async function checkSitemap(baseUrl) {
  const sitemapUrl = buildPageUrl(baseUrl, "/sitemap.xml");
  const response = await fetchText(sitemapUrl);
  if (!response.ok) {
    addResult("Sitemap", "sitemap.xml fetch", "fail", `${response.status} ${response.statusText}`);
    return [];
  }

  const locs = [...response.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expectedUrls = indexablePages.map(page => buildPageUrl(baseUrl, page.path));
  const missing = expectedUrls.filter(url => !locs.includes(url));
  const blocked = operatorPages.map(page => buildPageUrl(baseUrl, page.path)).filter(url => locs.includes(url));
  const unexpected = locs.filter(url => !expectedUrls.includes(url));

  addResult("Sitemap", "URL count", locs.length === expectedUrls.length ? "pass" : "warn", `Found ${locs.length}; expected ${expectedUrls.length} indexable URLs.`);
  addResult("Sitemap", "Indexable URL coverage", missing.length ? "fail" : "pass", missing.length ? `Missing ${missing.length}: ${missing.join(", ")}` : `${locs.length} sitemap URLs include every indexable page.`);
  addResult("Sitemap", "Operator page exclusion", blocked.length ? "fail" : "pass", blocked.length ? `Operator URLs in sitemap: ${blocked.join(", ")}` : "No operator/noindex pages are listed.");
  addResult("Sitemap", "Unexpected URLs", unexpected.length ? "warn" : "pass", unexpected.length ? unexpected.join(", ") : "No untracked URLs are listed.");
  return locs;
}

async function checkRobots(baseUrl) {
  const robotsUrl = buildPageUrl(baseUrl, "/robots.txt");
  const response = await fetchText(robotsUrl);
  if (!response.ok) {
    addResult("Robots", "robots.txt fetch", "fail", `${response.status} ${response.statusText}`);
    return;
  }

  const expectedSitemap = `Sitemap: ${buildPageUrl(baseUrl, "/sitemap.xml")}`;
  addResult("Robots", "Sitemap line", response.text.includes(expectedSitemap) ? "pass" : "fail", response.text.includes(expectedSitemap) ? expectedSitemap : "Missing absolute sitemap URL for this host.");

  const missingDisallows = operatorPages
    .filter(page => !response.text.includes(`Disallow: ${page.path}`))
    .map(page => page.path);
  addResult("Robots", "Operator disallow lines", missingDisallows.length ? "warn" : "pass", missingDisallows.length ? `Missing disallow lines: ${missingDisallows.join(", ")}` : "Operator pages are disallowed.");
}

async function checkManifest(baseUrl) {
  const response = await fetchText(buildPageUrl(baseUrl, "/site-manifest.json"));
  if (!response.ok) {
    addResult("Manifest", "site-manifest.json fetch", "fail", `${response.status} ${response.statusText}`);
    return;
  }

  try {
    const manifest = JSON.parse(response.text);
    const knownPaths = new Set(indexablePages.map(page => page.path));
    addResult("Manifest", "start_url", knownPaths.has(manifest.start_url) ? "pass" : "fail", manifest.start_url || "Missing start_url.");

    const shortcuts = manifest.shortcuts || [];
    const missing = shortcuts.filter(shortcut => !knownPaths.has(shortcut.url)).map(shortcut => shortcut.url);
    addResult("Manifest", "Shortcut targets", missing.length ? "fail" : "pass", missing.length ? `Missing shortcut targets: ${missing.join(", ")}` : `${shortcuts.length} shortcuts point to known indexable pages.`);
  } catch (error) {
    addResult("Manifest", "JSON parse", "fail", error.message);
  }
}

async function checkLlms(baseUrl) {
  const llmsUrl = buildPageUrl(baseUrl, "/llms.txt");
  const response = await fetchText(llmsUrl);
  if (!response.ok) {
    addResult("Discovery", "llms.txt fetch", "fail", `${response.status} ${response.statusText}`);
    return;
  }

  addResult("Discovery", "llms.txt fetch", "pass", llmsUrl);

  const expectedUrls = indexablePages.map(page => buildPageUrl(baseUrl, page.path));
  const missing = expectedUrls.filter(url => !response.text.includes(url));
  const blocked = operatorPages.map(page => buildPageUrl(baseUrl, page.path)).filter(url => response.text.includes(url));
  const expectedSitemap = buildPageUrl(baseUrl, "/sitemap.xml");

  addResult("Discovery", "llms.txt indexable URL coverage", missing.length ? "fail" : "pass", missing.length ? `Missing ${missing.length}: ${missing.join(", ")}` : `${expectedUrls.length} indexable URLs listed.`);
  addResult("Discovery", "llms.txt operator exclusion", blocked.length ? "fail" : "pass", blocked.length ? `Operator URLs in llms.txt: ${blocked.join(", ")}` : "No operator/noindex pages are listed.");
  addResult("Discovery", "llms.txt sitemap reference", response.text.includes(expectedSitemap) ? "pass" : "fail", response.text.includes(expectedSitemap) ? expectedSitemap : "Missing absolute sitemap URL.");
}

async function checkTrafficBeacon(baseUrl) {
  const endpoint = buildPageUrl(baseUrl, "/api/track");
  try {
    const response = await fetch(endpoint, { method: "OPTIONS", cache: "no-store" });
    addResult("Analytics", "No-key traffic beacon endpoint", response.ok ? "pass" : "fail", `${endpoint} returned ${response.status} ${response.statusText}.`);
  } catch (error) {
    addResult("Analytics", "No-key traffic beacon endpoint", "fail", error.message || "Fetch failed.");
  }
}

async function checkHtmlPage(baseUrl, page, options) {
  const url = buildPageUrl(baseUrl, page.path);
  const response = await fetchText(url);
  const area = options.shouldIndex ? "Indexable page" : "Operator page";

  if (!response.ok) {
    addResult(area, page.label, "fail", `${url} returned ${response.status} ${response.statusText}`);
    return;
  }

  const doc = new DOMParser().parseFromString(response.text, "text/html");
  addResult(area, `${page.label} loads`, "pass", url);

  const robots = getMeta(doc, "name", "robots").toLowerCase();
  if (options.shouldIndex) {
    addResult("Metadata", `${page.label} indexable`, robots.includes("noindex") ? "fail" : "pass", robots || "No robots meta found.");
  } else {
    addResult("Metadata", `${page.label} noindex`, robots.includes("noindex") ? "pass" : "fail", robots || "No noindex robots meta found.");
  }

  const expectedUrl = buildPageUrl(baseUrl, page.path);
  const canonical = getCanonical(doc);
  addResult("Metadata", `${page.label} canonical`, canonical === expectedUrl ? "pass" : "fail", canonical ? `Expected ${expectedUrl}; found ${canonical}` : "Missing canonical URL.");

  const ogUrl = getMeta(doc, "property", "og:url");
  addResult("Metadata", `${page.label} og:url`, ogUrl === expectedUrl ? "pass" : "fail", ogUrl ? `Expected ${expectedUrl}; found ${ogUrl}` : "Missing og:url.");

  const ogImage = getMeta(doc, "property", "og:image");
  const twitterImage = getMeta(doc, "name", "twitter:image");
  const imageStatus = ogImage && isAbsoluteHttpUrl(ogImage) && twitterImage === ogImage;
  addResult("Social", `${page.label} image metadata`, imageStatus ? "pass" : "fail", imageStatus ? ogImage : `og:image=${ogImage || "missing"} twitter:image=${twitterImage || "missing"}`);

  if (ogImage && isAbsoluteHttpUrl(ogImage)) {
    const imageResponse = await fetchText(ogImage);
    addResult("Social", `${page.label} image asset`, imageResponse.ok ? "pass" : "fail", imageResponse.ok ? ogImage : `${ogImage} returned ${imageResponse.status} ${imageResponse.statusText}`);
  }

  const jsonLdBlocks = [...response.text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const jsonLdErrors = jsonLdBlocks.map(([, block]) => parseJsonLd(block)).filter(Boolean);
  addResult("Structured data", `${page.label} JSON-LD`, jsonLdErrors.length ? "fail" : "pass", jsonLdErrors.length ? jsonLdErrors.join("; ") : `${jsonLdBlocks.length} block(s) parsed.`);

  if (options.shouldIndex) {
    const inSitemap = options.sitemapUrls.includes(expectedUrl);
    addResult("Sitemap", `${page.label} listed`, inSitemap ? "pass" : "fail", inSitemap ? "Listed in sitemap." : `${expectedUrl} not found in sitemap.`);

    const scriptSources = [...doc.querySelectorAll("script[src]")].map(script => script.getAttribute("src"));
    const hasEventLog = scriptSources.includes("event-log.js");
    const hasShareTools = scriptSources.includes("share-tools.js");
    const hasVercelAnalytics = response.text.includes("window.va") && scriptSources.includes("/_vercel/insights/script.js");
    addResult("Events", `${page.label} event logger`, hasEventLog ? "pass" : "fail", hasEventLog ? "event-log.js is present." : "Missing event-log.js.");
    addResult("Sharing", `${page.label} share hooks`, hasShareTools ? "pass" : "fail", hasShareTools ? "share-tools.js is present." : "Missing share-tools.js.");
    addResult("Analytics", `${page.label} Vercel Web Analytics`, hasVercelAnalytics ? "pass" : "fail", hasVercelAnalytics ? "Vercel Web Analytics script is present." : "Missing Vercel Web Analytics script.");
  } else {
    const excluded = !options.sitemapUrls.includes(expectedUrl);
    addResult("Sitemap", `${page.label} excluded`, excluded ? "pass" : "fail", excluded ? "Not listed in sitemap." : `${expectedUrl} should not be in sitemap.`);
  }
}

async function fetchText(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      text: await response.text()
    };
  } catch (error) {
    return {
      ok: false,
      status: "network",
      statusText: error.message || "Fetch failed",
      text: ""
    };
  }
}

function addResult(area, check, status, evidence) {
  currentResults.push({
    area,
    check,
    status,
    evidence
  });
  renderRows();
}

function finishRun() {
  runDeploymentQa.disabled = false;
  runDeploymentQa.textContent = "Run QA";

  const counts = countResults(currentResults);
  qaSummary.innerHTML = renderSummaryStats(counts);
  qaStatus.textContent = counts.fail
    ? `QA found ${counts.fail} blocking issue(s) and ${counts.warn} warning(s).`
    : `QA passed with ${counts.warn} warning(s).`;

  track("deployment_qa_finished", counts);
}

function renderRows() {
  qaRows.innerHTML = currentResults.map(result => `
    <tr>
      <td>${escapeHtml(result.area)}</td>
      <td>${escapeHtml(result.check)}</td>
      <td><span class="status-pill ${escapeHtml(result.status)}">${escapeHtml(result.status)}</span></td>
      <td>${escapeHtml(result.evidence)}</td>
    </tr>
  `).join("");
}

function renderSummaryStats(counts) {
  return [
    { label: "Total checks", value: counts.total },
    { label: "Passed", value: counts.pass },
    { label: "Warnings", value: counts.warn },
    { label: "Blocking issues", value: counts.fail }
  ].map(item => `
    <div class="event-stat">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");
}

function countResults(results) {
  return results.reduce((counts, result) => {
    counts.total += 1;
    counts[result.status] += 1;
    return counts;
  }, { pass: 0, warn: 0, fail: 0, total: 0 });
}

function renderReport(results) {
  const baseUrl = normalizeBaseUrl(qaBaseUrl.value) || "not set";
  const counts = countResults(results);
  const lines = [
    "# Trust Leak Audit Deployment QA",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${baseUrl}`,
    `Checks: ${counts.total}`,
    `Passed: ${counts.pass}`,
    `Warnings: ${counts.warn}`,
    `Blocking issues: ${counts.fail}`,
    "",
    "## Results",
    ""
  ];

  if (!results.length) {
    lines.push("No QA run has been completed in this browser.");
  } else {
    for (const result of results) {
      lines.push(`- [${result.status.toUpperCase()}] ${result.area} - ${result.check}: ${result.evidence}`);
    }
  }

  lines.push("", "## Guardrails", "", "- This is same-origin deployment QA, not traffic evidence.", "- Use host logs or analytics for visitor data.", "- Use only user-owned accounts for submissions.");
  return lines.join("\n");
}

function buildPageUrl(baseUrl, path) {
  if (path === "/") return `${baseUrl}/`;
  return new URL(path.replace(/^\//, ""), `${baseUrl}/`).toString();
}

function readStoredBaseUrl() {
  try {
    const stored = localStorage.getItem(qaStorageKey);
    if (stored) return stored;
  } catch {
    // Storage is optional for this operator page.
  }

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    const folder = window.location.pathname.replace(/\/[^/]*$/, "").replace(/\/$/, "");
    return `${window.location.origin}${folder}`;
  }

  return "";
}

function storeBaseUrl(value) {
  try {
    localStorage.setItem(qaStorageKey, value.trim());
  } catch {
    // Ignore storage failures.
  }
}

function normalizeBaseUrl(value) {
  const raw = value.trim();
  if (!raw) return "";

  try {
    const url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function getMeta(doc, attrName, attrValue) {
  return doc.querySelector(`meta[${attrName}="${attrValue}"]`)?.getAttribute("content") || "";
}

function getCanonical(doc) {
  return doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
}

function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseJsonLd(block) {
  try {
    JSON.parse(block);
    return "";
  } catch (error) {
    return error.message || "Invalid JSON-LD.";
  }
}

async function copyText(text, button, successText) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    fallbackCopy(text);
  }
  setButtonFeedback(button, successText);
}

function fallbackCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.top = "-1000px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function downloadText(text, fileName, type) {
  const blob = new Blob([`${text}\n`], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setButtonFeedback(button, text) {
  const oldText = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = oldText;
  }, 1200);
}

function track(name, detail = {}) {
  if (window.TrustLeakEvents) {
    window.TrustLeakEvents.track(name, detail);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
