"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "#FFFFFF", borderTop: "1px solid #E9E9EC" }}>
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
            <p className="text-sm leading-relaxed" style={{ color: "#5B5B63" }}>
              Privacy-first data quality for small businesses and data teams. Your data never leaves your browser.
            </p>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{ background: "#0A0A0A", color: "#FFE439", border: "1px solid #0A0A0A" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
              Zero bytes uploaded
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4
              className="font-bold uppercase"
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "#0A0A0A" }}
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
                    style={{ color: "#8A8A90" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A8A90"; }}
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
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "#0A0A0A" }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Blog", href: "/blog" },
                { label: "DQ Dimensions Guide", href: "/blog/category/data-quality-dimensions" },
                { label: "Free Tools", href: "/tools" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "#8A8A90" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A8A90"; }}
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
              style={{ fontSize: "13px", letterSpacing: "0.08em", color: "#0A0A0A" }}
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
                    style={{ color: "#8A8A90" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A8A90"; }}
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
          style={{ borderTop: "1px solid #E9E9EC" }}
        >
          <p className="text-sm" style={{ color: "#8A8A90" }}>
            © {new Date().getFullYear()} Sohovi. All rights reserved.
          </p>
          <p className="text-xs text-center" style={{ color: "#8A8A90", opacity: 0.8 }}>
            Built privacy-first. Your data never leaves your browser. GDPR-friendly by design.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://sohovi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid #E9E9EC", color: "#8A8A90" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A8A90"; }}
              aria-label="Website"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:hello@sohovi.com"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: "1px solid #E9E9EC", color: "#8A8A90" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8A8A90"; }}
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
