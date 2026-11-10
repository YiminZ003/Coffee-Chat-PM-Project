import type { Profile } from "./types";
import { defaultDemoProfile } from "./data";
const KEY="coffee-chats-demo-profile-v1";
export const demoAllowed = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
export function readDemoProfile():Profile{
  if (typeof window==="undefined") return defaultDemoProfile;
  try { const saved=window.localStorage.getItem(KEY); if (!saved) return defaultDemoProfile; return {...defaultDemoProfile,...JSON.parse(saved),id:"demo-local-user",is_sample:false}; }
  catch { return defaultDemoProfile; }
}
export function saveDemoProfile(profile:Profile){ if (typeof window!=="undefined") window.localStorage.setItem(KEY,JSON.stringify({...profile,id:"demo-local-user",is_sample:false})); }
