"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Vesper — full-screen interactive homepage.
 * Faithful port of the original working implementation.
 * Image mapping (do not change):
 *   01 Pressure    = /assets/col-pressure.png   (kneeling athlete in tunnel)
 *   02 Access      = /assets/col-access.png     (private doorway)
 *   03 Performance = /assets/col-performance.png (racing cockpit / helmet)
 *   04 Culture     = /assets/col-culture.png    (candlelit dinner)
 */

type Col = {
  no: string;
  name: string;
  desc: string;
  bg: string;
  pos: string;
  nav: string;
};

const COLUMNS: Col[] = [
  { no: "01", name: "Pressure",    desc: "The moment before",       bg: "/assets/col-pressure.png",    pos: "50% 42%", nav: "About" },
  { no: "02", name: "Access",      desc: "Doors that stay closed",  bg: "/assets/col-access.png",      pos: "55% 45%", nav: "Application" },
  { no: "03", name: "Performance", desc: "Precision at the edge",   bg: "/assets/col-performance.png", pos: "60% 48%", nav: "Contact" },
  { no: "04", name: "Culture",     desc: "Where the night belongs", bg: "/assets/col-culture.png",     pos: "50% 55%", nav: "Members" },
];

function backdropStyle(col: Col, active: boolean, anyActive: boolean, isMobile: boolean): React.CSSProperties {
  let bright: number, sat: number, scale: number;
  if (active) { bright = 1.0; sat = 1.0; scale = 1.0; }
  else if (anyActive) { bright = 0.32; sat = 0.5; scale = isMobile ? 1.0 : 1.06; }
  else { bright = 0.4; sat = 0.55; scale = isMobile ? 1.0 : 1.04; }
  return {
    backgroundImage: `url('${col.bg}')`,
    backgroundSize: "cover",
    backgroundPosition: col.pos,
    filter: `brightness(${bright}) saturate(${sat}) contrast(1.04)`,
    transform: `scale(${scale})`,
  };
}

function veilOpacity(active: boolean, anyActive: boolean, isMobile: boolean): number {
  if (active) return isMobile ? 0.2 : 0.22;
  if (anyActive) return isMobile ? 0.9 : 0.97;
  return isMobile ? 0.86 : 0.96;
}

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(236,231,219,0.16)",
  color: "#F4EFE4",
  fontSize: 15,
  padding: "9px 0",
  outline: "none",
};
const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#9b988e",
};

export default function VesperHome() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileActive, setMobileActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = () => {
      setIsMobile(window.innerWidth < 820);
      setReady(true);
    };
    mq();
    window.addEventListener("resize", mq);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setModalOpen(false); setAboutOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", mq);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (modalOpen || aboutOpen) ? "hidden" : "";
  }, [modalOpen, aboutOpen]);

  const openModal = () => { setModalOpen(true); setSubmitted(false); };
  const closeModal = () => setModalOpen(false);

  const sel = isMobile ? mobileActive : hovered;
  const anyActive = sel !== null;

  const isDesktop = ready && !isMobile;
  const showMobile = ready && isMobile;

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#06080F", color: "#ECE7DB", overflowX: "hidden" }}>

      {/* ============ DESKTOP : full-screen interactive hero ============ */}
      {isDesktop && (
        <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
          {/* four reveal columns */}
          <div onMouseLeave={() => setHovered(null)} style={{ position: "absolute", inset: 0, display: "flex", zIndex: 1 }}>
            {COLUMNS.map((col, i) => {
              const active = sel === i;
              return (
                <div
                  key={col.no}
                  onMouseEnter={() => setHovered(i)}
                  style={{ position: "relative", flex: 1, height: "100%", overflow: "hidden", cursor: "default", ...(i === 0 ? {} : { borderLeft: "1px solid rgba(198,162,88,0.18)" }) }}
                >
                  <div style={{ position: "absolute", inset: "-3%", transition: "transform 1.15s cubic-bezier(.16,1,.3,1), filter 1.15s cubic-bezier(.16,1,.3,1)", willChange: "transform, filter", ...backdropStyle(col, active, anyActive, false) }} />
                  <div style={{ position: "absolute", inset: 0, background: "#06080F", transition: "opacity .85s ease", opacity: veilOpacity(active, anyActive, false) }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(6,8,15,0.55) 0%,transparent 26%,transparent 70%,rgba(6,8,15,0.7) 100%)", pointerEvents: "none" }} />
                  {/* top label stack */}
                  <div style={{ position: "absolute", top: "9vh", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, pointerEvents: "none" }}>
                    <span style={{ width: 24, height: 1, background: "#C6A258", transformOrigin: "center", transition: "transform .8s cubic-bezier(.16,1,.3,1)", transform: `scaleX(${active ? 1 : 0})` }} />
                    <div style={{ textAlign: "center", transition: "opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)", opacity: active ? 1 : 0, transform: `translateY(${active ? 0 : -8}px)` }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(22px,2vw,30px)", color: "#F4EFE4", lineHeight: 1 }}>{col.name}</div>
                      <div style={{ marginTop: 10, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9b988e" }}>{col.desc}</div>
                    </div>
                  </div>
                  {/* bottom nav button */}
                  <div style={{ position: "absolute", bottom: "9vh", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, pointerEvents: "auto" }}>
                    <span style={{ width: 1, height: 28, background: "rgba(198,162,88,0.7)" }} />
                    <a href="#" onClick={(e) => { e.preventDefault(); if (col.nav === "About") setAboutOpen(true); }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .6s ease" }}>{col.nav}</a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* center scrim keeps the mark legible over any reveal */}
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "min(760px,86vw)", height: "min(760px,86vw)", transform: "translate(-50%,-50%)", background: "radial-gradient(closest-side,rgba(6,8,15,0.94),rgba(6,8,15,0.55) 62%,transparent)", zIndex: 2, pointerEvents: "none" }} />

          {/* center content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, pointerEvents: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: "clamp(150px,15vw,224px)", height: "auto", display: "block", filter: "drop-shadow(0 14px 40px rgba(0,0,0,0.6))", animation: "vUp 1.3s both" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px,2.4vw,30px)", color: "#F4EFE4", margin: "30px 0 0", animation: "vUp 1.3s .12s both" }}>Pressure is a privilege.</p>
            <p style={{ fontSize: "clamp(12px,1.1vw,14px)", letterSpacing: "0.04em", color: "#9b988e", fontWeight: 300, margin: "14px 0 0", maxWidth: 380, animation: "vUp 1.3s .2s both" }}>Private access to the world&apos;s defining sporting moments.</p>
            <button onClick={openModal} className="v-cta" style={{ pointerEvents: "auto", marginTop: 38, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 38px", fontWeight: 600, cursor: "pointer", animation: "vUp 1.3s .28s both" }}>Request Access</button>
            <div style={{ marginTop: 26, fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "#56544c", animation: "vUp 1.3s .36s both" }}>By invitation or referral only</div>
          </div>

          {/* minimal footer bar */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 34px", pointerEvents: "none" }}>
            <div style={{ display: "flex", gap: 26, pointerEvents: "auto" }}>
              <a href="mailto:access@vesper.club" className="v-link" style={{ textDecoration: "none", color: "#6f6c63", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>Contact</a>
              <a href="#" className="v-link" style={{ textDecoration: "none", color: "#6f6c63", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>Instagram</a>
              <a href="#" className="v-link" style={{ textDecoration: "none", color: "#6f6c63", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>Legal</a>
            </div>
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "#56544c" }}>Madrid · 2026</span>
          </div>
        </div>
      )}

      {/* ============ MOBILE : stacked tappable cards ============ */}
      {showMobile && (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <div style={{ padding: "74px 28px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: 128, height: "auto", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.6))" }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "#F4EFE4", margin: "22px 0 0" }}>Pressure is a privilege.</p>
            <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "12px 0 0", maxWidth: 300, lineHeight: 1.6 }}>Private access to the world&apos;s defining sporting moments.</p>
            <button onClick={openModal} style={{ marginTop: 28, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "15px 36px", fontWeight: 600 }}>Request Access</button>
            <div style={{ marginTop: 20, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c" }}>By invitation or referral only</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {COLUMNS.map((col, i) => {
              const active = sel === i;
              return (
                <div
                  key={col.no}
                  onClick={() => setMobileActive(mobileActive === i ? null : i)}
                  style={{ position: "relative", flex: 1, minHeight: 118, overflow: "hidden", borderTop: "1px solid rgba(198,162,88,0.18)", cursor: "pointer" }}
                >
                  <div style={{ position: "absolute", inset: 0, transition: "filter 1s ease, transform 1s ease", ...backdropStyle(col, active, anyActive, true) }} />
                  <div style={{ position: "absolute", inset: 0, background: "#06080F", transition: "opacity .8s ease", opacity: veilOpacity(active, anyActive, true) }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px" }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#F4EFE4" }}>{col.name}</div>
                      <div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9b988e", transition: "opacity .6s", opacity: active ? 1 : 0 }}>{col.desc}</div>
                    </div>
                    <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (col.nav === "About") setAboutOpen(true); }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .5s ease", flexShrink: 0 }}>{col.nav}</a>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderTop: "1px solid rgba(236,231,219,0.06)" }}>
            <a href="mailto:access@vesper.club" style={{ textDecoration: "none", color: "#6f6c63", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>Contact · Instagram · Legal</a>
            <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#56544c" }}>Madrid · 2026</span>
          </div>
        </div>
      )}

      {/* ============ REQUEST ACCESS MODAL ============ */}
      {modalOpen && (
        <div
          onClick={(e) => { if (!(e.target as HTMLElement).closest("[data-modalcard]")) closeModal(); }}
          style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "40px 20px", background: "rgba(4,5,10,0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", animation: "vUp .4s both" }}
        >
          <div ref={cardRef} data-modalcard style={{ position: "relative", width: "100%", maxWidth: 560, margin: "auto", background: "#0B0E16", border: "1px solid rgba(198,162,88,0.28)", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", padding: "clamp(30px,5vw,52px)", animation: "vIn .55s cubic-bezier(.16,1,.3,1) both" }}>
            <button onClick={closeModal} aria-label="Close" className="v-close" style={{ position: "absolute", top: 20, right: 20, width: 34, height: 34, background: "transparent", border: "1px solid rgba(236,231,219,0.18)", color: "#bdb9af", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>×</button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "30px 6px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, color: "#C6A258", marginBottom: 18 }}>Request received.</div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#bdb9af", fontWeight: 300, margin: "0 auto", maxWidth: 360 }}>If aligned, we will be in touch.</p>
                <button onClick={closeModal} className="v-close" style={{ marginTop: 34, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>Close</button>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(28px,4vw,38px)", color: "#F4EFE4", lineHeight: 1 }}>Request Access</div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#9b988e", fontWeight: 300, margin: "14px 0 30px", maxWidth: 420 }}>Vesper is available by invitation or referral only. Submit your request and our team will review it.</p>
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>Full Name</span>
                      <input required type="text" placeholder="Full name" className="v-field" style={fieldStyle} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>Email</span>
                      <input required type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} />
                    </label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>City</span>
                      <input type="text" placeholder="City" className="v-field" style={fieldStyle} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>Role</span>
                      <select className="v-field" style={fieldStyle} defaultValue="">
                        <option value="">Select</option>
                        <option>Athlete</option><option>Founder</option><option>Brand</option><option>Investor</option><option>Creator</option><option>Guest</option><option>Other</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>Referred By</span>
                      <input type="text" placeholder="Invited / referred by" className="v-field" style={fieldStyle} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      <span style={fieldLabel}>Interested In</span>
                      <select className="v-field" style={fieldStyle} defaultValue="">
                        <option value="">Select</option>
                        <option>Madrid GP 2026</option><option>Partnership</option><option>Membership</option><option>Private Table</option><option>General Access</option>
                      </select>
                    </label>
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Short Note</span>
                    <textarea rows={3} placeholder="Tell us, briefly." className="v-field" style={{ ...fieldStyle, resize: "none" }} />
                  </label>
                  <button type="submit" className="v-submit" style={{ marginTop: 8, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>Submit Request</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ ABOUT OVERLAY ============ */}
      {aboutOpen && (
        <div
          onClick={() => setAboutOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.96)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflowY: "auto", animation: "vUp .4s both" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(60px,10vh,120px) clamp(28px,6vw,60px)" }}
          >
            {/* close */}
            <button onClick={() => setAboutOpen(false)} aria-label="Close" className="v-close" style={{ position: "fixed", top: 28, right: 32, width: 34, height: 34, background: "transparent", border: "1px solid rgba(236,231,219,0.18)", color: "#bdb9af", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>×</button>

            {/* eyebrow */}
            <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>About</div>

            {/* headline */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(36px,5vw,58px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 48px" }}>
              Vesper was born from a simple idea.
            </h1>

            {/* divider */}
            <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 48 }} />

            {/* body */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(17px,1.6vw,21px)", color: "#bdb9af", lineHeight: 1.75 }}>
              <p style={{ margin: 0 }}>Around elite athletes, a special circle naturally forms — not only because of what they have achieved in their careers, but because of what they represent: discipline, character, pressure, respect, history and legacy.</p>
              <p style={{ margin: 0 }}>Today, those circles already exist, but they often appear fragmented, without identity and without continuity. Vesper gives that world meaning and direction.</p>

              {/* negations */}
              <div style={{ borderLeft: "1px solid rgba(198,162,88,0.3)", paddingLeft: 28, display: "flex", flexDirection: "column", gap: 10, fontStyle: "italic", color: "#6f6c63", fontSize: "clamp(15px,1.4vw,18px)" }}>
                <span>It is not another party.</span>
                <span>It is not a gathering of famous people.</span>
                <span>It is not about using important names as decoration.</span>
              </div>

              <p style={{ margin: 0 }}>Vesper is a private platform built around elite sport, where athletes, their networks, brands, entrepreneurs, sponsors and cultural leaders can meet within a real, curated and thoughtful environment.</p>
              <p style={{ margin: 0 }}>The elite athlete is the magnet. Everything else is born from the circle that forms around them.</p>
              <p style={{ margin: 0 }}>Vesper does not seek celebrities. It seeks people with history, character, legitimacy and judgment.</p>
            </div>

            {/* closing line */}
            <div style={{ marginTop: 64, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,2.4vw,30px)", color: "#F4EFE4" }}>
              For those who understand pressure.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
