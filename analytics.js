const eventStorageKey = "trustLeakToolEvents";

const eventSummary = document.querySelector("#eventSummary");
const eventSourceLine = document.querySelector("#eventSourceLine");
const eventTableBody = document.querySelector("#eventTableBody");
const copyEventJson = document.querySelector("#copyEventJson");
const downloadEventCsv = document.querySelector("#downloadEventCsv");
const clearEventLog = document.querySelector("#clearEventLog");

copyEventJson.addEventListener("click", async () => {
  await copyText(JSON.stringify(readEvents(), null, 2), copyEventJson, "Copied");
});

downloadEventCsv.addEventListener("click", () => {
  downloadText(toCsv(readEvents()), `trust-leak-events-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  setButtonFeedback(downloadEventCsv, "Downloaded");
});

clearEventLog.addEventListener("click", () => {
  try {
    localStorage.setItem(eventStorageKey, JSON.stringify([]));
  } catch {
    return;
  }
  render();
  setButtonFeedback(clearEventLog, "Cleared");
});

window.addEventListener("storage", render);
render();

function render() {
  const events = readEvents();
  const rows = events.map(normalizeEvent);
  const countsByName = countBy(rows, row => row.name);
  const pageViews = rows.filter(row => row.name === "page_view").length;
  const highIntent = rows.filter(row => /copied|downloaded|calculated|selected|changed/.test(row.name)).length;
  const pages = new Set(rows.map(row => row.pagePath).filter(Boolean));
  const topEvent = Object.entries(countsByName).sort((a, b) => b[1] - a[1])[0];

  eventSummary.innerHTML = [
    stat("Stored events", events.length),
    stat("Page views", pageViews),
    stat("Action events", highIntent),
    stat("Pages touched", pages.size)
  ].join("");

  const last = rows[rows.length - 1];
  eventSourceLine.textContent = last
    ? `Most recent: ${last.name} on ${last.pagePath || "unknown page"}${last.utmSource ? ` via ${last.utmSource}` : ""}${topEvent ? `; top event: ${topEvent[0]} (${topEvent[1]})` : ""}.`
    : "No local events stored yet. Open the toolkit pages in this browser, then return here to export the evidence log.";

  eventTableBody.innerHTML = rows
    .slice()
    .reverse()
    .slice(0, 80)
    .map(row => `
      <tr>
        <td>${escapeHtml(row.at)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.pagePath)}</td>
        <td>${escapeHtml(row.utmSource || row.referrer || "direct")}</td>
        <td>${escapeHtml(row.detailJson)}</td>
      </tr>
    `)
    .join("");
}

function normalizeEvent(event) {
  const source = event.source || {};
  return {
    at: event.at || "",
    name: event.name || "",
    pagePath: source.pagePath || event.pagePath || "",
    pageTitle: source.pageTitle || "",
    url: source.url || "",
    referrer: source.referrer || "",
    utmSource: source.utm_source || "",
    utmMedium: source.utm_medium || "",
    utmCampaign: source.utm_campaign || "",
    utmTerm: source.utm_term || "",
    utmContent: source.utm_content || "",
    detailJson: JSON.stringify(event.detail || {})
  };
}

function readEvents() {
  try {
    return JSON.parse(localStorage.getItem(eventStorageKey)) || [];
  } catch {
    return [];
  }
}

function countBy(rows, keyFn) {
  return rows.reduce((counts, row) => {
    const key = keyFn(row) || "unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function stat(label, value) {
  return `
    <div class="event-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `;
}

function toCsv(events) {
  const headers = [
    "at",
    "name",
    "page_path",
    "page_title",
    "url",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "detail_json"
  ];
  const rows = events.map(normalizeEvent).map(row => [
    row.at,
    row.name,
    row.pagePath,
    row.pageTitle,
    row.url,
    row.referrer,
    row.utmSource,
    row.utmMedium,
    row.utmCampaign,
    row.utmTerm,
    row.utmContent,
    row.detailJson
  ]);
  return [headers, ...rows].map(row => row.map(csvCell).join(",")).join("\n");
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

function csvCell(value) {
  return `"${String(value || "").replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
