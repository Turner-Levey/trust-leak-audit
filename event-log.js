(function () {
  const storageKey = "trustLeakToolEvents";
  const maxEvents = 500;
  const pageViewSessionPrefix = "trustLeakPageView:";
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
    events.push({
      name,
      detail,
      source: source(),
      at: new Date().toISOString()
    });
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
})();
