"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "var(--cream-deep)", borderTop: "1px solid var(--hair)" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/sohovi.svg"
                alt="Sohovi"
                width={96}
                height={24}
                className="h-6 w-auto"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)", opacity: 0.75 }}>
              Privacy-first data quality for small businesses and data teams. Your data never leaves your browser.
            </p>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "rgba(0,201,167,0.12)", color: "#00A882", border: "1px solid rgba(0,201,167,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
              100% client-side processing
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4
              className="font-bold uppercase"
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "var(--ink)" }}
            >
              Product
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Data Profiling", href: "/#features" },
                { label: "DQ Rules Engine", href: "/#features" },
                { label: "Score Tracking", href: "/#features" },
                { label: "Pricing", href: "/#pricing" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--ink-mute)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-mute)"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4
              className="font-bold uppercase"
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "var(--ink)" }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Blog", href: "/blog" },
                { label: "DQ Dimensions Guide", href: "/blog" },
                { label: "Templates Library", href: "/#features" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--ink-mute)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-mute)"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4
              className="font-bold uppercase"
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "var(--ink)" }}
            >
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Privacy Architecture", href: "/#privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "var(--ink-mute)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-mute)"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--hair)" }}
        >
          <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
            © {new Date().getFullYear()} Sohovi. All rights reserved.
          </p>
          <p className="text-xs text-center" style={{ color: "var(--ink-mute)", opacity: 0.6 }}>
            Built privacy-first. Your data never leaves your browser. GDPR-friendly by design.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://sohovi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid var(--hair-strong)", color: "var(--ink-mute)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-mute)"; }}
              aria-label="Website"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:hello@sohovi.com"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid var(--hair-strong)", color: "var(--ink-mute)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-mute)"; }}
              aria-label="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
