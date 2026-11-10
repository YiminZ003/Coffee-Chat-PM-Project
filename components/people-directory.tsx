"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Avatar } from "./avatar";
import { Icon } from "./icons";
import { readDemoProfile } from "@/lib/demo";
import { defaultDemoProfile, industries as industryList, programs as programList, sameIndustry } from "@/lib/data";

type Tab = "all" | "alumni" | "student";
const merge = (base: string[], extra: string[]) => [...new Set([...base, ...extra])];

export function PeopleDirectory({ people, demo, viewer }: { people: Profile[]; demo: boolean; viewer: Profile | null }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const [program, setProgram] = useState("all");
  const [year, setYear] = useState("all");
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState("relevant");
  const [myProfile, setMyProfile] = useState<Profile>(viewer || defaultDemoProfile);
  useEffect(() => { if (demo) setMyProfile(readDemoProfile()); }, [demo]);

  const active = people.filter(p => p.open_to_chats && (demo || p.id !== myProfile.id));
  const industries = merge(industryList, active.map(p => p.industry)).sort();
  const programs = merge(programList, active.map(p => p.program)).sort();
  const years = [...new Set(active.map(p => p.class_year))].sort((a, b) => b - a);
  const alumniCount = active.filter(p => p.type === "alumni").length;
  const studentCount = active.length - alumniCount;

  const results = active
    .filter(p => {
      const q = query.trim().toLowerCase();
      const searchable = [p.name, p.role, p.program, p.industry, p.chat_goal, ...p.interests].join(" ").toLowerCase();
      return (!q || searchable.includes(q))
        && (industry === "all" || p.industry === industry)
        && (program === "all" || p.program === program)
        && (year === "all" || String(p.class_year) === year)
        && (tab === "all" || p.type === tab);
    })
    .sort((a, b) =>
      sort === "newest" ? b.class_year - a.class_year
        : sort === "oldest" ? a.class_year - b.class_year
          : Number(sameIndustry(b.industry, myProfile.industry)) - Number(sameIndustry(a.industry, myProfile.industry)) || b.class_year - a.class_year);

  const reset = () => { setQuery(""); setIndustry("all"); setProgram("all"); setYear("all"); setTab("all"); setSort("relevant"); };
  const filtersActive = Boolean(query || industry !== "all" || program !== "all" || year !== "all" || tab !== "all");
  const q = demo ? "?demo=1" : "";
  const tabs: [Tab, string, number][] = [["all", "Everyone", active.length], ["alumni", "Alumni", alumniCount], ["student", "Students", studentCount]];

  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="label label-mute page-kicker"><span className="num">01</span> People</span>
          <h1 className="display-l rise">People who said yes.</h1>
          <div className="page-head-row rise rise-2">
            <p className="lede">Everyone here opted in to a coffee chat. People in your industry are listed first.</p>
            <dl className="tally">
              <div><dt className="label label-mute">Open</dt><dd>{active.length}</dd></div>
              <div><dt className="label label-mute">Alumni</dt><dd>{alumniCount}</dd></div>
              <div><dt className="label label-mute">Students</dt><dd>{studentCount}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container directory">
        <div className="seg" role="group" aria-label="Filter by member type">
          {tabs.map(([value, label, count]) => (
            <button key={value} type="button" aria-pressed={tab === value} className={tab === value ? "is-on" : ""} onClick={() => setTab(value)}>
              {label} <span className="num">{count}</span>
            </button>
          ))}
        </div>

        <div className="filters">
          <label className="filter filter-search">
            <span className="label label-mute">Search</span>
            <span className="filter-input">
              <Icon name="search" size={18} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, role, interest" />
            </span>
          </label>
          <label className="filter">
            <span className="label label-mute">Industry</span>
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              <option value="all">All industries</option>
              {industries.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="filter">
            <span className="label label-mute">Program</span>
            <select value={program} onChange={e => setProgram(e.target.value)}>
              <option value="all">All programs</option>
              {programs.map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="filter">
            <span className="label label-mute">Class year</span>
            <select value={year} onChange={e => setYear(e.target.value)}>
              <option value="all">Any year</option>
              {years.map(x => <option key={x} value={String(x)}>{x}</option>)}
            </select>
          </label>
          <label className="filter">
            <span className="label label-mute">Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="relevant">Your industry</option>
              <option value="newest">Newest class first</option>
              <option value="oldest">Oldest class first</option>
            </select>
          </label>
        </div>

        <div className="results-bar">
          <span className="label">Showing {results.length} of {active.length}</span>
          {filtersActive && (
            <button type="button" className="text-link" onClick={reset}>Clear filters</button>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="people-grid">
            {results.map(p => {
              const shared = sameIndustry(p.industry, myProfile.industry);
              return (
                <li key={p.id}>
                  <Link className="person-card" href={`/people/${p.id}${q}`}>
                    <div className="person-card-top">
                      <span className="label">{p.type === "alumni" ? "Alum" : "Student"}</span>
                      <span className="label">Class of {p.class_year}</span>
                    </div>
                    <div className="person-card-id">
                      <Avatar profile={p} size="lg" />
                      <div>
                        <h2>{p.name}</h2>
                        <p>{p.role}</p>
                      </div>
                    </div>
                    <dl className="person-card-facts">
                      <div><dt className="label label-mute">Industry</dt><dd>{p.industry}{shared && <span className="label badge-match">Your industry</span>}</dd></div>
                      <div><dt className="label label-mute">Program</dt><dd>{p.program}</dd></div>
                    </dl>
                    <ul className="tags" aria-label="Interests">
                      {p.interests.slice(0, 3).map(t => <li key={t}>{t}</li>)}
                    </ul>
                    <div className="person-card-foot">
                      <span className="label label-mute">{p.is_sample ? "Fictional sample" : "Member"}</span>
                      <span className="person-card-go">Open <Icon name="arrow" size={16} /></span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty">
            <h2 className="display-m">Nobody matches that.</h2>
            <p>Try another industry or program, or clear the filters and start over.</p>
            <button type="button" className="btn btn-ink" onClick={reset}>Clear filters</button>
          </div>
        )}

        <div className="directory-foot">
          <p>The order follows the industry on your profile. Change it and the list reshuffles.</p>
          <Link href={`/me${q}`} className="btn btn-ghost">Edit your profile</Link>
        </div>
      </section>
    </>
  );
}
