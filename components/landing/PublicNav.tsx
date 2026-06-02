"use client";

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Free Tools", href: "/tools" },
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
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid #E9E9EC",
          borderRadius: "999px",
          padding: "6px 8px 6px 20px",
          boxShadow: scrolled ? "0 10px 30px -12px rgba(0,0,0,0.1)" : "none",
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
              style={{ color: "#5B5B63" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,10,10,0.05)"; (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#5B5B63"; }}
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
                  style={{ color: "#5B5B63" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,10,10,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  Sign in
                </button>
              </SignInButton>
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
          style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(14px)", borderColor: "#E9E9EC" }}
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
                  <button className="w-full text-center py-2.5 text-[14px] font-medium rounded-full border transition-colors" style={{ borderColor: "#E9E9EC", color: "#0A0A0A" }}>
                    Sign in
                  </button>
                </SignInButton>
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
