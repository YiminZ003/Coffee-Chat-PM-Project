import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {PeopleDirectory} from "@/components/people-directory";
import {Nav,Footer,DemoBanner} from "@/components/nav";
import {sampleProfiles} from "@/lib/data";
import {getSession,getPeople} from "@/lib/data-source";
import {hasSupabase} from "@/lib/supabase/server";
import {demoAllowed} from "@/lib/demo";
export const metadata:Metadata={title:"People"};
export default async function People({searchParams}:{searchParams:Promise<{demo?:string}>}){
 const p=await searchParams;const demo=demoAllowed&&(p.demo==="1"||!hasSupabase);const {user,profile}=demo?{user:null,profile:null}:await getSession();if(!demo&&!user)redirect("/login");if(!demo&&!profile)redirect("/onboarding");
 const people=demo?sampleProfiles:await getPeople();return <><Nav active="people" demo={demo}/><main>{demo&&<DemoBanner/>}<PeopleDirectory people={people} demo={demo} viewer={profile}/></main><Footer/></>
}
