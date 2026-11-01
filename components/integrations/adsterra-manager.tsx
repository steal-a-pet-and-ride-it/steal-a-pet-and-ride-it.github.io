"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Public website-specific GET CODE values. Keep provider URLs and parameters unchanged.
const bannerDesktop = {
  key: "3f14a3ba1f34d3cf7e09e29050feffc1",
  url: "https://bauval.org/22/3f14a3ba1f34d3cf7e09e29050feffc1",
  width: 728,
  height: 90,
} as const;
const bannerMobile = {
  key: "1f038529a0d7f8a7eacc31537728d93a",
  url: "https://bauval.org/22/1f038529a0d7f8a7eacc31537728d93a",
  width: 320,
  height: 50,
} as const;
const nativeUrl = "https://bauval.org/21/53dfaa1e602b90eca2bca1bb2498f69e";
const nativeContainerId = "container-53dfaa1e602b90eca2bca1bb2498f69e";
const socialUrl = "https://bauval.org/14/bf66b7899926e0e9456c98066177a5f5";

/**
 * Banner GET CODE relies on a parser-time global atOptions and can use
 * document.write. A small same-origin srcdoc iframe preserves that execution
 * ordering without risking document.write replacing the whole Next.js page.
 * Keep the selected size stable for this document's lifecycle (do not load
 * both sizes or hot-swap provider scripts on resize).
 */
function loadResponsiveBanner() {
  const slot = document.querySelector<HTMLElement>("[data-adsterra-banner]");
  const host = slot?.querySelector<HTMLElement>("[data-adsterra-banner-creative]");
  if (!slot || !host || slot.dataset.adsterraLoaded === "true") return;

  const unit = window.innerWidth < 768 ? bannerMobile : bannerDesktop;
  const frame = document.createElement("iframe");
  frame.className = "adsterra-banner-frame";
  frame.title = "Advertisement";
  frame.width = String(unit.width);
  frame.height = String(unit.height);
  frame.setAttribute("scrolling", "no");
  // No sandbox: srcdoc inherits this site's origin/referrer, as the provider
  // snippet would when executed in the page. Do not rewrite provider URLs.
  frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;width:${unit.width}px;height:${unit.height}px;overflow:hidden}</style></head><body><script>atOptions = {'key': '${unit.key}', 'format': 'iframe', 'height': ${unit.height}, 'width': ${unit.width}, 'params': {}};<\/script><script src="${unit.url}"><\/script></body></html>`;
  host.appendChild(frame);
  slot.dataset.adsterraLoaded = "true";
}

function loadNative() {
  const slot = document.querySelector<HTMLElement>("[data-adsterra-native]");
  const host = slot?.querySelector<HTMLElement>("[data-adsterra-native-creative]");
  if (!slot || !host || slot.dataset.adsterraLoaded === "true") return;

  // The official Native container must exist before its async provider script.
  const container = document.createElement("div");
  container.id = nativeContainerId;
  host.appendChild(container);

  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = nativeUrl;
  host.appendChild(script);
  slot.dataset.adsterraLoaded = "true";
}

function loadSocialBarOnce() {
  if (document.getElementById("adsterra-social-bar-script")) return;
  const script = document.createElement("script");
  script.id = "adsterra-social-bar-script";
  script.async = false;
  script.setAttribute("data-cfasync", "false");
  script.src = socialUrl;
  document.body.appendChild(script);
}

/** Runs after React route changes, but Social Bar is initialized just once. */
export function AdsterraManager() {
  const pathname = usePathname();
  useEffect(() => {
    loadResponsiveBanner();
    loadNative();
    loadSocialBarOnce();
  }, [pathname]);
  return null;
}
