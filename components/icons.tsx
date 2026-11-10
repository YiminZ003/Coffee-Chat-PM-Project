import type { SVGProps } from "react";
type IconName="arrow"|"arrow-up-right"|"search"|"sliders"|"graduation"|"users"|"calendar"|"check"|"menu"|"x"|"linkedin"|"mail"|"briefcase"|"chevron"|"arrow-left"|"bookmark"|"send"|"shield"|"plus"|"compass"|"message"|"clock"|"edit"|"logout"|"filter"|"refresh"|"copy";
const paths:Record<IconName,React.ReactNode>={
 arrow:<><path d="M4 12h16m-7-7 7 7-7 7"/></>,
 "arrow-up-right":<><path d="M6 18 18 6M7 6h11v11"/></>,
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 sliders:<><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/></>,
 graduation:<><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v6c3 3 9 3 12 0v-6M22 9v7"/></>,
 users:<><circle cx="9" cy="8" r="3"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 6a3 3 0 0 1 0 6m1 4c2.2.2 3.5 1.8 3.5 4"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></>,
 check:<><path d="m4 12 5 5L20 6"/></>,
 menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
 x:<><path d="M5 5l14 14M19 5 5 19"/></>,
 linkedin:<><path d="M5 9v11M5 5v.1M10 20v-7a4 4 0 0 1 8 0v7M10 9v11"/></>,
 mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
 briefcase:<><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></>,
 chevron:<><path d="m6 9 6 6 6-6"/></>,
 "arrow-left":<><path d="M20 12H4m7-7-7 7 7 7"/></>,
 bookmark:<><path d="M5 4h14v17l-7-4-7 4V4Z"/></>,
 send:<><path d="m22 2-7 20-4-9-9-4 20-7Zm-11 11L22 2"/></>,
 shield:<><path d="m12 2 9 4v6c0 6-4 9-9 11-5-2-9-5-9-11V6l9-4Z"/><path d="m8 12 3 3 5-6"/></>,
 plus:<><path d="M12 4v16M4 12h16"/></>,
 compass:<><circle cx="12" cy="12" r="10"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
 message:<><path d="M20 11a8 8 0 0 1-8 8c-1.4 0-2.6-.3-3.7-.8L4 20l1.8-4.3A8 8 0 1 1 20 11Z"/></>,
 clock:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
 edit:<><path d="m4 17-.5 4 4-.5L19 9l-3-3L4 17Zm9-10 3 3"/></>,
 logout:<><path d="M10 4H4v16h6M13 7l5 5-5 5M18 12H8"/></>,
 filter:<><path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z"/></>,
 refresh:<><path d="M20 7v5h-5M4 17v-5h5M5.6 9A7 7 0 0 1 18 7l2 5M4 12l2 5a7 7 0 0 0 12-2"/></>,
 copy:<><rect x="8" y="8" width="13" height="13"/><path d="M16 8V3H3v13h5"/></>
};
export function Icon({name,size=20,...props}:{name:IconName;size?:number}&SVGProps<SVGSVGElement>){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;}
