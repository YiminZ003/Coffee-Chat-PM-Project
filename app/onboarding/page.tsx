import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav,Footer } from "@/components/nav";
import { ProfileForm } from "@/components/profile-form";
import { Icon } from "@/components/icons";
import { demoAllowed } from "@/lib/demo";
import { hasSupabase } from "@/lib/supabase/server";
import { getSession } from "@/lib/data-source";
export const metadata:Metadata={title:"Tell us about yourself"};
export default async function Onboarding({searchParams}:{searchParams:Promise<{demo?:string}>}){const p=await searchParams;const demo=demoAllowed&&(p.demo==="1"||!hasSupabase);const {user,profile}=demo?{user:null,profile:null}:await getSession();if(!demo&&!user)redirect("/login");
 return <><Nav active="people" demo={demo}/><main className="inner-page onboarding-page"><div className="container form-shell"><div className="form-top"><span className="form-counter">01 / THE INTRODUCTION</span><div className="form-illustration"><Icon name="sparkles" size={35}/></div><div className="eyebrow">A LITTLE ABOUT YOU</div><h1>Let&apos;s get to <em>know you.</em></h1><p>A few details help you find people who share your interests and understand your goals.</p></div><ProfileForm demo={demo} initial={profile}/></div></main><Footer/></>;
}
