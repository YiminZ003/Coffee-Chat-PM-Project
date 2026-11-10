import type { Metadata } from "next";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Nav,Footer,SignOutButton} from "@/components/nav";
import {ProfileForm} from "@/components/profile-form";
import {Icon} from "@/components/icons";
import {demoAllowed} from "@/lib/demo";
import {hasSupabase} from "@/lib/supabase/server";
import {getSession} from "@/lib/data-source";
export const metadata:Metadata={title:"My profile"};
export default async function MyProfile({searchParams}:{searchParams:Promise<{demo?:string}>}){const p=await searchParams;const demo=demoAllowed&&(p.demo==="1"||!hasSupabase);const {user,profile}=demo?{user:null,profile:null}:await getSession();if(!demo&&!user)redirect("/login");
 return <><Nav active="me" demo={demo}/><main className="container form-page">
  <div className="form-topbar"><Link href={`/people${demo?"?demo=1":""}`} className="back-link"><Icon name="arrow-left" size={16}/> All people</Link>{!demo&&<SignOutButton/>}</div>
  <div className="form-head rise"><span className="label label-mute page-kicker"><span className="num">03</span> Your profile</span><h1 className="display-l">Your profile.</h1><p className="lede">Change what people see, and whether you&apos;re open to chats at all.</p></div>
  <div className="rise rise-2"><ProfileForm demo={demo} initial={profile} editing/></div>
 </main><Footer/></>
}
