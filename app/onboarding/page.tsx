import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav,Footer } from "@/components/nav";
import { ProfileForm } from "@/components/profile-form";
import { demoAllowed } from "@/lib/demo";
import { hasSupabase } from "@/lib/supabase/server";
import { getSession } from "@/lib/data-source";
export const metadata:Metadata={title:"Your profile"};
export default async function Onboarding({searchParams}:{searchParams:Promise<{demo?:string}>}){const p=await searchParams;const demo=demoAllowed&&(p.demo==="1"||!hasSupabase);const {user,profile}=demo?{user:null,profile:null}:await getSession();if(!demo&&!user)redirect("/login");
 return <><Nav active="people" demo={demo}/><main className="container form-page">
  <div className="form-head rise"><span className="label label-mute page-kicker"><span className="num">01</span> Your profile</span><h1 className="display-l">Tell us who you are.</h1><p className="lede">This decides who shows up first and what the draft says. It takes about two minutes.</p></div>
  <div className="rise rise-2"><ProfileForm demo={demo} initial={profile}/></div>
 </main><Footer/></>;
}
