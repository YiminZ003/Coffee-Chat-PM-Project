import type {Metadata} from "next";
import { LoginPanel } from "@/components/login-panel";
import { Nav,Footer } from "@/components/nav";
import { Icon } from "@/components/icons";
export const metadata:Metadata={title:"Join the conversation"};
export default function Login(){return <><Nav/><main className="auth-main"><div className="container auth-grid"><div className="auth-story"><div className="auth-stamp">IT ALL BEGINS<br/>WITH HELLO ✳</div><h2>Great things happen when we <em>talk.</em></h2><p>From “what should I do next?” to “here&apos;s how I did it.” Find the right person at the right time.</p><div className="story-pills"><span><Icon name="sparkles" size={16}/> Warm introductions</span><span><Icon name="users" size={16}/> U of T community</span><span><Icon name="heart" size={16}/> Real conversations</span></div><div className="auth-decoration">✽</div></div><LoginPanel/></div></main><Footer/></>}
