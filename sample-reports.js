const eventStorageKey = "trustLeakToolEvents";

document.querySelectorAll("[data-copy-target]").forEach(button => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    await copyText(target.value, button, "Copied");
    trackEvent("sample_snippet_copied", { target: button.dataset.copyTarget });
  });
});

document.querySelectorAll("[data-download-target]").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.downloadTarget);
    if (!target) return;
    downloadText(target.value, button.dataset.fileName || "trust-leak-snippet.md");
    setButtonFeedback(button, "Downloaded");
    trackEvent("sample_snippet_downloaded", { target: button.dataset.downloadTarget });
  });
});

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

function downloadText(text, fileName) {
  const blob = new Blob([`${text}\n`], { type: "text/markdown;charset=utf-8" });
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

function trackEvent(name, detail = {}) {
  if (window.TrustLeakEvents?.track) {
    window.TrustLeakEvents.track(name, detail);
    return;
  }

  const events = readEvents();
  events.push({
    name,
    detail,
    at: new Date().toISOString()
  });
  try {
    localStorage.setItem(eventStorageKey, JSON.stringify(events.slice(-200)));
  } catch {
    return;
  }
}

function readEvents() {
  if (window.TrustLeakEvents?.read) return window.TrustLeakEvents.read();

  try {
    return JSON.parse(localStorage.getItem(eventStorageKey)) || [];
  } catch {
    return [];
  }
}
