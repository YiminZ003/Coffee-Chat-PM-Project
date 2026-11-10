import {NextRequest,NextResponse} from "next/server";
import {serverSupabase} from "@/lib/supabase/server";
import {isUofTEmail} from "@/lib/auth";
export async function GET(request:NextRequest){
 const {searchParams,origin}=new URL(request.url);const code=searchParams.get("code");const next=searchParams.get("next")||"/onboarding";const destination=next.startsWith("/")&&!next.startsWith("//")?next:"/onboarding";
 const sb=await serverSupabase();if(!code||!sb)return NextResponse.redirect(`${origin}/login?error=missing-code`);
 const {error}=await sb.auth.exchangeCodeForSession(code);if(error)return NextResponse.redirect(`${origin}/login?error=link-expired`);
 const {data:{user}}=await sb.auth.getUser();if(!user?.email||!isUofTEmail(user.email)){await sb.auth.signOut();return NextResponse.redirect(`${origin}/login?error=university-email-required`);}
 return NextResponse.redirect(new URL(destination,origin));
}
