"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icons";
import { browserSupabase } from "@/lib/supabase/browser";
import { readDemoProfile,saveDemoProfile } from "@/lib/demo";
import { defaultDemoProfile,industries,programs } from "@/lib/data";
import type { Profile } from "@/lib/types";
const types=[{value:"student",label:"Current student"},{value:"alumni",label:"Alumni"}];
export function ProfileForm({demo,initial,editing=false}:{demo:boolean;initial?:Profile|null;editing?:boolean}){
 const router=useRouter();const [profile,setProfile]=useState<Profile>(initial||defaultDemoProfile);const [saving,setSaving]=useState(false);const [error,setError]=useState("");const [interests,setInterests]=useState((initial||defaultDemoProfile).interests.join(", "));
 useEffect(()=>{if(demo){const saved=readDemoProfile();setProfile(saved);setInterests(saved.interests.join(", "));}},[demo]);
 function update<K extends keyof Profile>(key:K,value:Profile[K]){setProfile(p=>({...p,[key]:value}));}
 async function submit(event:React.FormEvent){event.preventDefault();setSaving(true);setError("");try{
 const data:Profile={...profile,name:profile.name.trim(),interests:interests.split(",").map(s=>s.trim()).filter(Boolean).slice(0,12),is_sample:false};
 if(!data.name||!data.chat_goal.trim()) throw new Error("Please complete your name and conversation goal.");
 if(data.class_year<1950||data.class_year>2100) throw new Error("Please enter a valid class year.");
 if(demo){saveDemoProfile(data);router.push("/people?demo=1");return;}
 const sb=browserSupabase();if(!sb) throw new Error("Supabase is not connected.");
 const {data:{user}}=await sb.auth.getUser();if(!user) throw new Error("Your session expired. Please sign in again.");
 const payload={...data,id:user.id,owner_user_id:user.id,email:user.email,avatar_tone:"peach"};
 const {error:dbError}=await sb.from("profiles").upsert(payload,{onConflict:"id"});if(dbError) throw dbError;
 router.push("/people");router.refresh();
 }catch(e){setError(e instanceof Error?e.message:"Unable to save profile.");}finally{setSaving(false);}}
 return <form onSubmit={submit} className="profile-form"><div className="form-columns"><div className="form-field"><label htmlFor="name">Your full name</label><input id="name" required maxLength={90} value={profile.name} onChange={e=>update("name",e.target.value)} placeholder="Alex Morgan"/></div><div className="form-field"><label htmlFor="member-type">I&apos;m a...</label><select id="member-type" value={profile.type} onChange={e=>update("type",e.target.value as Profile["type"])}>{types.map(t=><option value={t.value} key={t.value}>{t.label}</option>)}</select></div><div className="form-field"><label htmlFor="program">Program</label><select id="program" value={profile.program} onChange={e=>update("program",e.target.value)}>{[...new Set([profile.program,...programs])].map(p=><option key={p}>{p}</option>)}</select></div><div className="form-field"><label htmlFor="class-year">Class year</label><input id="class-year" type="number" min="1950" max="2100" required value={profile.class_year} onChange={e=>update("class_year",Number(e.target.value))}/></div><div className="form-field"><label htmlFor="industry">Industry of interest</label><select id="industry" value={profile.industry} onChange={e=>update("industry",e.target.value)}>{[...new Set([profile.industry,...industries])].map(x=><option key={x}>{x}</option>)}</select></div><div className="form-field"><label htmlFor="role">Current role or goal</label><input id="role" value={profile.role} maxLength={120} onChange={e=>update("role",e.target.value)} placeholder="Aspiring analyst, PM, student…"/></div></div>
 <div className="form-field"><label htmlFor="interests">What are you curious about?</label><input id="interests" value={interests} onChange={e=>setInterests(e.target.value)} placeholder="AI, consulting, startups"/><span className="form-helper">Separate interests with commas.</span></div>
 <div className="form-field"><label htmlFor="chat-goal">What would you like from a coffee chat?</label><textarea id="chat-goal" value={profile.chat_goal} required maxLength={320} onChange={e=>update("chat_goal",e.target.value)} rows={3} placeholder="I want to learn how people broke into product management…"/></div>
 <label className="switch-row"><span><strong>Open to coffee chats</strong><small>Let other U of T members discover your profile.</small></span><input aria-label="Open to coffee chats" type="checkbox" checked={profile.open_to_chats} onChange={e=>update("open_to_chats",e.target.checked)}/><span className="switch-track"/></label>
 {error&&<div role="alert" className="notice-error">{error}</div>}
 <div className="form-bottom"><span><Icon name="shield" size={16}/> You can edit your profile later.</span><button className="btn btn-primary" type="submit" disabled={saving}>{saving?"Saving…":editing?"Save changes":"Find my people"}<Icon name="arrow" size={18}/></button></div>
 </form>;
}
