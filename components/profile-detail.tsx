"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "./avatar";
import { Icon } from "./icons";
import { defaultDemoProfile, sameIndustry } from "@/lib/data";
import { readDemoProfile } from "@/lib/demo";
import type { Profile, Suggestions } from "@/lib/types";

export function ProfileDetail({ target, viewer, demo }: { target: Profile; viewer: Profile | null; demo: boolean }) {
  const [mine, setMine] = useState<Profile>(viewer || defaultDemoProfile);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (demo) setMine(readDemoProfile()); }, [demo]);

  async function generate() {
    setLoading(true); setError(""); setSuggestions(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demo ? { targetId: target.id, viewer: mine, demo: true } : { targetId: target.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to generate ideas.");
      setSuggestions(data as Suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function copy() {
    if (!suggestions) return;
    await navigator.clipboard.writeText(suggestions.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const q = demo ? "?demo=1" : "";
  const shared = sameIndustry(target.industry, mine.industry);

  return (
    <>
      <Link href={`/people${q}`} className="back-link"><Icon name="arrow-left" size={16} /> All people</Link>

      <div className="detail grid-12">
        <article className="detail-sheet rise">
          <div className="detail-strip">
            <span className="label">{target.type === "alumni" ? "U of T alum" : "Current student"}</span>
            <span className="label">Class of {target.class_year}</span>
            <span className="label detail-open">Open to chats</span>
          </div>
          <div className="detail-id">
            <Avatar profile={target} size="xl" />
            <div>
              <h1 className="display-m">{target.name}</h1>
              <p className="detail-role">{target.role}</p>
            </div>
          </div>
          <dl className="detail-facts">
            <div><dt className="label label-mute">Class year</dt><dd>{target.class_year}</dd></div>
            <div><dt className="label label-mute">Program</dt><dd>{target.program}</dd></div>
            <div><dt className="label label-mute">Industry</dt><dd>{target.industry}{shared && <span className="label badge-match">Your industry</span>}</dd></div>
            <div><dt className="label label-mute">Why they&apos;re here</dt><dd>{target.chat_goal}</dd></div>
            <div>
              <dt className="label label-mute">Interests</dt>
              <dd><ul className="tags tags-flush">{target.interests.map(i => <li key={i}>{i}</li>)}</ul></dd>
            </div>
          </dl>
          {target.is_sample && (
            <p className="detail-sample label">Fictional sample profile. This person isn&apos;t real, so there is nobody to contact.</p>
          )}
        </article>

        <aside className="drafter rise rise-2">
          <div className="drafter-bar"><span className="label">Draft a message</span><span className="num">02</span></div>
          <div className="drafter-body">
            <h2 className="display-m">Get a first draft.</h2>
            <p>Open Chair reads your profile and theirs, then writes a short note and a few questions. You edit it and send it yourself.</p>
            <ol className="drafter-list">
              <li><span className="num">01</span> Why you two might get along</li>
              <li><span className="num">02</span> A first message</li>
              <li><span className="num">03</span> Questions to bring</li>
            </ol>
            <button type="button" className="btn btn-accent btn-block" onClick={generate} disabled={loading}>
              {loading ? "Writing..." : suggestions ? "Write another" : "Write my first message"}
              <Icon name="arrow" size={16} />
            </button>
            <p className="drafter-note">
              {demo
                ? "Demo mode uses a fixed template, not the AI model. The profiles are fictional."
                : "If an AI model is connected, both profiles are sent to it to write the draft. Email addresses are left out."}
            </p>
          </div>
        </aside>
      </div>

      {error && <div className="notice notice-error" role="alert">{error}</div>}

      {suggestions && (
        <section className="draft" aria-live="polite" aria-labelledby="draft-title">
          <div className="draft-head">
            <div>
              <span className="label label-mute"><span className="num">03</span> Your draft</span>
              <h2 id="draft-title" className="display-m">Here&apos;s a start.</h2>
            </div>
            <span className={`label draft-mode${suggestions.mode === "ai" ? " is-ai" : ""}`}>
              {suggestions.mode === "ai" ? "Written by AI" : "Template, not AI"}
            </span>
          </div>
          <div className="draft-row">
            <span className="draft-index">01</span>
            <h3>Why it fits</h3>
            <p>{suggestions.reason}</p>
          </div>
          <div className="draft-row">
            <span className="draft-index">02</span>
            <h3>First message</h3>
            <div>
              <p className="draft-message">{suggestions.message}</p>
              <button type="button" onClick={copy} className="btn btn-ink btn-sm">
                <Icon name={copied ? "check" : "copy"} size={15} />
                {copied ? "Copied" : "Copy message"}
              </button>
            </div>
          </div>
          <div className="draft-row">
            <span className="draft-index">03</span>
            <h3>Questions to bring</h3>
            <ol className="draft-questions">{suggestions.questions.map((qq, i) => <li key={i}>{qq}</li>)}</ol>
          </div>
          <p className="draft-caution">Read it over and make it sound like you before you send it. Open Chair doesn&apos;t send messages or book chats.</p>
        </section>
      )}
    </>
  );
}
