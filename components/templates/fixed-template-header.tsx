"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { InternalLink } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const path = pathname.replace(/\/+$/, "") || "/";
  return (
    <header className="pet-header">
      <div className="pet-header-inner">
        <Link className="pet-brand" href="/" onClick={() => setOpen(false)} aria-label="Steal A Pet And Ride It homepage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.logo)} alt="" width={44} height={44} />
          <strong>{siteConfig.shortName}</strong>
        </Link>
        <button
          className="pet-menu-button"
          type="button"
          aria-controls="pet-primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav id="pet-primary-nav" className={`pet-nav${open ? " is-open" : ""}`} aria-label="Game guides">
          {links.filter((link) => link.slug !== "/").map((link) => {
            const href = routePath(link.slug);
            const target = href.replace(/\/+$/, "") || "/";
            const current = path === target;
            return (
              <Link key={link.slug} href={href} aria-current={current ? "page" : undefined} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
