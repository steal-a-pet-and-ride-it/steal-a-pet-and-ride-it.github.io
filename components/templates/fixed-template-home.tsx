import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function supplement(home: HomePageDefinition): string {
  const sections = home.sections.map((section) => {
    const paragraphs = [section.intro, ...(section.paragraphs ?? [])].filter(Boolean)
      .map((paragraph) => `<p>${esc(paragraph!)}</p>`).join("");
    const subsections = (section.subsections ?? []).map((item) =>
      `<div class="guide-subsection"><h3>${esc(item.heading)}</h3>${item.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</div>`
    ).join("");
    const table = section.table ? `<div class="guide-table-wrap"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    const links = (section.links ?? []).length ? `<div class="guide-related">${section.links!.map((link) => `<a href="${esc(routePath(link.slug))}">${esc(link.label)} →</a>`).join("")}</div>` : "";
    return `<section id="${esc(section.id)}" class="guide-content"><h2>${esc(section.heading)}</h2>${paragraphs}${subsections}${table}${links}</section>`;
  }).join("");
  const official = siteConfig.game.officialUrl;
  const source = official ? `<p class="guide-source">Source: <a href="${esc(official)}" rel="noopener noreferrer">Official Roblox experience by Snail Riders</a> · checked October 29, 2026.</p>` : "";
  return `<div class="guide-supplement">${sections}${source}</div>`;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.slice(0, 6).map((link) => ({
    href: routePath(link.slug),
    title: link.label,
    text: link.label,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    actionHref: siteConfig.game.officialUrl,
    supplementHtml: supplement(home),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
      {home.faq.length ? (
        <div className="site-container"><Faq items={home.faq} /></div>
      ) : null}
    </>
  );
}
