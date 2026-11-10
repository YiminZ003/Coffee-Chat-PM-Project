"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icons";
import { Logo } from "./Logo";
import { browserSupabase } from "@/lib/supabase/browser";

export function Brand({ size = 24 }: { size?: number }) {
  return (
    <Link href="/" className="brand" aria-label="Open Chair, home">
      <Logo size={size} />
    </Link>
  );
}

export function Nav({ active = "home", demo = false }: { active?: "home" | "people" | "me"; demo?: boolean }) {
  const [open, setOpen] = useState(false);
  const q = demo ? "?demo=1" : "";
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav id="primary-nav" className={`header-nav${open ? " is-open" : ""}`} aria-label="Primary">
          <Link onClick={close} className={active === "people" ? "is-active" : ""} href={`/people${q}`}>
            <span className="num">01</span> People
          </Link>
          <Link onClick={close} href="/#how-it-works">
            <span className="num">02</span> How it works
          </Link>
          {active !== "home" && (
            <Link onClick={close} className={active === "me" ? "is-active" : ""} href={`/me${q}`}>
              <span className="num">03</span> Your profile
            </Link>
          )}
        </nav>
        <div className="header-actions">
          {active === "home" ? (
            <Link href="/login" className="btn btn-ink btn-sm">Sign in</Link>
          ) : (
            <Link href={`/me${q}`} className="btn btn-ghost btn-sm header-profile">Profile</Link>
          )}
          <button
            type="button"
            className="header-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <div className="container demo-banner-inner">
        <span className="label">Demo</span>
        <span>Every profile here is a fictional sample. Nobody on this page is real, and no contact details are shown.</span>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Logo size={44} />
          <p className="footer-tagline">Pull up a chair.</p>
        </div>
        <div className="footer-grid">
          <div>
            <span className="label footer-credit">Presented by Team 16</span>
            <p>AI Product Management, Rotman MMA, Fall 2026. Student prototype.</p>
          </div>
          <div>
            <span className="label label-mute">Note</span>
            <p>Sample profiles are fictional. Open Chair never sends messages or books chats for you.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/people">People</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/login">Sign in</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function SignOutButton() {
  return (
    <button
      className="btn btn-ghost btn-sm"
      type="button"
      onClick={async () => {
        const sb = browserSupabase();
        if (sb) await sb.auth.signOut();
        window.location.href = "/login";
      }}
    >
      <Icon name="logout" size={16} /> Sign out
    </button>
  );
}
