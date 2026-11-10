import type { Profile } from "@/lib/types";
export function Avatar({profile,size="md",decorated=false}:{profile:Pick<Profile,"name"|"avatar_tone">;size?:"sm"|"md"|"lg"|"xl";decorated?:boolean}){
 const letters=profile.name.split(/\s+/).slice(0,2).map(p=>p[0]||"").join("").toUpperCase();
 return <div aria-label={`Avatar for ${profile.name}`} className={`avatar avatar-${size} tone-${profile.avatar_tone||"peach"} ${decorated?"avatar-decorated":""}`}><span>{letters}</span></div>;
}
