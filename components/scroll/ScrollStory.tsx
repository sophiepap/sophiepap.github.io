"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* --------------------------------------------------
         INITIAL STATES
      -------------------------------------------------- */

      gsap.set(".fissure-mark", {
        scale: 0.9,
        opacity: 0,
      });

      gsap.set(".fissure-glow", {
        scale: 0.8,
        opacity: 0,
      });

      gsap.set(".falling-figure", {
        y: -40,
        opacity: 0,
      });

      gsap.set(".stars-overlay", {
        opacity: 0,
      });

      gsap.set(".moon", {
        opacity: 0,
      });

      /* --------------------------------------------------
         REVEAL ELEMENTS
      -------------------------------------------------- */

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 80,
            rotate: 2,
          },
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

      /* --------------------------------------------------
         FLOATING LINE
      -------------------------------------------------- */

      gsap.to(".floating-line", {
        height: "70vh",
        scrollTrigger: {
          trigger: ".middle-section",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      /* --------------------------------------------------
         MAIN BACKGROUND / FALL SEQUENCE
      -------------------------------------------------- */

      const backgroundTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      /* --------------------------------------------------
         1. Μένουμε λίγο στο σκοτάδι
      -------------------------------------------------- */

      backgroundTimeline.to({}, {
        duration: 0.35,
      });

      /* --------------------------------------------------
         2. Εμφανίζεται το Ρήγμα / άστρο
      -------------------------------------------------- */

      backgroundTimeline.to(".fissure-mark", {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "none",
      });

      /* --------------------------------------------------
         3. Το Ρήγμα αρχίζει να βγάζει φως
      -------------------------------------------------- */

      backgroundTimeline.to(
        ".fissure-glow",
        {
          opacity: 1,
          scale: 1.15,
          duration: 0.5,
          ease: "none",
        },
        "<"
      );

      backgroundTimeline.to(".fissure-glow", {
        opacity: 1,
        scale: 2.1,
        duration: 0.8,
        ease: "none",
      });

      backgroundTimeline.to(
        ".story-bg",
        {
          "--bg1": "#07080d",
          "--bg2": "#0b0d14",
          "--bg3": "#171b27",
          duration: 0.8,
          ease: "none",
        },
        "<"
      );

      /* --------------------------------------------------
         4. Εμφανίζεται η φιγούρα
      -------------------------------------------------- */

      backgroundTimeline.to(".falling-figure", {
        opacity: 0.9,
        y: 0,
        duration: 0.35,
        ease: "none",
      });

      /* --------------------------------------------------
         5. Η φιγούρα ξεκινάει να πέφτει
      -------------------------------------------------- */

      backgroundTimeline.to(".falling-figure", {
        y: 220,
        duration: 1.1,
        ease: "none",
      });

      /* --------------------------------------------------
         6. Μαύρο → μπλε
      -------------------------------------------------- */

      backgroundTimeline.to(".story-bg", {
        "--bg1": "#11182a",
        "--bg2": "#1e2d55",
        "--bg3": "#334170",
        duration: 1.2,
        ease: "none",
      });

      /* --------------------------------------------------
         7. Fade-in τα αστέρια
      -------------------------------------------------- */

      backgroundTimeline.to(
        ".stars-overlay",
        {
          opacity: 0.85,
          duration: 0.9,
          ease: "none",
        },
        "<"
      );

      /* --------------------------------------------------
         8. Η φιγούρα συνεχίζει να πέφτει
      -------------------------------------------------- */

      backgroundTimeline.to(
        ".falling-figure",
        {
          y: 520,
          duration: 1.5,
          ease: "none",
        },
        "<"
      );

      /* --------------------------------------------------
         9. Το Ρήγμα σβήνει
      -------------------------------------------------- */

      backgroundTimeline.to(
        ".fissure-mark",
        {
          opacity: 0,
          duration: 0.8,
          ease: "none",
        },
        "<0.4"
      );

      backgroundTimeline.to(
        ".fissure-glow",
        {
          opacity: 0,
          scale: 2.6,
          duration: 0.8,
          ease: "none",
        },
        "<"
      );

      /* --------------------------------------------------
         10. Μένουμε λίγο στον μπλε έναστρο ουρανό
      -------------------------------------------------- */

      backgroundTimeline.to({}, {
        duration: 1.2,
      });

      /* --------------------------------------------------
         11. Η φιγούρα συνεχίζει χαμηλότερα και σβήνει
      -------------------------------------------------- */

      backgroundTimeline.to(".falling-figure", {
        y: 820,
        opacity: 0,
        duration: 1.2,
        ease: "none",
      });

      /* --------------------------------------------------
         12. Μπλε → καφέ
      -------------------------------------------------- */

      backgroundTimeline.to(".story-bg", {
        "--bg1": "#341606",
        "--bg2": "#632600",
        "--bg3": "#7d3a12",
        duration: 2,
        ease: "none",
      });

      /* --------------------------------------------------
         13. Τα αστέρια σβήνουν
      -------------------------------------------------- */

      backgroundTimeline.to(
        ".stars-overlay",
        {
          opacity: 0,
          duration: 1.2,
          ease: "none",
        },
        "<"
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="scroll-story">
      <div className="story-bg" />

      <img
        src="/the-warden-series-assets/star-fissure.png"
        alt=""
        className="fissure-mark"
      />

      <div className="fissure-glow" />

      <img
        src="/the-warden-series-assets/falling-figure.png"
        alt=""
        className="falling-figure"
      />

      <img
        src="/the-warden-series-assets/stars.jpg"
        alt=""
        className="stars-overlay"
      />

      <section className="story-section hero-section">
        <div className="reveal story-copy">
          <p className="eyebrow"></p>

          <h1>

          </h1>
        </div>
      </section>

      <section className="story-section middle-section">
        <div className="floating-line" />

        <div className="fall-text reveal fall-text-left">
          <p>«Και έπεφτε.»</p>
        </div>

        <div className="fall-text reveal fall-text-right">
          <p>
            «Και έπεφτε, μέχρι που την κατέπνιξε η πύλη. Το φως από το
            σπήλαιο χανόταν και εκείνη πανικόβλητη σκεφτόταν χάος και το
            τίποτα την ίδια στιγμή.»
          </p>
        </div>

        <div className="fall-text reveal fall-text-left">
          <p>
            «Και καθώς έπεφτε συνειδητοποιούσε ότι εν μέρει το σχέδιο του
            Έλιας είχε μερικώς πετύχει, καθώς τα απομεινάρια από τις φλόγες
            φούντωναν από το οξυγόνο.»
          </p>
        </div>

        <div className="fall-text reveal fall-text-right">
          <p>
            «Έπεφτε μέσα στο σκοτάδι μέχρι αυτό πήρε μορφή και από εκεί
            είδε αστέρια.»
          </p>
        </div>

        <div className="fall-text reveal fall-text-center">
          <p>«Πέρασε ανάμεσά τους.»</p>
        </div>
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
            «Δεν είμαι από εδώ…» Η φωνή της Ελίζαμπεθ Χάντερκι,
            χρωματισμένη από δισταγμό, ξεκίνησε να μιλά.
          </h2>
        </div>
      </section>

      <section className="story-section ending-section">
        <div className="book-ending reveal">
          <div className="book-cover-wrap">
            <img
              src="/the-warden-series-assets/dream-warden.png"
              alt="Ο Δεσμώτης της Κατάρας"
              className="book-cover"
            />
          </div>

          <div className="book-info">
            <p className="eyebrow">ΔΕΣΜΩΤΕΣ</p>

            <h2>Ο Δεσμώτης του Ονείρου</h2>

            <p className="book-subtitle">
              Urban Dark Fantasy • Adventure
            </p>

            <p className="book-description">
              Βρισκόμαστε στην έρημο της Αριζόνας στην Αμερική τον Δεκέμβρη του 2005,

Τρία αδέρφια κυνηγών βρίσκουν μία μάγισσα, η οποία έχει έρθει από μία εναλλακτική εκδοχή του κόσμου τους. Η ιστορία ακολουθεί δύο διαφορετικά timelines. Στο πρώτο βλέπουμε πώς η μάγισσα (Ελίζαμπεθ) κατέληξε στον κόσμο τους. Στο δεύτερο βρισκόμαστε στο παρόν, όπου οι κυνηγοί (Σεμπάστιαν, Χοακίν και Κέιτ) τη βοηθούν να επιστρέψει πίσω, ενώ εκείνη τους βοηθά να σταματήσουν την επερχόμενη Αποκάλυψη.

            </p>

            <div className="book-meta">
              <span>Βιβλίο 1</span>
              <span>Fantasy</span>
              <span>Δεσμώτες</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}