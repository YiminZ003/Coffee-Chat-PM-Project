"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icons";
import { browserSupabase } from "@/lib/supabase/browser";
import { readDemoProfile, saveDemoProfile } from "@/lib/demo";
import { defaultDemoProfile, industries, programs } from "@/lib/data";
import type { Profile } from "@/lib/types";

const types = [{ value: "student", label: "Current student" }, { value: "alumni", label: "Alum" }];

export function ProfileForm({ demo, initial, editing = false }: { demo: boolean; initial?: Profile | null; editing?: boolean }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initial || defaultDemoProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState((initial || defaultDemoProfile).interests.join(", "));
  useEffect(() => { if (demo) { const saved = readDemoProfile(); setProfile(saved); setInterests(saved.interests.join(", ")); } }, [demo]);
  function update<K extends keyof Profile>(key: K, value: Profile[K]) { setProfile(p => ({ ...p, [key]: value })); }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const data: Profile = { ...profile, name: profile.name.trim(), interests: interests.split(",").map(s => s.trim()).filter(Boolean).slice(0, 12), is_sample: false };
      if (!data.name || !data.chat_goal.trim()) throw new Error("Add your name and what you want from a chat.");
      if (data.class_year < 1950 || data.class_year > 2100) throw new Error("That class year doesn't look right.");
      if (demo) { saveDemoProfile(data); router.push("/people?demo=1"); return; }
      const sb = browserSupabase();
      if (!sb) throw new Error("Supabase isn't connected.");
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");
      const payload = { ...data, id: user.id, owner_user_id: user.id, email: user.email, avatar_tone: "peach" };
      const { error: dbError } = await sb.from("profiles").upsert(payload, { onConflict: "id" });
      if (dbError) throw dbError;
      router.push("/people"); router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="profile-form">
      <fieldset className="form-group">
        <legend className="label"><span className="num">A</span> About you</legend>
        <div className="form-grid">
          <label className="field">
            <span className="label">Full name</span>
            <input required maxLength={90} value={profile.name} onChange={e => update("name", e.target.value)} placeholder="Alex Morgan" />
          </label>
          <label className="field">
            <span className="label">You are</span>
            <select value={profile.type} onChange={e => update("type", e.target.value as Profile["type"])}>
              {types.map(t => <option value={t.value} key={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="label">Program</span>
            <select value={profile.program} onChange={e => update("program", e.target.value)}>
              {[...new Set([profile.program, ...programs])].map(p => <option key={p}>{p}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="label">Class year</span>
            <input type="number" min="1950" max="2100" required value={profile.class_year} onChange={e => update("class_year", Number(e.target.value))} />
            <span className="form-hint">Alumni: the year you graduated. Students: the year you expect to.</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="form-group">
        <legend className="label"><span className="num">B</span> What you&apos;re after</legend>
        <div className="form-grid">
          <label className="field">
            <span className="label">Industry</span>
            <select value={profile.industry} onChange={e => update("industry", e.target.value)}>
              {[...new Set([profile.industry, ...industries])].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="label">Current role or goal</span>
            <input value={profile.role} maxLength={120} onChange={e => update("role", e.target.value)} placeholder="Analyst, PM, student" />
          </label>
          <label className="field field-wide">
            <span className="label">Interests</span>
            <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="Credit risk, pricing, SQL" />
            <span className="form-hint">Separate with commas.</span>
          </label>
          <label className="field field-wide">
            <span className="label">What you want from a chat</span>
            <textarea value={profile.chat_goal} required maxLength={320} onChange={e => update("chat_goal", e.target.value)} rows={3} placeholder="I want to know how people get into product management." />
          </label>
        </div>
      </fieldset>

      <label className="toggle">
        <span>
          <strong>Open to coffee chats</strong>
          <small>Other signed-in U of T members can find your profile.</small>
        </span>
        <input type="checkbox" checked={profile.open_to_chats} onChange={e => update("open_to_chats", e.target.checked)} />
        <span className="toggle-box" aria-hidden="true"><span>{profile.open_to_chats ? "On" : "Off"}</span></span>
      </label>

      {error && <div role="alert" className="notice notice-error">{error}</div>}

      <div className="form-actions">
        <span className="form-hint">You can change all of this later.</span>
        <button className="btn btn-ink" type="submit" disabled={saving}>
          {saving ? "Saving..." : editing ? "Save changes" : "Show me people"} <Icon name="arrow" size={16} />
        </button>
      </div>
    </form>
  );
}
