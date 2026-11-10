"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icons";
import { browserSupabase } from "@/lib/supabase/browser";
export function Brand(){return <Link href="/" className="brand" aria-label="Coffee Chats homepage"><span className="brand-symbol"><Icon name="coffee" size={18}/></span><span>coffee<span className="brand-script">chats</span><span className="brand-dot">.</span></span></Link>;}
export function Nav({active="home",demo=false}:{active?:"home"|"people"|"me";demo?:boolean}){
 const [open,setOpen]=useState(false); const q=demo?"?demo=1":"";
 return <header className="site-header"><div className="nav-inner container"><Brand/>
  <nav className={`nav-links ${open?"nav-open":""}`} aria-label="Primary navigation">
   <Link onClick={()=>setOpen(false)} className={active==="home"?"active":""} href="/">Home</Link>
   <Link onClick={()=>setOpen(false)} className={active==="people"?"active":""} href={`/people${q}`}>Explore people</Link>
   <Link onClick={()=>setOpen(false)} href="/#how-it-works">How it works</Link>
   {active!=="home"&&<Link className={active==="me"?"active":""} onClick={()=>setOpen(false)} href={`/me${q}`}>My profile</Link>}
  </nav>
  <div className="nav-actions">{active==="home"?<Link href="/login" className="btn btn-primary btn-small">Get started <Icon name="arrow-up-right" size={16}/></Link>:<Link href={`/me${q}`} className="nav-profile" aria-label="Edit my profile"><Icon name="users" size={18}/></Link>}
  <button type="button" className="nav-toggle" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}><Icon name={open?"x":"menu"}/></button></div>
 </div></header>;
}
export function DemoBanner(){return <div className="demo-notice"><Icon name="shield" size={17}/> <span><strong>Demo experience.</strong> These are fictional sample profiles. No real contact information is displayed.</span></div>}
export function Footer(){return <footer className="footer"><div className="container footer-content"><Brand/><span>Small conversations. Big possibilities.</span><span>Built for the University of Toronto community · Student prototype</span></div></footer>}
export function SignOutButton(){return <button className="btn btn-outline" type="button" onClick={async()=>{const sb=browserSupabase();if(sb) await sb.auth.signOut();window.location.href="/login";}}><Icon name="logout" size={17}/> Sign out</button>}
