import {NextResponse} from "next/server";
import {getSession} from "@/lib/data-source";
import {sampleProfiles} from "@/lib/data";
import {demoAllowed} from "@/lib/demo";
import {generateSuggestions} from "@/lib/ai";
import type {Profile} from "@/lib/types";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(req:Request){try{
 const body=await req.json();if(typeof body.targetId!=="string"||!uuid.test(body.targetId))return NextResponse.json({error:"Invalid profile."},{status:400});
 let target:Profile|null=null;let viewer:Profile|null=null;
 if(body.demo===true){if(!demoAllowed)return NextResponse.json({error:"Demo mode is disabled."},{status:403});target=sampleProfiles.find(p=>p.id===body.targetId&&p.open_to_chats)||null;const input=body.viewer;
  if(!input||typeof input.name!=="string"||typeof input.program!=="string"||typeof input.industry!=="string"||typeof input.chat_goal!=="string"||!Array.isArray(input.interests))return NextResponse.json({error:"Complete your demo profile first."},{status:400});
  viewer={id:"demo",name:input.name.slice(0,90),email:null,type:input.type==="alumni"?"alumni":"student",program:input.program.slice(0,80),class_year:Number(input.class_year)||2027,industry:input.industry.slice(0,80),role:String(input.role||"student").slice(0,120),interests:input.interests.filter((x:unknown)=>typeof x==="string").slice(0,10).map((s:string)=>s.slice(0,50)),chat_goal:input.chat_goal.slice(0,320),open_to_chats:true,is_sample:false};
 }else{const {supabase,user,profile}=await getSession();if(!supabase||!user||!profile)return NextResponse.json({error:"Please sign in and finish onboarding."},{status:401});const {data}=await supabase.from("profiles").select("*").eq("id",body.targetId).eq("open_to_chats",true).maybeSingle();target=data as Profile|null;viewer=profile;}
 if(!viewer||!target)return NextResponse.json({error:"This profile is unavailable."},{status:404});
 // Demo mode never incurs external AI costs: it is intentionally a labeled template preview.
 const result=body.demo===true?await import("@/lib/ai").then(m=>m.templateSuggestions(viewer!,target!)):await generateSuggestions(viewer,target);
 return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});
 }catch(e){const msg=e instanceof Error?e.message:"Unexpected error";return NextResponse.json({error:msg.includes("AI")?"Suggestions are temporarily unavailable. Please retry.":"Unable to create suggestions."},{status:500});}}
