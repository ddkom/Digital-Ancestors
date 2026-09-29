import { siteConfig } from "../config/site";

/** Visitor analytics via Umami (cookieless). Setup: docs/umami.md.
 * Everything here is a no-op until a website ID is set, and never runs on localhost. */

type UmamiData = Record<string, string | number>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiData) => void };
  }
}

const { umamiWebsiteId } = siteConfig.analytics;
const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configured = Boolean(umamiWebsiteId) && !isLocal;

// ---- Opt-out: remembered in this browser; covers Umami and saving quiz answers. ----

const OPT_OUT_KEY = "da-analytics-opt-out";
/** Umami's own switch: its script checks this before sending anything. */
const UMAMI_DISABLED_KEY = "umami.disabled";

export function isOptedOut(): boolean {
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Opt out. Sends one last anonymous "analytics_opt_out" count first, so we know how many chose it. */
export function optOut(): void {
  track("analytics_opt_out");
  try {
    window.localStorage.setItem(OPT_OUT_KEY, "1");
    window.localStorage.setItem(UMAMI_DISABLED_KEY, "1");
  } catch {
    // Storage blocked: nothing we can remember.
  }
}

export function optIn(): void {
  try {
    window.localStorage.removeItem(OPT_OUT_KEY);
    window.localStorage.removeItem(UMAMI_DISABLED_KEY);
  } catch {
    // Storage blocked.
  }
  loadUmami();
}

const enabled = () => configured && !isOptedOut();

/** Adds the Umami script. It counts page views (including route changes) by itself. */
export function loadUmami(): void {
  if (!enabled() || document.querySelector("script[data-website-id]")) return;
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://cloud.umami.is/script.js";
  script.dataset.websiteId = umamiWebsiteId;
  script.dataset.doNotTrack = "true";
  document.head.appendChild(script);
}

/** Sends a custom event. Safe to call before the script has loaded (it's just dropped). */
export function track(event: string, data?: UmamiData): void {
  if (!enabled()) return;
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the site.
  }
}
