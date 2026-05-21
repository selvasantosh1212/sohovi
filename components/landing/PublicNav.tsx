"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function PublicNav() {
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="sticky top-0 z-50 flex justify-center transition-all duration-300"
      style={{ paddingInline: "24px", paddingTop: scrolled ? "4px" : "12px", paddingBottom: "8px" }}
    >
      {/* Glass pill */}
      <nav
        className="w-full max-w-[1200px] flex items-center justify-between transition-all duration-300"
        style={{
          background: "rgba(251,247,242,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--hair-strong)",
          borderRadius: "999px",
          padding: "6px 8px 6px 20px",
          boxShadow: scrolled ? "0 4px 20px rgba(26,26,46,0.08)" : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/sohovi.svg"
            alt="Sohovi"
            width={88}
            height={22}
            className="h-[22px] w-auto"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium px-3 py-1.5 rounded-full transition-colors"
              style={{ color: "var(--ink-soft)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(26,26,46,0.06)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-soft)"; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {!isSignedIn && (
            <>
              <SignInButton mode="redirect">
                <button
                  className="text-[14px] font-medium px-4 py-1.5 rounded-full transition-colors"
                  style={{ color: "var(--ink-soft)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,26,46,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button
                  className="text-[14px] font-semibold px-4 py-1.5 rounded-full text-white transition-all"
                  style={{ background: "var(--terracotta)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px -4px rgba(224,113,80,0.5)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--terracotta-deep)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--terracotta)"; }}
                >
                  Get started
                </button>
              </SignUpButton>
            </>
          )}
          {isSignedIn && (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-[14px] font-medium px-4 py-1.5 rounded-full transition-colors"
                style={{ color: "var(--ink-soft)" }}
              >
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-full transition-colors"
          style={{ color: "var(--ink)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-[24px] border px-5 py-4 space-y-1"
          style={{ background: "rgba(251,247,242,0.97)", backdropFilter: "blur(12px)", borderColor: "var(--hair-strong)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-[15px] font-medium py-2.5 rounded-xl px-3 transition-colors"
              style={{ color: "var(--ink-soft)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t" style={{ borderColor: "var(--hair)" }}>
            {!isSignedIn && (
              <>
                <SignInButton mode="redirect">
                  <button className="w-full text-center py-2.5 text-[14px] font-medium rounded-full border transition-colors" style={{ borderColor: "var(--hair-strong)", color: "var(--ink)" }}>
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button className="w-full text-center py-2.5 text-[14px] font-semibold rounded-full text-white transition-colors" style={{ background: "var(--terracotta)" }}>
                    Get started
                  </button>
                </SignUpButton>
              </>
            )}
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="block text-center py-2.5 text-[15px] font-medium rounded-full"
                style={{ color: "var(--ink)", background: "var(--cream-deep)" }}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
