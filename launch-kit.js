const launchStorageKey = "trustLeakLaunchSiteUrl";

const priorityLinks = [
  {
    surface: "Direct QA",
    label: "Toolkit hub",
    path: "/",
    source: "manual",
    medium: "qa",
    campaign: "launch_preflight",
    goal: "Confirm the live homepage, metadata, and first interaction path."
  },
  {
    surface: "Hacker News Show HN",
    label: "Toolkit hub",
    path: "/",
    source: "hackernews",
    medium: "show_hn",
    campaign: "free_tool_launch",
    goal: "Collect builder feedback on the browser-only tool."
  },
  {
    surface: "Reddit Feedback Friday",
    label: "Trust score",
    path: "/trust-score.html",
    source: "reddit",
    medium: "feedback_thread",
    campaign: "free_tool_launch",
    goal: "Ask for landing-page scoring feedback without cold outreach."
  },
  {
    surface: "Product Hunt",
    label: "Toolkit hub",
    path: "/",
    source: "producthunt",
    medium: "launch",
    campaign: "free_tool_launch",
    disableUtm: true,
    goal: "Test maker discovery if a user-owned maker account exists."
  },
  {
    surface: "Free tool directories",
    label: "Paid traffic break-even",
    path: "/paid-traffic-break-even-calculator.html",
    source: "directory",
    medium: "listing",
    campaign: "calculator_listing",
    goal: "List the highest commercial-intent calculator."
  },
  {
    surface: "Ecommerce communities",
    label: "Ecommerce trust checklist",
    path: "/ecommerce-conversion-trust-checklist.html",
    source: "community",
    medium: "feedback",
    campaign: "ecommerce_trust_checklist",
    goal: "Get product-page trust feedback from ecommerce operators."
  },
  {
    surface: "Agency communities",
    label: "Sample reports",
    path: "/sample-reports.html",
    source: "community",
    medium: "feedback",
    campaign: "sample_report_feedback",
    goal: "Show output quality and ask which report format is useful."
  },
  {
    surface: "Public-data buyers",
    label: "SEC trigger hub",
    path: "/sec-trigger-briefs-hub.html",
    source: "manual",
    medium: "buyer_route",
    campaign: "sec_trigger_pilot",
    goal: "Compare SEC trigger routes if the sprint pivots or hybridizes."
  }
];

const submissionTracker = [
  {
    day: "0",
    surface: "Direct manual QA",
    page: "Toolkit hub plus priority pages",
    path: "/",
    source: "manual",
    medium: "qa",
    campaign: "launch_preflight",
    requirement: "Public URL live; no account submission",
    firstMetric: "Deployment QA pass/warn/fail",
    copyAsset: "Deployment QA report",
    status: "Waiting for URL",
    notes: "Open hub, priority pages, sitemap, robots, analytics, launch kit, and deployment QA before posting."
  },
  {
    day: "0",
    surface: "Launch-kit packet",
    page: "Operator launch kit",
    path: "/launch-kit.html",
    source: "manual",
    medium: "operator",
    campaign: "launch_packet",
    requirement: "Public URL pasted into launch kit",
    firstMetric: "Packet downloaded or links copied",
    copyAsset: "Markdown launch packet",
    status: "Waiting for URL",
    notes: "Generate final UTM links and listing copy before any public submission."
  },
  {
    day: "1",
    surface: "Hacker News Show HN",
    page: "Toolkit hub",
    path: "/",
    source: "hackernews",
    medium: "show_hn",
    campaign: "free_tool_launch",
    requirement: "User-owned account; current Show HN norms checked",
    firstMetric: "Referral visits and qualitative comments",
    copyAsset: "Show HN draft",
    status: "Waiting for account and URL",
    notes: "Ask for product feedback; do not imply traction or revenue."
  },
  {
    day: "1",
    surface: "Reddit Feedback Friday",
    page: "Trust score",
    path: "/trust-score.html",
    source: "reddit",
    medium: "feedback_thread",
    campaign: "free_tool_launch",
    requirement: "User-owned account; active thread and subreddit rules checked",
    firstMetric: "Feedback replies and trust-score starts",
    copyAsset: "Feedback Friday draft",
    status: "Waiting for account and URL",
    notes: "Use only feedback-permitted threads and format the post as a critique request."
  },
  {
    day: "2",
    surface: "Product Hunt",
    page: "Toolkit hub",
    path: "/",
    source: "producthunt",
    medium: "launch",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "User-owned maker account; clean product URL; launch assets accepted",
    firstMetric: "Launch visits, comments, saves",
    copyAsset: "Product listing draft",
    status: "Account required; clean URL only",
    notes: "Product Hunt says shortened links and UTM/tracked links are not accepted. Use the canonical hub URL and rely on referrer evidence."
  },
  {
    day: "2",
    surface: "Zearches",
    page: "Toolkit hub",
    path: "/",
    source: "zearches",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; no account; clean homepage URL only",
    firstMetric: "Directory referral visits or indexed listing",
    copyAsset: "Free tool listing",
    status: "Ready after deploy; clean URL only",
    notes: "Zearches currently offers no-account free URL submission and rejects tracking, referral, redirect, and affiliate links. Submit the canonical hub URL under Software & SaaS Tools, SEO/Marketing/Growth, or Resources/Tools."
  },
  {
    day: "2",
    surface: "Tools Directory Online",
    page: "Paid traffic break-even calculator",
    path: "/paid-traffic-break-even-calculator.html",
    source: "toolsdirectoryonline",
    medium: "directory",
    campaign: "calculator_listing",
    disableUtm: true,
    requirement: "Public URL; no account; free listing review",
    firstMetric: "Directory referral visits and calculator starts",
    copyAsset: "Free tool listing",
    status: "Ready after deploy; clean URL preferred",
    notes: "Current submit page says free listing, no hidden fees, no account required, and accepts SaaS, marketing, ecommerce, productivity, analytics, and developer software categories."
  },
  {
    day: "3",
    surface: "ToolDirs",
    page: "Toolkit hub",
    path: "/",
    source: "tooldirs",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned sign-in; free/paid option checked before submission",
    firstMetric: "Directory referral visits or accepted listing",
    copyAsset: "Long directory listing",
    status: "Account and pricing check required",
    notes: "ToolDirs has a tool submission form with screenshots, logo, categories, and pricing model fields. Use only a free/manual option if available after sign-in; do not pay or fabricate screenshots."
  },
  {
    day: "3",
    surface: "Launching Next",
    page: "Toolkit hub",
    path: "/",
    source: "launchingnext",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; submitter name/email; captcha; no paid fast-track",
    firstMetric: "Accepted listing, newsletter mention, or referral visits",
    copyAsset: "Startup directory listing",
    status: "Manual after deploy; clean URL only",
    notes: "Launching Next currently has a free submission queue plus paid faster review. Use the canonical hub URL, select $0 planned marketing spend if asked, and do not pay to skip the queue."
  },
  {
    day: "2",
    surface: "FreeStuff.dev",
    page: "Paid traffic break-even calculator",
    path: "/paid-traffic-break-even-calculator.html",
    source: "freestuffdev",
    medium: "directory",
    campaign: "calculator_listing",
    requirement: "Public URL; directory rules checked",
    firstMetric: "Directory referral visits",
    copyAsset: "Free tool listing",
    status: "Waiting for URL",
    notes: "Submit the most commercially specific calculator if individual-tool listings are allowed."
  },
  {
    day: "2",
    surface: "DevHunt",
    page: "Toolkit hub",
    path: "/",
    source: "devhunt",
    medium: "directory",
    campaign: "free_tool_launch",
    requirement: "Public URL; listing rules checked",
    firstMetric: "Directory referral visits and saves",
    copyAsset: "Free tool listing",
    status: "Low priority unless dev-tool fit is clear",
    notes: "DevHunt is strongest for developer tools/open-source projects and publishes a long free-launch wait; do not pay to skip the queue."
  },
  {
    day: "2",
    surface: "Uneed",
    page: "Ecommerce trust checklist",
    path: "/ecommerce-conversion-trust-checklist.html",
    source: "uneed",
    medium: "directory",
    campaign: "ecommerce_trust_checklist",
    requirement: "Public URL; listing rules checked",
    firstMetric: "Checklist starts and exports",
    copyAsset: "Directory listing",
    status: "Account required",
    notes: "Uneed requires an account to submit. Use ecommerce-specific copy if category fit is available."
  },
  {
    day: "3",
    surface: "IndieTool",
    page: "Trust score",
    path: "/trust-score.html",
    source: "indietool",
    medium: "directory",
    campaign: "trust_score_listing",
    requirement: "Public URL; listing rules checked",
    firstMetric: "Tool starts and report exports",
    copyAsset: "Directory listing",
    status: "Waiting for URL",
    notes: "Submit only once to avoid duplicate hub/tool listings if rules prohibit repeats."
  },
  {
    day: "3",
    surface: "SaaSHub",
    page: "SaaS payback calculator",
    path: "/saas-payback-calculator.html",
    source: "saashub",
    medium: "directory",
    campaign: "saas_payback_listing",
    requirement: "Custom/public domain; category and listing rules checked",
    firstMetric: "SaaS calculator page views",
    copyAsset: "Directory listing",
    status: "Blocked until custom domain",
    notes: "SaaSHub's current submit page rejects products using free subdomains such as vercel.app. Revisit after a custom domain exists."
  },
  {
    day: "3",
    surface: "Twelve.tools",
    page: "Local service lead value calculator",
    path: "/local-service-lead-value-calculator.html",
    source: "twelvetools",
    medium: "directory",
    campaign: "local_service_listing",
    requirement: "Public URL; listing rules checked",
    firstMetric: "Calculator calculations",
    copyAsset: "Directory listing",
    status: "Waiting for URL",
    notes: "Use high-ticket local service PPC language."
  },
  {
    day: "4",
    surface: "500.tools",
    page: "Sample report gallery",
    path: "/sample-reports.html",
    source: "500tools",
    medium: "directory",
    campaign: "sample_report_listing",
    requirement: "Public URL; listing rules checked",
    firstMetric: "Sample snippet copies/downloads",
    copyAsset: "Directory listing",
    status: "Blocked by paid listing",
    notes: "500.tools currently requires a paid subscription. No spend under current operating policy."
  },
  {
    day: "4",
    surface: "NicheTools",
    page: "SEC trigger hub",
    path: "/sec-trigger-briefs-hub.html",
    source: "nichetools",
    medium: "directory",
    campaign: "sec_trigger_pilot",
    requirement: "Public URL; listing rules checked; non-investment framing",
    firstMetric: "SEC hub visits and route clicks",
    copyAsset: "SEC trigger buyer-route note",
    status: "Waiting for URL",
    notes: "Use only descriptive public-data positioning; no investment claims."
  }
];

const siteUrlInput = document.querySelector("#siteUrlInput");
const launchStatus = document.querySelector("#launchStatus");
const launchLinkRows = document.querySelector("#launchLinkRows");
const launchCopyGrid = document.querySelector("#launchCopyGrid");
const launchTrackerRows = document.querySelector("#launchTrackerRows");
const copyAllLinks = document.querySelector("#copyAllLinks");
const downloadLaunchPacket = document.querySelector("#downloadLaunchPacket");
const copyLaunchTracker = document.querySelector("#copyLaunchTracker");
const downloadLaunchTracker = document.querySelector("#downloadLaunchTracker");

siteUrlInput.value = readStoredBaseUrl();
siteUrlInput.addEventListener("input", () => {
  storeBaseUrl(siteUrlInput.value);
  render();
  track("launch_kit_url_changed", { hasUrl: Boolean(siteUrlInput.value.trim()) });
});

copyAllLinks.addEventListener("click", async () => {
  await copyText(renderLinkList(), copyAllLinks, "Copied");
  track("launch_kit_links_copied", { links: priorityLinks.length });
});

downloadLaunchPacket.addEventListener("click", () => {
  downloadText(renderPacket(), `trust-leak-launch-kit-${new Date().toISOString().slice(0, 10)}.md`, "text/markdown;charset=utf-8");
  setButtonFeedback(downloadLaunchPacket, "Downloaded");
  track("launch_kit_packet_downloaded", { links: priorityLinks.length });
});

copyLaunchTracker.addEventListener("click", async () => {
  await copyText(renderTrackerCsv(), copyLaunchTracker, "Copied");
  track("launch_kit_tracker_copied", { rows: submissionTracker.length });
});

downloadLaunchTracker.addEventListener("click", () => {
  downloadText(renderTrackerCsv(), `trust-leak-launch-tracker-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  setButtonFeedback(downloadLaunchTracker, "Downloaded");
  track("launch_kit_tracker_downloaded", { rows: submissionTracker.length });
});

launchLinkRows.addEventListener("click", async event => {
  const button = event.target.closest("button[data-copy-link]");
  if (!button) return;
  const link = buildLink(priorityLinks[Number(button.dataset.copyLink)]);
  await copyText(link, button, "Copied");
  track("launch_kit_link_copied", { surface: button.dataset.surface || "" });
});

launchCopyGrid.addEventListener("click", async event => {
  const button = event.target.closest("button[data-copy-draft]");
  if (!button) return;
  const draft = launchDrafts()[Number(button.dataset.copyDraft)];
  await copyText(draft.body, button, "Copied");
  track("launch_kit_copy_copied", { draft: draft.title });
});

render();

function render() {
  const baseUrl = normalizeBaseUrl(siteUrlInput.value);
  launchStatus.textContent = baseUrl
    ? `Generating tracked links for ${baseUrl}. These links are not submitted automatically.`
    : "Enter a public URL before launch. The current packet remains a no-key substitute until deployment exists.";

  launchLinkRows.innerHTML = priorityLinks.map((item, index) => {
    const link = buildLink(item);
    return `
      <tr>
        <td>${escapeHtml(item.surface)}</td>
        <td>${escapeHtml(item.label)}</td>
        <td>${escapeHtml(item.goal)}</td>
        <td><code>${escapeHtml(link)}</code></td>
        <td><button class="secondary compact-button" type="button" data-copy-link="${index}" data-surface="${escapeHtml(item.surface)}">Copy</button></td>
      </tr>
    `;
  }).join("");

  launchCopyGrid.innerHTML = launchDrafts().map((draft, index) => `
    <article class="launch-copy-card">
      <div class="panel-head">
        <div>
          <p class="eyebrow">${escapeHtml(draft.channel)}</p>
          <h3>${escapeHtml(draft.title)}</h3>
        </div>
        <button class="secondary compact-button" type="button" data-copy-draft="${index}">Copy</button>
      </div>
      <textarea class="snippet-box" readonly>${escapeHtml(draft.body)}</textarea>
    </article>
  `).join("");

  launchTrackerRows.innerHTML = submissionTracker.map(item => `
    <tr>
      <td>${escapeHtml(item.day)}</td>
      <td>${escapeHtml(item.surface)}</td>
      <td>${escapeHtml(item.page)}</td>
      <td>${escapeHtml(item.requirement)}</td>
      <td><code>${escapeHtml(buildLink(item))}</code></td>
      <td>${escapeHtml(item.firstMetric)}</td>
      <td>${escapeHtml(item.status)}</td>
    </tr>
  `).join("");
}

function launchDrafts() {
  const hub = buildLink(priorityLinks[0]);
  const showHn = buildLink(priorityLinks[1]);
  const trust = buildLink(priorityLinks[2]);
  const productHunt = buildLink(priorityLinks[3]);
  const paidTraffic = buildLink(priorityLinks[4]);
  const ecommerce = buildLink(priorityLinks[5]);
  const sec = buildLink(priorityLinks[7]);

  return [
    {
      channel: "Product Hunt",
      title: "Product listing",
      body: [
        "Name: Trust Leak Audit",
        "Tagline: Free browser-only landing page trust score and marketing math toolkit.",
        "",
        "Description:",
        "Trust Leak Audit helps founders, ecommerce operators, agencies, and growth teams score trust gaps, calculate marketing economics, and export Markdown audit drafts without signup.",
        "",
        `Launch URL: ${productHunt}`,
        "Category candidates: Marketing, SEO, CRO, Analytics, Startup tools, Calculators, Ecommerce, SaaS.",
        "Privacy note: Runs in the browser and does not upload page data."
      ].join("\n")
    },
    {
      channel: "Hacker News",
      title: "Show HN draft",
      body: [
        "Show HN: Trust Leak Audit - browser-only landing page trust score",
        "",
        "I built a free browser-only toolkit for scoring landing-page trust leaks and checking the marketing math behind paid traffic, CAC/LTV, funnels, and agency margins.",
        "",
        `URL: ${showHn}`,
        "",
        "It runs without signup and can export a Markdown audit draft. I would value feedback on whether the scoring rubric is useful or too subjective."
      ].join("\n")
    },
    {
      channel: "Reddit feedback",
      title: "Feedback Friday draft",
      body: [
        "Project: Trust Leak Audit",
        `URL: ${trust}`,
        "",
        "What it does: Browser-only landing page trust score plus calculators for ROAS, LTV:CAC, funnel revenue, and paid traffic break-even math.",
        "",
        "Specific feedback request: Is the trust-score output specific enough to help a founder improve a landing page, and which criteria feel missing or over-weighted?",
        "",
        "Note: No signup or payment is required."
      ].join("\n")
    },
    {
      channel: "Directory",
      title: "Free tool listing",
      body: [
        "Trust Leak Audit is a free browser-only toolkit for landing-page trust scoring and marketing math.",
        "",
        `Main URL: ${hub}`,
        `Paid traffic calculator: ${paidTraffic}`,
        `Ecommerce checklist: ${ecommerce}`,
        "",
        "It helps founders, ecommerce operators, agencies, and growth teams identify trust gaps, estimate break-even ad economics, and export Markdown audit drafts without signup."
      ].join("\n")
    },
    {
      channel: "Pivot route",
      title: "SEC trigger buyer-route note",
      body: [
        "SEC Filing Trigger Briefs is a no-key public-data pilot packaged as sample buyer routes for transaction, auditor-change, and leadership-change signals.",
        "",
        `Sample hub: ${sec}`,
        "",
        "Positioning: non-investment operational briefs for advisory, accounting, search, IR/comms, and public-company service teams. No investment advice, ratings, or outreach automation."
      ].join("\n")
    }
  ];
}

function renderLinkList() {
  return priorityLinks.map(item => `${item.surface} - ${item.label}: ${buildLink(item)}`).join("\n");
}

function renderPacket() {
  return [
    "# Trust Leak Audit Launch Kit",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Base URL: ${normalizeBaseUrl(siteUrlInput.value) || "not set"}`,
    "",
    "## Priority Links",
    "",
    renderLinkList(),
    "",
    "## Listing Copy",
    "",
    ...launchDrafts().flatMap(draft => [`### ${draft.title}`, "", draft.body, ""]),
    "## Submission Tracker",
    "",
    renderTrackerMarkdown(),
    "",
    "## Guardrails",
    "",
    "- Use only a real public URL and user-owned accounts.",
    "- Check platform rules before posting.",
    "- Ask for feedback where direct promotion is restricted.",
    "- Do not claim revenue, users, testimonials, or results that do not exist.",
    "- Treat local analytics export as per-browser evidence, not aggregate demand."
  ].join("\n");
}

function renderTrackerMarkdown() {
  const header = "| Day | Surface | Page | Requirement | First metric | Status |";
  const separator = "| --- | --- | --- | --- | --- | --- |";
  const rows = submissionTracker.map(item => [
    item.day,
    item.surface,
    item.page,
    item.requirement,
    item.firstMetric,
    item.status
  ].map(escapeMarkdownTable).join(" | "));
  return [header, separator, ...rows.map(row => `| ${row} |`)].join("\n");
}

function renderTrackerCsv() {
  const headers = [
    "day",
    "surface",
    "page",
    "tracked_url",
    "requirement",
    "first_metric",
    "copy_asset",
    "status",
    "notes"
  ];
  const rows = submissionTracker.map(item => [
    item.day,
    item.surface,
    item.page,
    buildLink(item),
    item.requirement,
    item.firstMetric,
    item.copyAsset,
    item.status,
    item.notes
  ]);

  return [headers, ...rows].map(row => row.map(escapeCsv).join(",")).join("\n");
}

function buildLink(item) {
  const baseUrl = normalizeBaseUrl(siteUrlInput.value) || "https://example.com";
  const url = new URL(item.path === "/" ? "./" : item.path.replace(/^\//, ""), `${baseUrl}/`);
  if (!item.disableUtm) {
    url.searchParams.set("utm_source", item.source);
    url.searchParams.set("utm_medium", item.medium);
    url.searchParams.set("utm_campaign", item.campaign);
  }
  return url.toString();
}

function readStoredBaseUrl() {
  try {
    const stored = localStorage.getItem(launchStorageKey);
    if (stored) return stored;
  } catch {
    // Ignore storage failures; launch links can still be generated manually.
  }

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    const folder = window.location.pathname.replace(/\/[^/]*$/, "").replace(/\/$/, "");
    return `${window.location.origin}${folder}`;
  }

  return "";
}

function storeBaseUrl(value) {
  try {
    localStorage.setItem(launchStorageKey, value.trim());
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
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeCsv(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function escapeMarkdownTable(value) {
  return String(value || "").replaceAll("|", "\\|");
}
