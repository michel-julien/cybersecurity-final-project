import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, PackageCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose your sweet",
    description:
      "Build a Pepero box for a friend, a team, or your favourite person.",
  },
  {
    number: "02",
    title: "Add a little love",
    description:
      "Write a note and pick a delivery day anywhere in South Korea.",
  },
  {
    number: "03",
    title: "Follow the smile",
    description:
      "Keep an eye on your order from our kitchen to their doorstep.",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="page-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Made for Pepero Day · Korea
            </p>
            <h1>
              Send a little <span>sweetness</span> across Korea.
            </h1>
            <p className="hero-description">
              Thoughtful Pepero gifts, delivered with a note and a smile. Make
              someone&apos;s day feel a little more special.
            </p>
            <div className="hero-actions">
              <Link
                className={buttonVariants({ className: "button button-primary" })}
                href="/login"
              >
                Start with an account <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link
                className={buttonVariants({
                  className: "button button-quiet",
                  variant: "ghost",
                })}
                href="#how-it-works"
              >
                See how it works
              </Link>
            </div>
            <div className="hero-proof" aria-label="PeperoLife highlights">
              <div className="avatar-stack" aria-hidden="true">
                <span>J</span>
                <span>M</span>
                <span>S</span>
              </div>
              <p>
                <strong>10,000+</strong> happy deliveries
                <span>Made with care in Seoul</span>
              </p>
            </div>
          </div>

          <div
            className="hero-art"
            role="img"
            aria-label="A PeperoLife delivery travelling from Seoul to Busan"
          >
            <div className="hero-blob hero-blob-back" aria-hidden="true" />
            <div className="hero-blob hero-blob-front" aria-hidden="true" />
            <div className="delivery-card">
              <div className="delivery-card-header">
                <div>
                  <span className="card-kicker">Today&apos;s sweet delivery</span>
                  <strong>Seoul → Busan</strong>
                </div>
                <span className="live-pill">
                  <span aria-hidden="true" /> Live
                </span>
              </div>
              <div className="delivery-scene" aria-hidden="true">
                <span className="scene-sun" />
                <span className="scene-cloud scene-cloud-one" />
                <span className="scene-cloud scene-cloud-two" />
                <span className="scene-hill scene-hill-back" />
                <span className="scene-hill scene-hill-front" />
                <span className="scene-route scene-route-one" />
                <span className="scene-route scene-route-two" />
                <span className="scene-pin scene-pin-start">S</span>
                <span className="scene-pin scene-pin-end">B</span>
                <div className="pepero-box">
                  <span className="pepero-box-top">PEPERO</span>
                  <strong>life</strong>
                  <span className="pepero-box-heart">♥</span>
                  <span className="box-stick box-stick-one" />
                  <span className="box-stick box-stick-two" />
                  <span className="box-stick box-stick-three" />
                </div>
              </div>
              <div className="delivery-card-footer">
                <div>
                  <span>Estimated arrival</span>
                  <strong>Today, 14:30</strong>
                </div>
                <span className="delivery-status">On the way</span>
              </div>
            </div>
            <span className="floating-note floating-note-top">made with ♥</span>
            <span className="floating-note floating-note-bottom">a sweet hello</span>
          </div>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">The PeperoLife way</p>
            <h2>Small box. Big feeling.</h2>
            <p>
              Sending something sweet should be simple, personal, and a little
              bit fun.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-section" id="order-status">
        <div className="page-container feature-grid">
          <div>
            <p className="eyebrow">
              <PackageCheck aria-hidden="true" /> Never miss the moment
            </p>
            <h2>From Seoul station to their doorstep.</h2>
          </div>
          <div className="feature-copy">
            <p>
              Your next order will have its own simple tracking timeline, so
              you always know when your surprise is getting close.
            </p>
            <Link className="text-link" href="/login">
              Log in to view your orders <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
