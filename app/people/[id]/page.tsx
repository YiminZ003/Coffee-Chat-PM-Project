import type {Metadata} from "next";
import {notFound,redirect} from "next/navigation";
import {Nav,Footer,DemoBanner} from "@/components/nav";
import {ProfileDetail} from "@/components/profile-detail";
import {getPerson,getSession} from "@/lib/data-source";
import {sampleProfiles} from "@/lib/data";
import {demoAllowed} from "@/lib/demo";
import {hasSupabase} from "@/lib/supabase/server";
export const metadata:Metadata={title:"Your next connection"};
export default async function PersonPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{demo?:string}>}){
 const [{id},p]=await Promise.all([params,searchParams]);const demo=demoAllowed&&(p.demo==="1"||!hasSupabase);const {user,profile}=demo?{user:null,profile:null}:await getSession();if(!demo&&!user)redirect("/login");if(!demo&&!profile)redirect("/onboarding");
 const target=demo?sampleProfiles.find(x=>x.id===id):await getPerson(id);if(!target||!target.open_to_chats)notFound();
 return <><Nav active="people" demo={demo}/>{demo&&<DemoBanner/>}<main className="inner-page"><div className="container"><ProfileDetail target={target} viewer={profile} demo={demo}/></div></main><Footer/></>;
}
