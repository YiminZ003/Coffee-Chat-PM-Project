import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="container not-found">
        <span className="label label-mute page-kicker"><span className="num">404</span> Not found</span>
        <h1 className="display-l">Nothing at this address.</h1>
        <p className="lede">The page moved, or the profile isn&apos;t open to chats anymore.</p>
        <Link href="/" className="btn btn-ink">Back home <Icon name="arrow" size={16} /></Link>
      </main>
      <Footer />
    </>
  );
}
