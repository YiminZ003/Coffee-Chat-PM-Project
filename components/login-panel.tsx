"use client";
import { useState } from "react";
import Link from "next/link";
import { browserSupabase, hasSupabase } from "@/lib/supabase/browser";
import { demoAllowed } from "@/lib/demo";
import { Icon } from "./icons";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setError(""); setMessage("");
    try {
      const valid = await fetch("/api/auth/check-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!valid.ok) throw new Error("That isn't a U of T address. Use your utoronto.ca email.");
      const supabase = browserSupabase();
      if (!supabase) throw new Error("Email sign-in isn't set up yet. Try the demo below.");
      const { error: authError } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` } });
      if (authError) throw authError;
      setMessage("Check your inbox. The sign-in link is on its way.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="panel">
      <div className="panel-bar"><span className="label">Sign in</span><span className="num">01</span></div>
      <div className="panel-body">
        <h2 className="panel-title">Get a sign-in link</h2>
        <form onSubmit={submit} className="form-stack">
          <label className="field">
            <span className="label">U of T email</span>
            <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@mail.utoronto.ca" />
          </label>
          <button type="submit" disabled={sending || !hasSupabase} className="btn btn-ink btn-block">
            {sending ? "Sending..." : "Send link"} <Icon name="arrow" size={16} />
          </button>
          {message && <p role="status" className="notice notice-ok">{message}</p>}
          {error && <p role="alert" className="notice notice-error">{error}</p>}
          {!hasSupabase && <p className="form-hint">Email sign-in turns on once the Supabase keys are set.</p>}
        </form>
        {demoAllowed && (
          <div className="panel-demo">
            <span className="label label-mute">Or</span>
            <Link className="btn btn-accent btn-block" href="/onboarding?demo=1">Try the demo <Icon name="arrow" size={16} /></Link>
            <p className="form-hint">The demo uses fictional profiles and keeps your answers in this browser only.</p>
          </div>
        )}
      </div>
      <div className="panel-foot label label-mute">For University of Toronto students and alumni</div>
    </div>
  );
}
