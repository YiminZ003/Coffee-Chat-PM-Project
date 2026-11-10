import Link from "next/link";
import { Nav, Footer } from "@/components/nav";
import { Icon } from "@/components/icons";
import { ChairMark } from "@/components/Logo";

const steps = [
  { title: "Tell it about you.", body: "Program, class year, the industry you are curious about and what you want out of a chat. It takes about two minutes." },
  { title: "Pick someone who said yes.", body: "Everyone listed opted in to coffee chats. Filter by industry, program or class year. People in your industry come first." },
  { title: "Get a first draft.", body: "Open a profile and ask for a message. You get a short note, the reason you two might get along, and four questions to bring." },
  { title: "Send it yourself.", body: "Edit the draft and send it from your own inbox. Open Chair doesn't contact anyone or book anything for you." },
];

export default function Home() {
  return (
    <>
      <Nav active="home" />
      <main>
        <section className="home-hero">
          <div className="container">
            <div className="home-hero-meta rise">
              <span className="label credit-tag">Presented by Team 16</span>
              <span className="label label-mute">U of T students and alumni / Student prototype</span>
            </div>
            <h1 className="display-xl home-hero-title rise rise-2">Email an alum without the dread.</h1>
            <div className="grid-12 home-hero-body">
              <div className="home-hero-copy rise rise-3">
                <p className="lede">Open Chair finds U of T people who said yes to a coffee chat, then writes the first message for you.</p>
                <div className="home-hero-actions">
                  <Link className="btn btn-accent" href="/login">Find someone <Icon name="arrow" size={16} /></Link>
                  <Link className="text-link" href="#how-it-works">How it works</Link>
                </div>
              </div>
              <figure className="draft-specimen rise rise-4" aria-label="Example of a drafted message">
                <div className="draft-specimen-head">
                  <span className="label">Example draft</span>
                  <span className="label label-mute">Fictional</span>
                </div>
                <dl className="draft-specimen-meta">
                  <div><dt className="label label-mute">To</dt><dd>Nadia Okafor</dd></div>
                  <div><dt className="label label-mute">Class</dt><dd>2019, Rotman Commerce</dd></div>
                  <div><dt className="label label-mute">Field</dt><dd>Banking</dd></div>
                </dl>
                <blockquote>
                  Hi Nadia, I&apos;m a first-year MMA student looking at banking, mostly credit risk. Your move from Commerce into a credit analyst role is close to what I&apos;d like to do. Would you have 20 minutes for a coffee chat in the next few weeks? Happy to work around your schedule.
                </blockquote>
              </figure>
            </div>
          </div>
        </section>

        <section className="home-section" id="how-it-works" aria-labelledby="how-title">
          <div className="container">
            <div className="section-head">
              <span className="num">01</span>
              <h2 id="how-title" className="display-l">How it works</h2>
            </div>
            <ol className="step-list">
              {steps.map((s, i) => (
                <li key={s.title} className="step-row">
                  <span className="step-index">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="home-section home-why" aria-labelledby="why-title">
          <div className="container grid-12">
            <div className="section-head why-head">
              <span className="num">02</span>
              <h2 id="why-title" className="display-l">The hard part is the first line.</h2>
            </div>
            <div className="why-copy">
              <p>Everyone listed here already agreed to talk. What usually stops students is the blank email, which starts to feel like a test.</p>
              <p>Open Chair takes care of the blank part. It reads both profiles, points out what you have in common and drafts a note you can fix up in a minute.</p>
              <p className="why-note label">All profiles in the demo are fictional samples.</p>
            </div>
            <div className="why-mark" aria-hidden="true">
              <ChairMark size={240} />
            </div>
          </div>
        </section>

        <section className="home-cta" aria-labelledby="cta-title">
          <div className="container home-cta-inner">
            <div>
              <span className="num">03</span>
              <h2 id="cta-title" className="display-l">Somebody already said yes.</h2>
            </div>
            <Link href="/login" className="btn btn-ink">Pull up a chair <Icon name="arrow" size={16} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
