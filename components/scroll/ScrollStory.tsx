"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80, rotate: 2 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 45%",
              scrub: 0.7,
            },
          }
        );
      });

      gsap.to(".moon", {
        y: 220,
        x: 80,
        scale: 1.5,
        rotate: 16,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      gsap.to(".floating-line", {
        height: "70vh",
        scrollTrigger: {
          trigger: ".middle-section",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="scroll-story">
      <div className="story-bg" />
      <div className="moon" />

      <section className="story-section hero-section">
        <div className="reveal story-copy">
          <p className="eyebrow">BOOKS / FILMS / GAMES</p>
          <h1>Things that stayed with me.</h1>
          <p>
            A scroll-driven page for media and creative influences.
            Replace every card with real entries later.
          </p>
        </div>
      </section>

      <section className="story-section middle-section">
        <div className="floating-line" />

        <article className="media-card reveal media-card-left">
          <div className="poster poster-book">
            <span>BOOK</span>
          </div>
          <div>
            <p className="eyebrow">BOOK</p>
            <h2>The Secret History</h2>
            <p>
              Placeholder note about why a particular book mattered
              creatively.
            </p>
          </div>
        </article>

        <article className="media-card reveal media-card-right">
          <div className="poster poster-film">
            <span>FILM</span>
          </div>
          <div>
            <p className="eyebrow">FILM</p>
            <h2>Lost Highway</h2>
            <p>
              This section can animate in differently for each medium.
            </p>
          </div>
        </article>
      </section>

      <section className="story-section warm-section">
        <article className="media-card reveal media-card-left">
          <div className="poster poster-game">
            <span>GAME</span>
          </div>
          <div>
            <p className="eyebrow">VIDEOGAME</p>
            <h2>Life is Strange</h2>
            <p>
              The palette gradually shifts as the visitor scrolls
              deeper down the page.
            </p>
          </div>
        </article>

        <div className="quote-block reveal">
          <span>creative influence #04</span>
          <h2>
            A page does not need to feel like a grid of portfolio cards.
          </h2>
        </div>
      </section>

      <section className="story-section ending-section">
        <div className="reveal ending-copy">
          <p className="eyebrow">END OF SHELF</p>
          <h2>More things can be added without changing the layout.</h2>
          <p>
            Later this can be powered by MDX so every influence is just
            a small content file rather than a hard-coded React block.
          </p>
        </div>
      </section>
    </div>
  );
}
