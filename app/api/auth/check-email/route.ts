import {NextResponse} from "next/server";
import {isUofTEmail} from "@/lib/auth";
export async function POST(request:Request){try{const data=await request.json();return NextResponse.json({valid:typeof data.email==="string"&&isUofTEmail(data.email)},{status:typeof data.email==="string"&&isUofTEmail(data.email)?200:400});}catch{return NextResponse.json({valid:false},{status:400});}}
