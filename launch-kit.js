const launchStorageKey = "trustLeakLaunchSiteUrl";
const launchProgressStorageKey = "trustLeakLaunchProgressV1";
const launchProgressOptions = ["Waiting", "Ready", "Submitted", "Accepted", "Rejected", "Blocked", "Skipped"];

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
  },
  {
    surface: "Security/dev communities",
    label: "Vercel incident checklist",
    path: "/vercel-incident-response-checklist.html",
    source: "community",
    medium: "incident_resource",
    campaign: "vercel_incident_checklist",
    goal: "Share the time-sensitive checklist only where incident-response resources are welcome."
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
    page: "Toolkit hub",
    path: "/",
    source: "toolsdirectoryonline",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; no account; free listing review",
    firstMetric: "Directory referral visits and tool starts",
    copyAsset: "Free tool listing",
    status: "Ready now; clean homepage URL only",
    notes: "Current submit page says free listing, no hidden fees, no account required, and that it uses the URL to create the listing. Submit the canonical hub URL with Marketing and Free when fields are present."
  },
  {
    day: "2",
    surface: "NoSignupTools",
    page: "Toolkit hub",
    path: "/",
    source: "nosignuptools",
    medium: "no_signup_directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; browser form; no signup required; icon plus screenshot uploads required",
    firstMetric: "Review acceptance, listing URL, referral visits, or no-signup directory clicks",
    copyAsset: "No-signup CRO listing",
    status: "Ready from stable browser; clean URL only",
    notes: "Use the sharper no-signup CRO and acquisition-math preflight angle. Upload the validated directory icon PNG plus real homepage screenshot, and avoid unverified tags."
  },
  {
    day: "2",
    surface: "FreeNoSignup",
    page: "Toolkit hub",
    path: "/",
    source: "freenosignup",
    medium: "no_signup_directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; embedded form; no account; no submitter identity invented",
    firstMetric: "Review status, listing URL if approved, referral visits, or first beacon referrer",
    copyAsset: "No-signup CRO listing",
    status: "Ready from stable browser; clean URL only",
    notes: "Use only the tool/product fields. If a contact identity is required, mark blocked rather than fabricating a name or email."
  },
  {
    day: "2",
    surface: "No-Login Tools",
    page: "Toolkit hub",
    path: "/",
    source: "nologintools",
    medium: "no_login_directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; submit path visible; exact fields verified in stable browser before sending",
    firstMetric: "Manual review status, listing URL if approved, referral visits, or first beacon referrer",
    copyAsset: "No-login CRO listing",
    status: "Ready from stable browser; clean URL only",
    notes: "No-Login Tools lists manually verified no-login tools and exposes a Submit path. Use Productivity first; do not claim no trackers because the live site uses sanitized same-origin beacons."
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
    day: "3",
    surface: "BetterLaunch",
    page: "Toolkit hub",
    path: "/",
    source: "betterlaunch",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; 2+ screenshots or demo GIF; free editorial review; no paid upgrades",
    firstMetric: "Accepted listing, editorial page, or referral visits",
    copyAsset: "Long directory listing",
    status: "Manual after deploy; screenshots required",
    notes: "BetterLaunch currently offers free editorial listings and optional paid upgrades. Use the canonical hub URL, the long listing description, and existing screenshots only; do not add badges or buy placement without a later explicit decision."
  },
  {
    day: "3",
    surface: "TinyLaunch",
    page: "Toolkit hub",
    path: "/",
    source: "tinylaunch",
    medium: "directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned sign-in; Standard Launch only",
    firstMetric: "Homepage listing, referral visits, or product feedback",
    copyAsset: "Long directory listing",
    status: "Account required; free queue only",
    notes: "TinyLaunch currently lists a free Standard Launch and paid upgrades/submission services. Use only the free queue and do not buy submission, review, sponsor, or featured placement services."
  },
  {
    day: "3",
    surface: "MicroLaunch",
    page: "Toolkit hub",
    path: "/",
    source: "microlaunch",
    medium: "launch_platform",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned signup; Basic Launch queue only",
    firstMetric: "Launch page, support votes, referral visits, or comments",
    copyAsset: "Long directory listing",
    status: "Account required; free queue only",
    notes: "MicroLaunch currently supports product pages and a Basic Launch queue, with paid pro credits available. Use only the free/basic path and avoid deal or paid-credit flows."
  },
  {
    day: "3",
    surface: "StartupInspire",
    page: "Toolkit hub",
    path: "/",
    source: "startupinspire",
    medium: "startup_directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned account; free tier/trial only",
    firstMetric: "Accepted listing, referral visits, or profile page indexed",
    copyAsset: "Long directory listing",
    status: "Account required; free tier only",
    notes: "StartupInspire currently lists a 14-day free starter path and says free and paid submission options exist. Use the canonical hub URL, software/marketing categories, and no paid annual upgrades."
  },
  {
    day: "3",
    surface: "PitchWall",
    page: "Toolkit hub",
    path: "/",
    source: "pitchwall",
    medium: "startup_directory",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned submit flow; free queue only",
    firstMetric: "Accepted listing, referral visits, or indexed product page",
    copyAsset: "Long directory listing",
    status: "Manual after deploy; free queue only",
    notes: "PitchWall currently offers a $0 free plan for indie hackers with a 30-day waiting period and manual review. Submit Trust Leak only as a working tech/product tool; do not buy premium placement or claim AI-specific functionality."
  },
  {
    day: "3",
    surface: "OpenHunts",
    page: "Toolkit hub",
    path: "/",
    source: "openhunts",
    medium: "launch_platform",
    campaign: "free_tool_launch",
    disableUtm: true,
    requirement: "Public URL; user-owned account; product-category fit",
    firstMetric: "Launch page, votes/comments, or referral visits",
    copyAsset: "Long directory listing",
    status: "Account required; manual after deploy",
    notes: "OpenHunts is actively listing weekly maker/product launches and has a submit path. Use the clean canonical hub URL and existing long listing copy; do not buy sponsorship or fabricate engagement."
  },
  {
    day: "1",
    surface: "Security/dev communities",
    page: "Vercel incident response checklist",
    path: "/vercel-incident-response-checklist.html",
    source: "community",
    medium: "incident_resource",
    campaign: "vercel_incident_checklist",
    requirement: "Public URL; page HTTP 200; active thread or community explicitly allows useful incident-response resources",
    firstMetric: "Checklist page views, copies, shares, or useful replies",
    copyAsset: "Vercel checklist resource note",
    status: "Ready after deploy; rule-check required",
    notes: "Use only after the page is live. Share as an independent browser-local checklist with official source links; do not claim Vercel affiliation, private incident knowledge, or guaranteed remediation."
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

const submissionFieldPacks = [
  {
    surface: "Product Hunt",
    trackerSurface: "Product Hunt",
    title: "Trust Leak Audit",
    tagline: "Free browser-only landing page trust score and marketing math toolkit.",
    categories: "Marketing, SEO, CRO, Analytics, Startup tools, Calculators, Ecommerce, SaaS",
    assetNotes: "Use the hub SVG preview if SVG is accepted; otherwise capture homepage plus trust-score output after deploy.",
    fieldNotes: "Clean canonical hub URL only. Product Hunt does not accept UTM, shortened, or tracked links."
  },
  {
    surface: "Zearches",
    trackerSurface: "Zearches",
    title: "Trust Leak Audit",
    tagline: "Free landing-page trust score and marketing calculators that run in the browser.",
    categories: "Software & SaaS Tools, SEO/Marketing/Growth, Resources/Tools",
    assetNotes: "Logo/screenshot usually not required; use a clean homepage URL.",
    fieldNotes: "No account path. Submit the canonical hub URL without UTM, redirects, referral links, or affiliate parameters."
  },
  {
    surface: "Tools Directory Online",
    trackerSurface: "Tools Directory Online",
    title: "Trust Leak Audit",
    tagline: "Free browser-only toolkit for landing-page trust scoring, paid traffic math, ecommerce trust checks, SaaS payback, local lead value, and sample audit reports.",
    categories: "Marketing; Pricing: Free",
    assetNotes: "No screenshot required in the current source check. Use the clean homepage URL.",
    fieldNotes: "No-account path. Submit the canonical hub URL; if category and pricing fields appear, use Marketing and Free."
  },
  {
    surface: "NoSignupTools",
    trackerSurface: "NoSignupTools",
    title: "Trust Leak Audit",
    tagline: "Free no-signup CRO toolkit for scoring landing-page trust gaps and running acquisition math before buying more traffic.",
    categories: "Productivity, Business, Marketing, CRO, Startup tools, Ecommerce, or closest available no-signup category",
    assetNotes: "Current form requires an icon and at least one screenshot. Use assets/trust-leak-audit-directory-icon-512.png and assets/nosignuptools-homepage-screenshot-2026-05-01.png.",
    fieldNotes: "No-signup directory. Use clean canonical homepage URL, category productivity, and only verified tags; No Ads is the current safest required tag."
  },
  {
    surface: "FreeNoSignup",
    trackerSurface: "FreeNoSignup",
    title: "Trust Leak Audit",
    tagline: "Free no-signup browser toolkit for scoring landing-page trust gaps and checking paid-traffic math.",
    categories: "Productivity, Business, Marketing, Development, Web tools, or closest available no-signup category",
    assetNotes: "Embedded form path; do not invent submitter identity. Use plain tool copy and canonical URL only.",
    fieldNotes: "No account path. If the form requires contact details, stop at draft/blocked status rather than transmitting personal data."
  },
  {
    surface: "No-Login Tools",
    trackerSurface: "No-Login Tools",
    title: "Trust Leak Audit",
    tagline: "Free no-login CRO toolkit for scoring landing-page trust gaps and acquisition math.",
    categories: "Productivity first; Finance, Data, or Other only if the form lacks a marketing/business option",
    assetNotes: "Use clean canonical homepage URL. If a no-login task field appears, use: score a landing page and calculate paid-traffic break-even without creating an account.",
    fieldNotes: "Manual review path. Do not claim no trackers; use no signup, no payment, no uploads, browser-first operation, and no customer-data upload."
  },
  {
    surface: "Launching Next",
    trackerSurface: "Launching Next",
    title: "Trust Leak Audit",
    tagline: "Browser-only trust scoring and marketing math for founders, ecommerce teams, and agencies.",
    categories: "Marketing, Growth, Analytics, Ecommerce, Startup tools",
    assetNotes: "Use the long editorial listing draft. If asked for planned marketing spend, use the no-spend answer.",
    fieldNotes: "Free queue only. Do not pay for faster review."
  },
  {
    surface: "BetterLaunch",
    trackerSurface: "BetterLaunch",
    title: "Trust Leak Audit",
    tagline: "Find conversion trust gaps and calculate paid-traffic risk without signup.",
    categories: "Marketing, Startup tools, SaaS, Ecommerce, Analytics",
    assetNotes: "Needs 2+ screenshots or a demo GIF; use homepage, trust-score report output, and paid-traffic calculator.",
    fieldNotes: "Free editorial listing only. Do not add badges or buy paid upgrades without a separate decision."
  },
  {
    surface: "TinyLaunch",
    trackerSurface: "TinyLaunch",
    title: "Trust Leak Audit",
    tagline: "A free CRO and marketing math toolkit for landing-page trust checks.",
    categories: "Marketing, SaaS, Ecommerce, Founder tools",
    assetNotes: "Use the long listing plus homepage screenshot. Avoid review, sponsor, or featured-placement offers.",
    fieldNotes: "Use only the free Standard Launch queue from a user-owned account."
  },
  {
    surface: "MicroLaunch",
    trackerSurface: "MicroLaunch",
    title: "Trust Leak Audit",
    tagline: "Free browser-only toolkit for trust scoring, ad break-even math, and audit exports.",
    categories: "Marketing, Productivity, SaaS, Ecommerce, Analytics",
    assetNotes: "Use homepage and report export screenshots if required.",
    fieldNotes: "Basic Launch queue only. Avoid paid credits, pro launch, and deal submission flows."
  },
  {
    surface: "StartupInspire",
    trackerSurface: "StartupInspire",
    title: "Trust Leak Audit",
    tagline: "Free browser-only landing-page trust score and marketing math toolkit.",
    categories: "Software, Marketing, Analytics, Ecommerce, SaaS",
    assetNotes: "Use canonical hub URL and a plain product screenshot. Do not claim customers, traction, or revenue.",
    fieldNotes: "Use free-tier/trial-only path from a user-owned account. Do not buy annual upgrades."
  },
  {
    surface: "PitchWall",
    trackerSurface: "PitchWall",
    title: "Trust Leak Audit",
    tagline: "A working free tool for auditing landing-page trust and paid-traffic readiness.",
    categories: "SaaS, Startup, Marketing, Productivity, AI/Tech only if category requires a broad tech bucket",
    assetNotes: "Use the long editorial listing and a clean hub screenshot.",
    fieldNotes: "Free plan/manual review only. Do not buy priority placement or imply AI features beyond the actual toolkit."
  },
  {
    surface: "OpenHunts",
    trackerSurface: "OpenHunts",
    title: "Trust Leak Audit",
    tagline: "Free trust scoring and marketing calculators for founders and operators.",
    categories: "Marketing, SaaS, Ecommerce, Productivity, Analytics",
    assetNotes: "Use existing launch copy and clean canonical hub URL. Add screenshots only from the live tool.",
    fieldNotes: "User-owned account required. Do not buy sponsorship or fabricate votes/comments."
  },
  {
    surface: "Hacker News",
    trackerSurface: "Hacker News Show HN",
    title: "Show HN: Trust Leak Audit - browser-only landing page trust score",
    tagline: "I built a free browser-only toolkit for scoring trust gaps and checking marketing math.",
    categories: "Show HN, feedback",
    assetNotes: "No images needed. Be available to discuss implementation and rubric tradeoffs.",
    fieldNotes: "Use Show HN only from a user-owned account and do not ask for votes."
  },
  {
    surface: "Reddit",
    trackerSurface: "Reddit Feedback Friday",
    title: "Feedback request: browser-only landing page trust score",
    tagline: "Looking for critique on whether the trust-score output is useful and specific enough.",
    categories: "Feedback Friday, startups, landing pages, CRO",
    assetNotes: "No screenshots unless the active thread asks for them.",
    fieldNotes: "Post only in an active feedback-permitted thread and follow its template."
  },
  {
    surface: "Security/dev communities",
    trackerSurface: "Security/dev communities",
    title: "Vercel Incident Response Checklist",
    tagline: "Browser-local checklist for Vercel security bulletin response, secret rotation, activity-log review, and deployment protection.",
    categories: "Security, DevOps, Incident response, Vercel, SaaS operations",
    assetNotes: "Use the checklist page URL only after it returns HTTP 200. Screenshot the checklist progress UI if the community asks for an image.",
    fieldNotes: "Share only in rule-allowed threads or communities asking for incident-response resources. Do not imply Vercel affiliation or private incident details."
  }
];

const noAccountSubmissions = [
  {
    surface: "Tools Directory Online",
    formUrl: "https://toolsdirectoryonline.com/submit",
    toolPath: "/",
    fields: [
      "Website URL: canonical homepage",
      "Short description: Free browser-only toolkit for landing-page trust scoring, paid traffic break-even math, ecommerce trust checks, SaaS payback, local lead value, and sample audit reports.",
      "Category: Marketing",
      "Pricing: Free"
    ],
    guardrail: "Use only the free/manual listing path. Do not buy promotion or claim approval before review.",
    evidence: "Submitted/blocked status, review message, listing URL if approved, first referrer or beacon evidence."
  },
  {
    surface: "Zearches",
    formUrl: "https://zearches.com/",
    toolPath: "/",
    fields: [
      "Website / Blog URL: canonical homepage",
      "Title: Trust Leak Audit",
      "Short description: Free browser-only toolkit for landing-page trust scoring, paid traffic math, ecommerce trust checks, SaaS payback, local lead value, and sample audit reports.",
      "Directory: SEO, Marketing & Growth"
    ],
    guardrail: "Use a clean URL only. No UTM, referral, redirect, affiliate, or duplicate submission.",
    evidence: "Submitted/blocked status, category URL, listing URL if accepted, first referrer or beacon evidence."
  },
  {
    surface: "NoSignupTools",
    formUrl: "https://nosignuptools.com/submit",
    toolPath: "/",
    fields: [
      "Tool name: Trust Leak Audit",
      "URL: canonical homepage",
      "Category: Productivity, Business, Marketing, or closest no-signup tool category",
      "Short description: Free no-signup CRO toolkit for scoring landing-page trust gaps and running acquisition math before buying more traffic.",
      "Detailed description: Trust Leak Audit helps founders, agencies, ecommerce operators, SaaS teams, and local-service marketers check page-level trust gaps before buying more traffic. It includes a landing-page trust score, paid traffic break-even math, ROAS, SaaS payback, LTV:CAC, lead funnel, local lead value, agency margin, ecommerce trust checks, sample audit reports, launch notes, and public-data brief examples. It runs without signup, payment, uploads, or customer-data collection."
    ],
    guardrail: "Use only verified no-signup/free fields. Upload the validated PNG icon and real homepage screenshot; use only a verified tag such as No Ads.",
    evidence: "Submitted/blocked status, review message, listing URL if approved, first referrer or beacon evidence."
  },
  {
    surface: "FreeNoSignup",
    formUrl: "https://freenosignup.com/submit/",
    toolPath: "/",
    fields: [
      "Tool name: Trust Leak Audit",
      "URL: canonical homepage",
      "Category: Productivity, Business, Marketing, or closest available category",
      "Description: Free no-signup browser toolkit for scoring landing-page trust gaps and running acquisition math before buying more traffic. Includes trust score, ROAS, paid traffic break-even, SaaS payback, ecommerce trust checks, local-service lead value, and sample audit reports."
    ],
    guardrail: "Use the embedded form manually. If submitter contact details are required, mark blocked rather than inventing or transmitting personal data.",
    evidence: "Submitted/blocked status, form response or review message, listing URL if approved, first referrer or beacon evidence."
  },
  {
    surface: "No-Login Tools",
    formUrl: "https://nologin.tools/submit",
    toolPath: "/",
    fields: [
      "Tool name: Trust Leak Audit",
      "URL: canonical homepage",
      "Category: Productivity first; Finance, Data, or Other only if required by the form",
      "No-login task: Score a landing page and calculate paid-traffic break-even without creating an account",
      "Description: Free no-login CRO and marketing economics toolkit for scoring landing-page trust gaps before buying more traffic. Includes trust score, ROAS, paid traffic break-even, SaaS payback, ecommerce trust checks, local-service lead value, agency margin math, and sample audit reports."
    ],
    guardrail: "Use a stable browser to verify fields. Do not claim no trackers or submit invented contact details; mark blocked if identity/email is mandatory.",
    evidence: "Submitted/blocked status, manual review response, listing URL if approved, first referrer or beacon evidence."
  }
];

const siteUrlInput = document.querySelector("#siteUrlInput");
const launchStatus = document.querySelector("#launchStatus");
const launchLinkRows = document.querySelector("#launchLinkRows");
const launchCopyGrid = document.querySelector("#launchCopyGrid");
const launchTrackerRows = document.querySelector("#launchTrackerRows");
const fieldPackRows = document.querySelector("#fieldPackRows");
const noAccountRows = document.querySelector("#noAccountRows");
const copyAllLinks = document.querySelector("#copyAllLinks");
const downloadLaunchPacket = document.querySelector("#downloadLaunchPacket");
const copyLaunchTracker = document.querySelector("#copyLaunchTracker");
const downloadLaunchTracker = document.querySelector("#downloadLaunchTracker");
const resetLaunchProgress = document.querySelector("#resetLaunchProgress");
const launchProgressSummary = document.querySelector("#launchProgressSummary");
let launchProgress = readLaunchProgress();

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

resetLaunchProgress.addEventListener("click", () => {
  launchProgress = {};
  writeLaunchProgress();
  render();
  setButtonFeedback(resetLaunchProgress, "Reset");
  track("launch_kit_tracker_progress_reset", { rows: submissionTracker.length });
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

fieldPackRows.addEventListener("click", async event => {
  const button = event.target.closest("button[data-copy-field-pack]");
  if (!button) return;
  const pack = submissionFieldPacks[Number(button.dataset.copyFieldPack)];
  await copyText(renderFieldPack(pack), button, "Copied");
  track("launch_kit_field_pack_copied", { surface: pack.surface });
});

noAccountRows.addEventListener("click", async event => {
  const button = event.target.closest("button[data-copy-no-account]");
  if (!button) return;
  const item = noAccountSubmissions[Number(button.dataset.copyNoAccount)];
  await copyText(renderNoAccountSubmission(item), button, "Copied");
  track("launch_kit_no_account_pack_copied", { surface: item.surface });
});

launchTrackerRows.addEventListener("change", event => {
  const statusSelect = event.target.closest("select[data-tracker-status]");
  const noteInput = event.target.closest("input[data-tracker-note]");
  if (!statusSelect && !noteInput) return;

  const key = statusSelect?.dataset.trackerStatus || noteInput?.dataset.trackerNote;
  const row = submissionTracker.find((item, index) => trackerId(item, index) === key);
  if (!row) return;

  const current = launchProgress[key] || {};
  launchProgress[key] = {
    ...current,
    status: statusSelect ? statusSelect.value : current.status || defaultProgressStatus(row),
    note: noteInput ? noteInput.value.trim() : current.note || "",
    updatedAt: new Date().toISOString()
  };
  writeLaunchProgress();
  renderProgressSummary();
  track(statusSelect ? "launch_kit_tracker_status_changed" : "launch_kit_tracker_note_changed", {
    surface: row.surface,
    status: launchProgress[key].status,
    hasNote: Boolean(launchProgress[key].note)
  });
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

  launchTrackerRows.innerHTML = submissionTracker.map((item, index) => {
    const key = trackerId(item, index);
    const progress = trackerProgress(item, index);
    return `
    <tr>
      <td>${escapeHtml(item.day)}</td>
      <td>${escapeHtml(item.surface)}</td>
      <td>${escapeHtml(item.page)}</td>
      <td>${escapeHtml(item.requirement)}</td>
      <td><code>${escapeHtml(buildLink(item))}</code></td>
      <td>${escapeHtml(item.firstMetric)}</td>
      <td>${escapeHtml(item.status)}</td>
      <td>
        <select class="tracker-status-select" data-tracker-status="${escapeHtml(key)}" aria-label="${escapeHtml(`${item.surface} progress`)}">
          ${launchProgressOptions.map(option => `<option value="${escapeHtml(option)}"${option === progress.status ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </td>
      <td>
        <input class="tracker-note-input" type="text" value="${escapeHtml(progress.note)}" data-tracker-note="${escapeHtml(key)}" aria-label="${escapeHtml(`${item.surface} evidence note`)}" placeholder="Listing URL, result, or blocker">
      </td>
    </tr>
  `;
  }).join("");
  fieldPackRows.innerHTML = submissionFieldPacks.map((pack, index) => {
    const row = findSubmissionRow(pack.trackerSurface);
    const submissionUrl = row ? buildLink(row) : normalizeBaseUrl(siteUrlInput.value) || "https://example.com";
    return `
      <tr>
        <td>${escapeHtml(pack.surface)}</td>
        <td><code>${escapeHtml(submissionUrl)}</code><small>${escapeHtml(pack.fieldNotes)}</small></td>
        <td>${escapeHtml(pack.title)}</td>
        <td>${escapeHtml(pack.tagline)}</td>
        <td>${escapeHtml(pack.categories)}</td>
        <td>${escapeHtml(pack.assetNotes)}</td>
        <td><button class="secondary compact-button" type="button" data-copy-field-pack="${index}">Copy</button></td>
      </tr>
    `;
  }).join("");

  noAccountRows.innerHTML = noAccountSubmissions.map((item, index) => {
    const toolUrl = buildCleanToolUrl(item.toolPath);
    return `
      <tr>
        <td>${escapeHtml(item.surface)}</td>
        <td><code>${escapeHtml(item.formUrl)}</code><small>${escapeHtml(item.guardrail)}</small></td>
        <td><code>${escapeHtml(toolUrl)}</code></td>
        <td>${escapeHtml(item.fields.join(" "))}</td>
        <td>${escapeHtml(item.evidence)}</td>
        <td><button class="secondary compact-button" type="button" data-copy-no-account="${index}">Copy</button></td>
      </tr>
    `;
  }).join("");
  renderProgressSummary();
}

function launchDrafts() {
  const hub = buildLink(priorityLinks[0]);
  const showHn = buildLink(priorityLinks[1]);
  const trust = buildLink(priorityLinks[2]);
  const productHunt = buildLink(priorityLinks[3]);
  const paidTraffic = buildLink(priorityLinks[4]);
  const ecommerce = buildLink(priorityLinks[5]);
  const sec = buildLink(priorityLinks[7]);
  const vercelChecklist = buildLink(priorityLinks[8]);

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
      channel: "Directory",
      title: "Long editorial listing",
      body: [
        "Name: Trust Leak Audit",
        "Tagline: Free browser-only landing page trust score and marketing math toolkit.",
        "",
        `URL: ${hub}`,
        "",
        "Description:",
        "Trust Leak Audit helps founders, ecommerce operators, agencies, and growth teams find the trust gaps that make useful pages feel risky or unclear. The free toolkit combines a landing-page trust score, paid traffic break-even math, ROAS checks, SaaS CAC payback, LTV:CAC, lead-funnel revenue, local-service lead value, agency margin math, ecommerce trust criteria, sample reports, and public SEC trigger brief examples. It runs in the browser without signup, uploads, or payment. Visitors can copy share links, export Markdown audit drafts, and use the calculators as a lightweight preflight before changing copy, launching ads, or asking for feedback.",
        "",
        "Categories: Marketing, growth, CRO, SaaS, ecommerce, analytics, startup tools, calculators.",
        "Privacy note: Browser-only; page data is not uploaded."
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
    },
    {
      channel: "Current incident resource",
      title: "Vercel checklist resource note",
      body: [
        "I put together a free browser-local checklist for teams responding to Vercel's April 2026 security bulletin.",
        "",
        `Checklist: ${vercelChecklist}`,
        "",
        "It covers environment-variable inventory and rotation, activity-log review, 2FA/team-access checks, recent deployment review, and deployment-protection follow-up. It does not ask for credentials, does not upload secrets, and links to the official Vercel source material.",
        "",
        "Independent resource; not affiliated with Vercel. Sharing only if this kind of practical checklist is useful here."
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
    "## Submission Field Pack",
    "",
    renderFieldPackMarkdown(),
    "",
    "## No-account Direct Submissions",
    "",
    renderNoAccountMarkdown(),
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
  const header = "| Day | Surface | Page | Requirement | First metric | Plan status | Progress | Evidence note |";
  const separator = "| --- | --- | --- | --- | --- | --- | --- | --- |";
  const rows = submissionTracker.map((item, index) => {
    const progress = trackerProgress(item, index);
    return [
    item.day,
    item.surface,
    item.page,
    item.requirement,
    item.firstMetric,
      item.status,
      progress.status,
      progress.note
    ].map(escapeMarkdownTable).join(" | ");
  });
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
    "plan_status",
    "progress_status",
    "evidence_note",
    "progress_updated_at",
    "notes"
  ];
  const rows = submissionTracker.map((item, index) => {
    const progress = trackerProgress(item, index);
    return [
    item.day,
    item.surface,
    item.page,
    buildLink(item),
    item.requirement,
    item.firstMetric,
    item.copyAsset,
    item.status,
      progress.status,
      progress.note,
      progress.updatedAt || "",
    item.notes
    ];
  });

  return [headers, ...rows].map(row => row.map(escapeCsv).join(",")).join("\n");
}

function renderFieldPackMarkdown() {
  return submissionFieldPacks.map(pack => renderFieldPack(pack)).join("\n\n---\n\n");
}

function renderFieldPack(pack) {
  const row = findSubmissionRow(pack.trackerSurface);
  return [
    `Surface: ${pack.surface}`,
    `Submission URL: ${row ? buildLink(row) : normalizeBaseUrl(siteUrlInput.value) || "https://example.com"}`,
    `Title: ${pack.title}`,
    `Tagline: ${pack.tagline}`,
    `Category hints: ${pack.categories}`,
    `Asset notes: ${pack.assetNotes}`,
    `Guardrail: ${pack.fieldNotes}`
  ].join("\n");
}

function renderNoAccountMarkdown() {
  return noAccountSubmissions.map(item => renderNoAccountSubmission(item)).join("\n\n---\n\n");
}

function renderNoAccountSubmission(item) {
  return [
    `Surface: ${item.surface}`,
    `Form URL: ${item.formUrl}`,
    `Clean tool URL: ${buildCleanToolUrl(item.toolPath)}`,
    "Fields:",
    ...item.fields.map(field => `- ${field}`),
    `Guardrail: ${item.guardrail}`,
    `Evidence to record: ${item.evidence}`
  ].join("\n");
}

function findSubmissionRow(surface) {
  return submissionTracker.find(item => item.surface === surface);
}

function trackerId(item, index) {
  return `${index}-${item.surface}-${item.path}-${item.source}-${item.campaign}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function trackerProgress(item, index) {
  const saved = launchProgress[trackerId(item, index)] || {};
  return {
    status: launchProgressOptions.includes(saved.status) ? saved.status : defaultProgressStatus(item),
    note: saved.note || "",
    updatedAt: saved.updatedAt || ""
  };
}

function defaultProgressStatus(item) {
  if (/blocked/i.test(item.status)) return "Blocked";
  if (/ready|manual after deploy/i.test(item.status)) return "Ready";
  if (/low priority/i.test(item.status)) return "Skipped";
  return "Waiting";
}

function renderProgressSummary() {
  const counts = Object.fromEntries(launchProgressOptions.map(option => [option, 0]));
  submissionTracker.forEach((item, index) => {
    const progress = trackerProgress(item, index);
    counts[progress.status] += 1;
  });
  launchProgressSummary.textContent = `Progress: ${counts.Submitted + counts.Accepted} submitted or accepted, ${counts.Ready} ready, ${counts.Blocked} blocked, ${counts.Skipped} skipped, ${counts.Waiting} waiting. Saved only in this browser.`;
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

function buildCleanToolUrl(path) {
  const baseUrl = normalizeBaseUrl(siteUrlInput.value) || "https://example.com";
  const url = new URL(path === "/" ? "./" : path.replace(/^\//, ""), `${baseUrl}/`);
  url.search = "";
  url.hash = "";
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

function readLaunchProgress() {
  try {
    const raw = localStorage.getItem(launchProgressStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLaunchProgress() {
  try {
    localStorage.setItem(launchProgressStorageKey, JSON.stringify(launchProgress));
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
