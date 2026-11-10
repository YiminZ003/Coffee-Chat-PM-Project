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
 return <><Nav active="me" demo={demo}/><main className="inner-page"><div className="container form-shell"><div className="back-row"><Link href={`/people${demo?"?demo=1":""}`} className="text-back"><Icon name="arrow-left" size={16}/> Back to people</Link>{!demo&&<SignOutButton/>}</div><div className="form-top"><div className="eyebrow">YOUR CORNER OF THE COMMUNITY</div><h1>Your story, <em>your way.</em></h1><p>Update how the community sees you and what kinds of chats you&apos;re open to.</p></div><ProfileForm demo={demo} initial={profile} editing/></div></main><Footer/></>
}
