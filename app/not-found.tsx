import Link from "next/link";
import {Nav,Footer} from "@/components/nav";
import {Icon} from "@/components/icons";
export default function NotFound(){return <><Nav/><main className="not-found container"><div className="eyebrow">A LITTLE DETOUR</div><h1>That page has <em>stepped out for coffee.</em></h1><p>It might be unavailable or no longer open to the community.</p><Link href="/" className="btn btn-primary">Back home <Icon name="arrow" size={18}/></Link></main><Footer/></>}
