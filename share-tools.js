(function () {
  const robots = document.querySelector('meta[name="robots"]')?.content || "";
  if (/\bnoindex\b/i.test(robots)) return;

  const main = document.querySelector("main");
  if (!main || document.querySelector("[data-share-tools]")) return;

  if (!document.querySelector("[data-share-tools-style]")) {
    const style = document.createElement("style");
    style.dataset.shareToolsStyle = "true";
    style.textContent = `
      .share-strip{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 18px;padding:12px 0 14px;border-top:1px solid var(--line,#d9e2dc);border-bottom:1px solid var(--line,#d9e2dc)}
      .share-strip h2{font-size:1rem}
      .share-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}
      .share-status{min-width:120px;margin:0;color:var(--green-dark,#0f5238);font-size:.82rem;font-weight:800;text-align:right}
      @media (max-width:900px){.share-strip{align-items:stretch;flex-direction:column}.share-actions{justify-content:flex-start}.share-status{min-width:0;text-align:left}}
    `;
    document.head.appendChild(style);
  }

  const title = document.querySelector("h1")?.textContent.trim() || document.title.replace(/\s+/g, " ").trim();
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const slug = path === "/" ? "home" : path.split("/").pop().replace(/\.html$/, "");
  const statusId = `share-status-${slug.replace(/[^a-z0-9_-]/gi, "-")}`;

  const shareUrl = (medium) => {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    url.searchParams.set("utm_source", "visitor_share");
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", "trust_leak_toolkit");
    url.searchParams.set("utm_content", slug);
    return url.toString();
  };

  const panel = document.createElement("section");
  panel.className = "share-strip";
  panel.dataset.shareTools = "true";
  panel.setAttribute("aria-label", "Share this tool");
  panel.innerHTML = `
    <div>
      <p class="eyebrow">Share</p>
      <h2>Send this tool</h2>
    </div>
    <div class="share-actions">
      <button class="secondary compact-button" type="button" data-share-action="copy-link">Copy link</button>
      <button class="secondary compact-button" type="button" data-share-action="copy-summary">Copy summary</button>
      <button class="primary compact-button" type="button" data-share-action="native">Share</button>
    </div>
    <p class="share-status" id="${statusId}" role="status" aria-live="polite"></p>
  `;

  const anchor = document.querySelector(".page-hero") || document.querySelector(".topbar") || main.firstElementChild;
  if (anchor?.nextSibling) {
    main.insertBefore(panel, anchor.nextSibling);
  } else {
    main.appendChild(panel);
  }

  const status = panel.querySelector(".share-status");
  const nativeButton = panel.querySelector('[data-share-action="native"]');
  if (!navigator.share) nativeButton.hidden = true;

  const track = (name, detail) => {
    if (window.TrustLeakEvents?.track) window.TrustLeakEvents.track(name, detail);
  };

  const writeClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  };

  const setStatus = (message) => {
    status.textContent = message;
    window.setTimeout(() => {
      if (status.textContent === message) status.textContent = "";
    }, 3000);
  };

  panel.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-share-action]");
    if (!button) return;

    const action = button.dataset.shareAction;
    try {
      if (action === "copy-link") {
        await writeClipboard(shareUrl("copy_link"));
        setStatus("Link copied.");
        track("tool_share_link_copied", { slug, title });
      }

      if (action === "copy-summary") {
        const text = `${title}\n${shareUrl("copy_summary")}`;
        await writeClipboard(text);
        setStatus("Summary copied.");
        track("tool_share_summary_copied", { slug, title });
      }

      if (action === "native") {
        track("tool_share_native_started", { slug, title });
        await navigator.share({
          title,
          text: title,
          url: shareUrl("native_share")
        });
        setStatus("Shared.");
        track("tool_share_native_completed", { slug, title });
      }
    } catch (error) {
      setStatus("Share was not completed.");
      track("tool_share_action_failed", { slug, title, action });
    }
  });
})();
