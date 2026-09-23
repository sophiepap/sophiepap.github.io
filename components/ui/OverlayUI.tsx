"use client";

import Link from "next/link";

type Props = {
  activeTarget: string | null;
  onClose: () => void;
};

export default function OverlayUI({
  activeTarget,
  onClose,
}: Props) {
  return (
    <>
      <div className="top-ui">
        <div>
          <strong>SOPHIA / ROOM</strong>
          <span>interactive portfolio demo</span>
        </div>

        <nav>
          <button onClick={() => window.location.reload()}>Room</button>
          <a href="#development">Development</a>
          <a href="#game-dev">Game Dev / AR</a>
          <Link href="/library">Library</Link>
          <a href="#about">About</a>
          <a href="#cv">CV</a>
        </nav>
      </div>

      <div className="hint">
        hover objects • click to inspect
      </div>

      {activeTarget === "computer" && (
        <div className="screen-overlay">
          <button className="close-button" onClick={onClose}>
            ×
          </button>

          <div className="fake-os-bar">
            <span>creative.dev</span>
            <span>● ● ●</span>
          </div>

          <div className="fake-os-content">
            <p className="eyebrow">DEVELOPMENT</p>
            <h1>Things I build.</h1>
            <p>
              This is normal HTML layered over the 3D monitor.
              Later, the transition can be made nearly seamless.
            </p>

            <div className="project-grid" id="development">
              <article>
                <span>01</span>
                <h3>Discord Bots</h3>
                <p>Python, Discord APIs, automation.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Web Experiments</h3>
                <p>Interactive pages, creative front-end work.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Tooling</h3>
                <p>Small utilities, scripts and odd little projects.</p>
              </article>
            </div>
          </div>
        </div>
      )}

      {activeTarget === "board" && (
        <div className="side-panel" id="game-dev">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <p className="eyebrow">GAME DEV / AR</p>
          <h2>Planning board</h2>
          <p>
            Here you can later show Unity projects, AR work, design
            notes, screenshots, prototypes and small dev logs.
          </p>
          <div className="mini-card">AR Prototype / Museum Piece</div>
          <div className="mini-card">Unity Experiment / Environment</div>
        </div>
      )}

      {activeTarget === "cv" && (
        <div className="paper-overlay" id="cv">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <p className="eyebrow">CURRICULUM VITAE</p>
          <h2>Your Name</h2>
          <p>Creative developer · AR · Game Dev · Web</p>
          <hr />
          <p>
            This is a placeholder document overlay. Replace it later
            with your real CV or a PDF link.
          </p>
        </div>
      )}
    </>
  );
}
