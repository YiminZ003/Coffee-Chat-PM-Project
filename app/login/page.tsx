import type { Metadata } from "next";
import { LoginPanel } from "@/components/login-panel";
import { Nav, Footer } from "@/components/nav";

export const metadata: Metadata = { title: "Sign in" };

export default function Login() {
  return (
    <>
      <Nav />
      <main className="container auth grid-12">
        <div className="auth-copy rise">
          <span className="label label-mute page-kicker"><span className="num">00</span> Sign in</span>
          <h1 className="display-l">Pull up a chair.</h1>
          <p className="lede">Sign in with your U of T email. We send you a link, so there is no password to forget.</p>
          <dl className="auth-facts">
            <div><dt className="label label-mute">Who</dt><dd>Only utoronto.ca addresses can sign in.</dd></div>
            <div><dt className="label label-mute">Visible to</dt><dd>Other signed-in U of T members, and only if you turn chats on.</dd></div>
            <div><dt className="label label-mute">Sends</dt><dd>Nothing. You send your own messages.</dd></div>
          </dl>
        </div>
        <div className="auth-panel rise rise-2">
          <LoginPanel />
        </div>
      </main>
      <Footer />
    </>
  );
}
