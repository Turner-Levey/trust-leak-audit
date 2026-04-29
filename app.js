const criteria = [
  ["Above-the-fold clarity", "Can a buyer understand the outcome in 5 seconds?", "Rewrite the hero around one buyer, one pain, and one measurable outcome."],
  ["Specific buyer/use case", "Is the page clearly for someone specific?", "Name the ICP directly and show the use case they came for."],
  ["Proof and credibility", "Does the page prove the claim with evidence?", "Add numbers, logos, examples, screenshots, case snippets, or a live demo."],
  ["Risk reversal", "Does the buyer feel protected?", "Add guarantees, trial terms, refund policy, cancellation clarity, or expectation framing."],
  ["Pricing confidence", "Can the buyer understand value before talking to sales?", "Clarify pricing, package boundaries, or ROI math."],
  ["CTA clarity", "Is the next step obvious and low-friction?", "Use one primary CTA and match it to the buyer's readiness."],
  ["Objection handling", "Are likely doubts answered before the CTA?", "Add concise answers for implementation, time, cost, trust, security, and fit."],
  ["Visual hierarchy", "Does the page guide attention cleanly?", "Tighten headings, spacing, contrast, and section order."],
  ["Technical trust basics", "Does the experience feel stable and legitimate?", "Check mobile layout, page speed, forms, HTTPS, broken links, and brand consistency."],
  ["Conversion path friction", "How much effort is needed to take action?", "Reduce fields, steps, distractions, and unclear choices."]
];

const audienceProfiles = {
  general: {
    label: "General landing page",
    focus: "Make the buyer, outcome, proof, risk reversal, and next step obvious before the first major scroll.",
    package: "Use the Quick Audit for a prioritized report and replacement copy for the top 3 trust leaks.",
    share: "General trust leaks"
  },
  saas: {
    label: "SaaS founder",
    focus: "Tie the page to activation, time-to-value, switching risk, security confidence, and trial or demo intent.",
    package: "Use the Deep Audit when activation proof, onboarding friction, pricing confidence, or demo conversion needs rewritten sections.",
    share: "SaaS trust leaks"
  },
  ecommerce: {
    label: "Ecommerce brand",
    focus: "Prioritize product proof, return clarity, shipping confidence, review quality, offer risk, and checkout friction.",
    package: "Use the Quick Audit to turn weak product-page proof and risk reversal into a testable conversion fix list.",
    share: "Ecommerce trust leaks"
  },
  agency: {
    label: "Agency or consultant",
    focus: "Show the niche, client outcomes, delivery boundaries, proof assets, process clarity, and why the offer is worth the retainer.",
    package: "Use the Monthly Monitor when client acquisition depends on keeping proof, scope, and offer pages current.",
    share: "Agency offer trust leaks"
  },
  local: {
    label: "Local service business",
    focus: "Make service area, urgency, qualification, reviews, guarantees, phone/form paths, and response expectations clear.",
    package: "Use the Quick Audit when missed calls, weak lead quality, or unclear service pages are suppressing booked jobs.",
    share: "Local service trust leaks"
  }
};

const reportDetails = {
  "Above-the-fold clarity": {
    evidence: "The hero should let a new buyer name the audience, outcome, and next step within a few seconds.",
    effort: "Low",
    impact: "High",
    beforeAfter: "Before: \"Grow faster.\" After: \"Turn demo requests into qualified SaaS pipeline in 30 days.\""
  },
  "Specific buyer/use case": {
    evidence: "The page should make one primary buyer feel directly addressed instead of serving several vague segments at once.",
    effort: "Low",
    impact: "High",
    beforeAfter: "Before: \"For modern teams.\" After: \"For B2B SaaS teams spending $10k-$80k/month on paid acquisition.\""
  },
  "Proof and credibility": {
    evidence: "Claims should be backed by concrete proof near the decision point: numbers, examples, screenshots, client context, or demos.",
    effort: "Medium",
    impact: "High",
    beforeAfter: "Before: \"Trusted by growing companies.\" After: \"See the 3-page teardown that found 6 signup leaks before ad spend increased.\""
  },
  "Risk reversal": {
    evidence: "Buyers should see what happens if the product, service, trial, or quote process is not a fit.",
    effort: "Low",
    impact: "Medium",
    beforeAfter: "Before: \"Start today.\" After: \"Start a 14-day trial. No card required. Cancel from settings anytime.\""
  },
  "Pricing confidence": {
    evidence: "The page should reduce fear of hidden cost, unclear scope, or needing a call just to understand the price range.",
    effort: "Medium",
    impact: "Medium",
    beforeAfter: "Before: \"Contact sales.\" After: \"Plans start at $149/month; most teams use the $299/month growth plan.\""
  },
  "CTA clarity": {
    evidence: "The primary CTA should match buyer readiness and stay consistent across the page.",
    effort: "Low",
    impact: "High",
    beforeAfter: "Before: \"Learn more\" and \"Get started\" competing. After: \"Book a 15-minute fit check\" repeated consistently."
  },
  "Objection handling": {
    evidence: "The page should answer the doubts that appear right before action: fit, timing, cost, implementation, security, support, and switching.",
    effort: "Medium",
    impact: "Medium",
    beforeAfter: "Before: no implementation answer. After: \"Most teams launch the first workflow in one afternoon with a guided template.\""
  },
  "Visual hierarchy": {
    evidence: "Headings, spacing, contrast, and section order should guide the buyer from promise to proof to action.",
    effort: "Medium",
    impact: "Medium",
    beforeAfter: "Before: equal-weight sections. After: headline, proof strip, risk note, CTA, then supporting detail."
  },
  "Technical trust basics": {
    evidence: "Broken links, awkward mobile layout, form errors, missing HTTPS, or inconsistent brand details can erase confidence.",
    effort: "Medium",
    impact: "Medium",
    beforeAfter: "Before: form error after submit. After: inline validation, clear confirmation, and a tested mobile path."
  },
  "Conversion path friction": {
    evidence: "Every extra field, step, decision, or distraction should earn its place before the buyer can act.",
    effort: "Low",
    impact: "High",
    beforeAfter: "Before: nine required form fields. After: name, email, website, and one optional context field."
  }
};

const calculators = {
  roas: {
    fields: [
      ["adSpend", "Ad spend", 5000, "Monthly paid media budget"],
      ["revenue", "Revenue from ads", 15000, "Attributed sales or pipeline value"],
      ["grossMargin", "Gross margin %", 70, "After delivery/product costs"]
    ],
    compute: values => {
      const roas = safeDivide(values.revenue, values.adSpend);
      const grossProfit = values.revenue * values.grossMargin / 100;
      const net = grossProfit - values.adSpend;
      return [
        ["ROAS", `${roas.toFixed(2)}x`],
        ["Gross profit after ad spend", money(net)]
      ];
    }
  },
  ltv: {
    fields: [
      ["adSpend", "Acquisition spend", 6000, "Sales and marketing cost"],
      ["newCustomers", "New customers", 40, "Customers acquired"],
      ["arpa", "Monthly revenue/customer", 149, "Average recurring revenue"],
      ["grossMargin", "Gross margin %", 75, "After service/product cost"],
      ["monthlyChurn", "Monthly churn %", 4, "Customer churn rate"]
    ],
    compute: values => {
      const cac = safeDivide(values.adSpend, values.newCustomers);
      const grossArpa = values.arpa * values.grossMargin / 100;
      const ltv = safeDivide(grossArpa, values.monthlyChurn / 100);
      const ratio = safeDivide(ltv, cac);
      const payback = safeDivide(cac, grossArpa);
      return [
        ["LTV:CAC", `${ratio.toFixed(1)}x`],
        ["CAC payback", `${payback.toFixed(1)} months`],
        ["CAC", money(cac)],
        ["Gross LTV", money(ltv)]
      ];
    }
  },
  funnel: {
    fields: [
      ["visits", "Monthly visits", 2500, "Targeted page visitors"],
      ["leadRate", "Visitor to lead %", 3, "Form/demo/signup conversion"],
      ["closeRate", "Lead to customer %", 12, "Sales close rate"],
      ["dealValue", "Average deal value", 499, "First purchase or monthly value"]
    ],
    compute: values => {
      const leads = values.visits * values.leadRate / 100;
      const customers = leads * values.closeRate / 100;
      const revenue = customers * values.dealValue;
      return [
        ["Monthly leads", leads.toFixed(0)],
        ["New customers", customers.toFixed(1)],
        ["Projected revenue", money(revenue)]
      ];
    }
  },
  agency: {
    fields: [
      ["retainer", "Monthly retainer", 2500, "Client fee"],
      ["hours", "Delivery hours", 18, "Monthly labor hours"],
      ["hourlyCost", "Blended cost/hour", 65, "Internal or contractor cost"],
      ["overhead", "Overhead", 250, "Tools/admin per client"]
    ],
    compute: values => {
      const cost = values.hours * values.hourlyCost + values.overhead;
      const profit = values.retainer - cost;
      const margin = safeDivide(profit, values.retainer) * 100;
      return [
        ["Monthly profit", money(profit)],
        ["Margin", `${margin.toFixed(1)}%`],
        ["Max hours for 50% margin", safeDivide(values.retainer * 0.5 - values.overhead, values.hourlyCost).toFixed(1)]
      ];
    }
  }
};

const initialTool = new URLSearchParams(window.location.search).get("tool");
const eventStorageKey = "trustLeakToolEvents";

const state = {
  activeTab: calculators[initialTool] ? initialTool : "roas",
  audience: "general",
  trust: Object.fromEntries(criteria.map(([name]) => [name, 5])),
  calc: Object.fromEntries(Object.keys(calculators).map(name => [name, {}]))
};

const trustInputs = document.querySelector("#trustInputs");
const trustScore = document.querySelector("#trustScore");
const fixList = document.querySelector("#fixList");
const reportOutput = document.querySelector("#reportOutput");
const calculatorForm = document.querySelector("#calculatorForm");
const resultStrip = document.querySelector("#resultStrip");
const buyerType = document.querySelector("#buyerType");
const downloadReportButton = document.querySelector("#downloadReport");
const copyShareButton = document.querySelector("#copyShare");
const eventStatus = document.querySelector("#eventStatus");

function init() {
  criteria.forEach(([name, help]) => {
    const row = document.createElement("div");
    row.className = "slider-row";

    const label = document.createElement("label");
    label.textContent = name;
    const small = document.createElement("small");
    small.textContent = help;
    label.appendChild(small);

    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "10";
    input.step = "1";
    input.value = "5";
    input.addEventListener("input", event => {
      state.trust[name] = Number(event.target.value);
      value.textContent = event.target.value;
      renderTrust();
    });

    const value = document.createElement("span");
    value.className = "value-pill";
    value.textContent = "5";

    row.append(label, input, value);
    trustInputs.appendChild(row);
  });

  syncActiveTabButtons();

  document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
      setActiveTab(button.dataset.tab);
    });
  });

  document.querySelectorAll("[data-tool-link]").forEach(link => {
    link.addEventListener("click", () => setActiveTab(link.dataset.toolLink));
  });

  if (buyerType) {
    buyerType.addEventListener("change", event => {
      state.audience = event.target.value;
      renderTrust();
      trackEvent("buyer_type_changed", { audience: state.audience });
    });
  }

  document.querySelector("#resetTrust").addEventListener("click", resetTrust);
  document.querySelector("#copyReport").addEventListener("click", copyReport);
  if (downloadReportButton) downloadReportButton.addEventListener("click", downloadReport);
  if (copyShareButton) copyShareButton.addEventListener("click", copyShareSummary);
  window.addEventListener("trustLeakEventsUpdated", updateEventStatus);

  updateEventStatus();
  renderCalculator();
  renderTrust();
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  syncActiveTabButtons();
  renderCalculator();
  renderTrust();
  trackEvent("calculator_tab_selected", { tab: tabName });
}

function syncActiveTabButtons() {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.tab === state.activeTab));
}

function resetTrust() {
  criteria.forEach(([name], index) => {
    state.trust[name] = 5;
    const row = trustInputs.children[index];
    row.querySelector("input").value = "5";
    row.querySelector(".value-pill").textContent = "5";
  });
  renderTrust();
  trackEvent("trust_score_reset", { audience: state.audience });
}

function renderTrust() {
  const { average, weakest } = getTrustSnapshot();
  trustScore.textContent = average.toFixed(1);

  fixList.innerHTML = "";
  weakest.forEach(([name, , fix]) => {
    const item = document.createElement("li");
    item.textContent = `${name}: ${fix}`;
    fixList.appendChild(item);
  });

  reportOutput.value = buildReport(average, weakest);
}

function getTrustSnapshot() {
  const entries = Object.entries(state.trust);
  const average = entries.reduce((sum, [, value]) => sum + value, 0) / entries.length;
  const weakest = entries
    .slice()
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([name]) => criteria.find(item => item[0] === name));

  return { average, weakest };
}

function renderCalculator() {
  const active = calculators[state.activeTab];
  const calcState = state.calc[state.activeTab];
  calculatorForm.innerHTML = "";

  active.fields.forEach(([key, labelText, defaultValue, help]) => {
    if (calcState[key] === undefined) calcState[key] = defaultValue;

    const row = document.createElement("div");
    row.className = "field-row";

    const label = document.createElement("label");
    label.textContent = labelText;
    const small = document.createElement("small");
    small.textContent = help;
    label.appendChild(small);

    const input = document.createElement("input");
    input.type = "number";
    input.value = calcState[key];
    input.inputMode = "decimal";
    input.addEventListener("input", event => {
      calcState[key] = Number(event.target.value);
      renderResults();
      renderTrust();
    });

    const spacer = document.createElement("span");
    spacer.className = "value-pill";
    spacer.textContent = "#";

    row.append(label, input, spacer);
    calculatorForm.appendChild(row);
  });

  renderResults();
}

function renderResults() {
  const active = calculators[state.activeTab];
  const calcState = state.calc[state.activeTab];
  const values = Object.fromEntries(active.fields.map(([key]) => [key, Number(calcState[key] || 0)]));
  const results = active.compute(values);
  resultStrip.innerHTML = "";

  results.forEach(([label, value]) => {
    const metric = document.createElement("div");
    metric.className = "metric";
    metric.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    resultStrip.appendChild(metric);
  });
}

function buildReport(score, weakest) {
  const profile = audienceProfiles[state.audience];
  const priority = weakest
    .map(([name, , fix], index) => {
      const detail = reportDetails[name];
      return `${index + 1}. ${name}
Evidence to check: ${detail.evidence}
Fix: ${fix}
Effort: ${detail.effort}
Impact: ${detail.impact}
Before/after copy example: ${detail.beforeAfter}`;
    })
    .join("\n\n");

  return `Trust Leak Audit Draft

Buyer Type: ${profile.label}
Trust Score: ${score.toFixed(1)}/10

Primary Diagnosis:
The page is currently strongest where scores are highest and weakest where the buyer still has unanswered confidence questions. For ${profile.label.toLowerCase()}, the next conversion lift should come from fixing the lowest-scoring trust leaks first.

Priority Fixes:
${priority}

Suggested Focus:
${profile.focus}

Recommended Paid Package:
Quick Audit at $199 for a prioritized trust report.
Deep Audit at $499 for rewritten page sections and implementation plan.
Monthly Monitor at $149/month for recurring review.

Best-Fit Package Note:
${profile.package}`;
}

async function copyReport() {
  const button = document.querySelector("#copyReport");
  await copyText(reportOutput.value, button, "Copied");
  trackEvent("report_copied", { audience: state.audience, tab: state.activeTab });
}

function downloadReport() {
  const blob = new Blob([reportOutput.value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `trust-leak-audit-${state.audience}-${date}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setButtonFeedback(downloadReportButton, "Downloaded");
  trackEvent("report_downloaded", { audience: state.audience, tab: state.activeTab });
}

async function copyShareSummary() {
  await copyText(buildShareSummary(), copyShareButton, "Share Copied");
  trackEvent("share_summary_copied", { audience: state.audience, tab: state.activeTab });
}

function buildShareSummary() {
  const { average, weakest } = getTrustSnapshot();
  const profile = audienceProfiles[state.audience];
  const leaks = weakest.map(([name]) => name).join(", ");
  const url = window.location.href.split("#")[0];

  return `${profile.share}: ${average.toFixed(1)}/10 trust score. Top fixes: ${leaks}. Free browser-only Trust Leak Audit + marketing math toolkit: ${url}`;
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
    updateEventStatus();
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
  updateEventStatus();
}

function updateEventStatus() {
  if (!eventStatus) return;
  eventStatus.textContent = `Local report events: ${readEvents().length}`;
}

function readEvents() {
  if (window.TrustLeakEvents?.read) return window.TrustLeakEvents.read();

  try {
    return JSON.parse(localStorage.getItem(eventStorageKey)) || [];
  } catch {
    return [];
  }
}

function safeDivide(a, b) {
  return b ? a / b : 0;
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

init();
