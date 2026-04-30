(function () {
  const storageKey = "trustLeakToolEvents";
  const maxEvents = 500;
  const pageViewSessionPrefix = "trustLeakPageView:";
  const remoteEndpoint = "/api/track";
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  };

  const source = () => {
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(utmKeys.map(key => [key, params.get(key) || ""]));
    return {
      pagePath: window.location.pathname || "/",
      pageTitle: document.title || "",
      url: window.location.href.split("#")[0],
      referrer: document.referrer || "",
      ...utm
    };
  };

  const write = events => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(events.slice(-maxEvents)));
      window.dispatchEvent(new CustomEvent("trustLeakEventsUpdated"));
      return true;
    } catch {
      return false;
    }
  };

  const track = (name, detail = {}, options = {}) => {
    if (options.oncePerSession) {
      const onceKey = `${pageViewSessionPrefix}${name}:${window.location.pathname}${window.location.search}`;
      try {
        if (sessionStorage.getItem(onceKey)) return false;
        sessionStorage.setItem(onceKey, "1");
      } catch {
        return false;
      }
    }

    const events = read();
    const event = {
      name,
      detail,
      source: source(),
      at: new Date().toISOString()
    };
    events.push(event);
    sendRemote(event);
    return write(events);
  };

  const clear = () => write([]);

  window.TrustLeakEvents = {
    clear,
    read,
    source,
    track
  };

  track("page_view", {}, { oncePerSession: true });

  if (!document.querySelector('script[src$="share-tools.js"]')) {
    const shareScript = document.createElement("script");
    shareScript.src = "share-tools.js";
    shareScript.defer = true;
    document.body.appendChild(shareScript);
  }

  function sendRemote(event) {
    if (!shouldSendRemote()) return;

    const payload = JSON.stringify(event);
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(remoteEndpoint, blob);
        return;
      }
    } catch {
      return;
    }

    try {
      fetch(remoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true
      }).catch(() => {});
    } catch {
      // Network telemetry is best-effort; local logging remains the fallback.
    }
  }

  function shouldSendRemote() {
    if (!/^https?:$/.test(window.location.protocol)) return false;
    const robots = document.querySelector('meta[name="robots"]')?.content?.toLowerCase() || "";
    return !robots.includes("noindex");
  }
})();
