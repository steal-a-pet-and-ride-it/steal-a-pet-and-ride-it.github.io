import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function articleInner(page: SeoPageDefinition): string {
  const sections = page.sections.map((section) => {
    const paragraphs = [section.intro, ...(section.paragraphs ?? [])].filter(Boolean)
      .map((paragraph) => `<p>${esc(paragraph!)}</p>`).join("");
    const subsections = (section.subsections ?? []).map((item) => {
      const bullets = item.bullets?.length ? `<ul>${item.bullets.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";
      return `<div class="guide-subsection"><h3>${esc(item.heading)}</h3>${item.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}${bullets}</div>`;
    }).join("");
    const steps = section.steps?.length
      ? `<ol class="guide-steps">${section.steps.map((step) => `<li><strong>${esc(step.heading)}</strong> — ${esc(step.description)}</li>`).join("")}</ol>` : "";
    const table = section.table ? `<div class="guide-table-wrap"><table><caption>${esc(section.table.caption)}</caption><thead><tr>${section.table.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : "";
    const links = section.links?.length ? `<nav class="guide-related" aria-label="Related guides">${section.links.map((link) => `<a href="${esc(routePath(link.slug))}">${esc(link.label)} →</a>`).join("")}</nav>` : "";
    return `<section id="${esc(section.id)}" class="guide-content"><h2>${esc(section.heading)}</h2>${paragraphs}${subsections}${steps}${table}${links}</section>`;
  }).join("");
  const faq = page.faq?.length
    ? `<section id="faq" class="guide-content"><h2>Frequently Asked Questions</h2>${page.faq.map((item) => `<h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p>`).join("")}</section>` : "";
  const sources = page.sourceLinks?.length
    ? `<section class="guide-content guide-sources"><h2>Sources and Verification</h2><p>Facts and event times reviewed on <time datetime="${esc(page.lastReviewed)}">${esc(page.lastReviewed)}</time>. Event schedules may change; verify the newest developer announcement.</p><ul>${page.sourceLinks.filter((link) => /^https:\/\//.test(link.url)).map((link) => `<li><a href="${esc(link.url)}" rel="noopener noreferrer">${esc(link.label)}</a></li>`).join("")}</ul></section>` : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<nav class="guide-content" aria-label="More guides"><h2>Explore More Guides</h2><ul>${related.map((item) => `<li><a href="${esc(routePath(item.slug))}">${esc(item.navLabel)}</a></li>`).join("")}</ul></nav>` : "";
  return `<p class="lead">${esc(page.hero.lead)}</p><p class="guide-review">Last reviewed: <time datetime="${esc(page.lastReviewed)}">${esc(page.lastReviewed)}</time></p>${sections}${faq}${sources}${relatedHtml}`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: skin === "arcade-play" ? assetPath("/") : "/",
    logoUrl: skin === "arcade-play" ? assetPath(siteConfig.assets.logo) : null,
    ...(skin === "arcade-play" ? { legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: assetPath(routePath(item.slug)) })) } : {}),
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}
