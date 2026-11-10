import { serverSupabase } from "@/lib/supabase/server";
import { sampleProfiles } from "@/lib/data";
import { isUofTEmail } from "@/lib/auth";
import type { Profile } from "@/lib/types";
export async function getSession(){
 const supabase=await serverSupabase();
 if(!supabase) return {supabase:null,user:null,profile:null};
 const {data:{user}}=await supabase.auth.getUser();
 if(!user || !user.email || !isUofTEmail(user.email)) return {supabase,user:null,profile:null};
 const {data:profile}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
 return {supabase,user,profile:(profile as Profile | null)};
}
export async function getPeople(){
 const {supabase,user}=await getSession();
 if(!supabase) return sampleProfiles;
 if(!user) return [];
 const {data,error}=await supabase.from("profiles").select("*").eq("open_to_chats",true).order("class_year",{ascending:false});
 if(error) return [];
 return data as Profile[];
}
export async function getPerson(id:string){
 const {supabase,user}=await getSession();
 if(!supabase) return sampleProfiles.find(p=>p.id===id)??null;
 if(!user) return null;
 const {data}=await supabase.from("profiles").select("*").eq("id",id).eq("open_to_chats",true).maybeSingle();
 return data as Profile|null;
}
