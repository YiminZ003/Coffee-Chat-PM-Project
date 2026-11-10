import type {Profile,Suggestions} from "./types";
const clean=(s:string,max=320)=>s.trim().slice(0,max);
export function safeProfile(profile:Profile){return {name:clean(profile.name,90),type:profile.type,program:clean(profile.program,80),class_year:profile.class_year,industry:clean(profile.industry,80),role:clean(profile.role,120),interests:profile.interests.slice(0,10).map(x=>clean(x,50)),chat_goal:clean(profile.chat_goal)};}
export function templateSuggestions(viewer:Profile,target:Profile):Suggestions{
 const common=viewer.interests.find(i=>target.interests.some(j=>j.toLowerCase()===i.toLowerCase()));
 const reason=`${target.name} has experience in ${target.industry.toLowerCase()}${common?` and shares your interest in ${common.toLowerCase()}`:""}. Their background in ${target.program} could offer a useful perspective on your goal: ${clean(viewer.chat_goal,145)}.`;
 const first=target.name.split(" ")[0];
 const message=`Hi ${first}! I'm ${viewer.name}, a ${viewer.program} ${viewer.type==="student"?"student":"alum"} exploring ${viewer.industry.toLowerCase()}. I came across your profile and was interested in your experience as a ${target.role}. If you're open to it, I'd love to hear about your path and ask a few questions over a short coffee chat. Thanks for considering it!`;
 const questions=[`What led you to your current role in ${target.industry.toLowerCase()}?`,`What skills or experiences helped you most early in your career?`,`What would you recommend to someone with an interest in ${viewer.industry.toLowerCase()}?`,`Is there anything you wish you'd known when you were at U of T?`];
 return {reason,message,questions,mode:"template"};
}
export async function generateSuggestions(viewer:Profile,target:Profile):Promise<Suggestions>{
 const key=process.env.LLM_API_KEY;if(!key) return templateSuggestions(viewer,target);
 const base=(process.env.LLM_API_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,"");
 const system=`You help University of Toronto students and alumni draft warm, appropriate networking messages. Use ONLY supplied profile facts. Do not invent workplaces, connections, achievements, contact details or promises. Return STRICT JSON with keys reason (1-2 sentences), message (50-90 words), questions (array of exactly 4 specific open-ended questions). Be human, friendly, and respectful; no pressure to respond. No markdown.`;
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetch(`${base}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.LLM_MODEL||"gpt-4o-mini",temperature:0.7,max_tokens:700,response_format:{type:"json_object"},messages:[{role:"system",content:system},{role:"user",content:JSON.stringify({viewer:safeProfile(viewer),target:safeProfile(target)})}]}),signal:controller.signal,cache:"no-store"});
  if(!response.ok) throw new Error(`AI request failed (${response.status})`);
  const body=await response.json();const raw=body?.choices?.[0]?.message?.content;if(typeof raw!=="string")throw new Error("AI response missing content");
  const parsed=JSON.parse(raw);if(typeof parsed.reason!=="string"||typeof parsed.message!=="string"||!Array.isArray(parsed.questions))throw new Error("AI returned invalid format");
  const questions=parsed.questions.filter((q:unknown):q is string=>typeof q==="string").slice(0,5).map((q:string)=>clean(q,250));
  if(questions.length<3)throw new Error("AI returned too few questions");
  return {reason:clean(parsed.reason,500),message:clean(parsed.message,1200),questions,mode:"ai"};
 }finally{clearTimeout(timeout);}
}
