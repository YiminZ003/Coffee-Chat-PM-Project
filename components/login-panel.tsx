"use client";
import { useState } from "react";
import Link from "next/link";
import { browserSupabase,hasSupabase } from "@/lib/supabase/browser";
import { demoAllowed } from "@/lib/demo";
import { Icon } from "./icons";
export function LoginPanel(){
 const [email,setEmail]=useState("");const [sending,setSending]=useState(false);const [message,setMessage]=useState("");const [error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setSending(true);setError("");setMessage("");try{
 const valid=await fetch("/api/auth/check-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
 if(!valid.ok) throw new Error("Please use your University of Toronto email address.");
 const supabase=browserSupabase();if(!supabase) throw new Error("Live sign-in is not configured yet. Use the demo experience below.");
 const {error:authError}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:`${window.location.origin}/auth/callback?next=/onboarding`}});
 if(authError) throw authError;setMessage("Check your inbox. We sent you a secure sign-in link.");
 }catch(e){setError(e instanceof Error?e.message:"Something went wrong.");}finally{setSending(false);}}
 return <div className="login-card"><div className="tiny-icon"><Icon name="coffee" size={24}/></div><div className="eyebrow">YOUR PEOPLE ARE WAITING</div><h1>Find your circle.</h1><p>Sign in with your U of T email to start meeting people who get it.</p>
 <form onSubmit={submit} className="form-stack"><label className="field-label" htmlFor="sign-in-email">University email</label><div className="input-icon-wrap"><Icon name="mail" size={18}/><input id="sign-in-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@mail.utoronto.ca"/></div><button type="submit" disabled={sending||!hasSupabase} className="btn btn-primary btn-full">{sending?"Sending link…":"Continue with email"}<Icon name="arrow" size={18}/></button>
 {message&&<p role="status" className="notice-success">{message}</p>}{error&&<p role="alert" className="notice-error">{error}</p>}
 {!hasSupabase&&<p className="form-hint">U of T email sign-in becomes available once Supabase keys are configured.</p>}</form>
 {demoAllowed&&<><div className="or-line"><span>OR TRY IT FIRST</span></div><Link className="btn btn-outline btn-full" href="/onboarding?demo=1">Explore the interactive demo <Icon name="arrow-up-right" size={17}/></Link><p className="form-hint">Demo mode uses fictional profiles and saves your answers in this browser only.</p></>}
 <div className="secure-foot"><Icon name="shield" size={16}/> For University of Toronto students and alumni</div></div>;
}
