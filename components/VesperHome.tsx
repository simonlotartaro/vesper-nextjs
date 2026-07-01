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
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [robotChecked, setRobotChecked] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [membersStep, setMembersStep] = useState<"login" | "create" | "done">("login");
  const [membersEmail, setMembersEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = () => {
      setIsMobile(window.innerWidth < 820);
      setReady(true);
    };
    mq();
    window.addEventListener("resize", mq);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setModalOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", mq);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (modalOpen || aboutOpen || contactOpen || membersOpen || menuOpen) ? "hidden" : "";
  }, [modalOpen, aboutOpen, contactOpen, membersOpen, menuOpen]);

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
                    <span style={{ width: 28, height: 1, background: "rgba(198,162,88,0.7)" }} />
                    <a href="#" onClick={(e) => { e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } if (col.nav === "Members") { setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .6s ease" }}>{col.nav}</a>
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
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(20px,2.4vw,30px)", color: "#F4EFE4", margin: "30px 0 0", animation: "vUp 1.3s .12s both" }}>For those who understand pressure.</p>
          </div>

          {/* minimal footer bar */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "20px 34px", pointerEvents: "none" }}>
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
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "#F4EFE4", margin: "22px 0 0" }}>For those who understand pressure.</p>
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
                    <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (col.nav === "About") setAboutOpen(true); if (col.nav === "Contact") { setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } if (col.nav === "Members") { setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: active ? "#C6A258" : "rgba(198,162,88,0.85)", textDecoration: "none", transition: "color .5s ease", flexShrink: 0 }}>{col.nav}</a>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "22px 28px", borderTop: "1px solid rgba(236,231,219,0.06)" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#56544c" }}>Madrid · 2026</span>
          </div>
        </div>
      )}

      {/* ============ HAMBURGER BUTTON ============ */}
      {ready && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ position: "fixed", top: 36, right: 28, zIndex: 300, width: 46, height: 46, background: "transparent", border: "1px solid rgba(198,162,88,0.55)", borderRadius: "50%", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 0, transition: "border-color .3s ease" }}
        >
          <span style={{ display: "block", height: 1, background: "#C6A258", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: 18, transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none", transformOrigin: "center" }} />
          <span style={{ display: "block", height: 1, background: "#C6A258", transition: "all .4s cubic-bezier(.16,1,.3,1)", width: menuOpen ? 18 : 13, transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none", transformOrigin: "center" }} />
          {!menuOpen && <span style={{ display: "block", height: 1, background: "#C6A258", width: 8 }} />}
        </button>
      )}

      {/* ============ MENU OVERLAY ============ */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          {/* left scrim — 2/3 — click to close */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{ flex: "0 0 66.666%", background: "rgba(4,5,10,0.72)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", animation: "vFadeIn .4s both" }}
          />
          {/* right panel — 1/3 */}
          <div style={{ flex: "0 0 33.333%", background: "#0A0C13", borderLeft: "1px solid rgba(198,162,88,0.15)", display: "flex", flexDirection: "column", height: "100%", padding: "clamp(60px,10vh,100px) clamp(28px,4vw,56px) 48px", animation: "menuSlideIn .45s cubic-bezier(.16,1,.3,1) both", overflowY: "auto" }}>

            {/* nav links */}
            <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(18px,3vh,32px)" }}>
              {[
                { label: "Home",        action: () => { setMenuOpen(false); setAboutOpen(false); setContactOpen(false); setMembersOpen(false); setModalOpen(false); setHovered(null); setMobileActive(null); window.scrollTo({ top: 0, behavior: "smooth" }); } },
                { label: "About",       action: () => { setMenuOpen(false); setAboutOpen(true); } },
                { label: "Application", action: () => { setMenuOpen(false); setModalOpen(true); setSubmitted(false); } },
                { label: "Contact",     action: () => { setMenuOpen(false); setContactSubmitted(false); setRobotChecked(false); setContactOpen(true); } },
                { label: "Members",     action: () => { setMenuOpen(false); setMembersStep("login"); setMembersEmail(""); setMembersOpen(true); } },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); item.action(); }}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(30px,3.2vw,52px)", color: "#F4EFE4", textDecoration: "none", lineHeight: 1, letterSpacing: "-0.01em", transition: "color .3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A258")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#F4EFE4")}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* footer contact strip */}
            <div style={{ borderTop: "1px solid rgba(198,162,88,0.18)", paddingTop: 28, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c", marginBottom: 7 }}>Contact</div>
                <a href="mailto:info@vesper.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesper.com</a>
              </div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "#56544c", marginBottom: 7 }}>Instagram</div>
                <a href="https://instagram.com/vesper" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(13px,1.1vw,16px)", color: "#9b988e", textDecoration: "none", letterSpacing: "0.04em", transition: "color .3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#C6A258")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9b988e")}>@Vesper</a>
              </div>
              <span style={{ fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "#2e2d28", marginTop: 4 }}>Madrid · 2026</span>
            </div>
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
            {/* eyebrow */}
            <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>About</div>

            {/* headline */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(36px,5vw,58px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 48px" }}>
              Vesper stems from a simple,<br />yet powerful reality.
            </h1>

            {/* divider */}
            <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 48 }} />

            {/* body */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(17px,1.6vw,21px)", color: "#bdb9af", lineHeight: 1.75 }}>
              <p style={{ margin: 0 }}>A very special, unique ecosystem naturally forms around elite athletes — not only because of their career achievements, but also because of what they represent: discipline, character, resilience under pressure, respect, history, and legacy.</p>
              <p style={{ margin: 0 }}>The circles that currently form lack continuity and purpose; they only seek to secure the isolated booking of an elite athlete to attract brands, sponsors, etc. For the most part, these events appear in a disorganized manner, without identity, continuity, or depth, driven solely by money.</p>
              <p style={{ margin: 0 }}>What we want to do with Vesper is organize a meaningful circle — one that maintains continuity and logic, and that naturally develops its own personality and depth. Undoubtedly, this circle will be one of the most powerful in the world, leading to countless opportunities.</p>

              {/* negations */}
              <div style={{ borderLeft: "1px solid rgba(198,162,88,0.3)", paddingLeft: 28, display: "flex", flexDirection: "column", gap: 10, fontStyle: "italic", color: "#6f6c63", fontSize: "clamp(15px,1.4vw,18px)" }}>
                <span>We don&apos;t want to create just another party.</span>
                <span>We don&apos;t want to hold a gathering of celebrities.</span>
                <span>We don&apos;t want to use big names as decoration.</span>
              </div>

              <p style={{ margin: 0 }}>We want to build a private platform around elite sports, where athletes have a real place, feel comfortable, speak the same language — a space with a sense of belonging, where they can share it with their own network and meet peers from diverse disciplines. This will organically generate the ecosystem we envision.</p>
              <p style={{ margin: 0 }}>For us, the elite athletes are the magnet, the energy source. Everything else — brands, entrepreneurs, sponsors, hospitality, membership, and various opportunities — is a consequence of the circle that forms around them.</p>

              {/* vision section */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 24 }}>The Vision</div>
                <p style={{ margin: "0 0 24px" }}>Vesper is designed to launch in different disciplines around the world — tennis, polo, soccer, golf, Formula 1, regattas, rugby, and beyond. In all cases, we seek official recognition of the discipline, endorsed by the organizers and corresponding entities. We will be there on the right day, at the right place, and at the right time.</p>
                <p style={{ margin: "0 0 24px" }}>We know that every sport, every country, and every city has its own nuances, its own universe. That&apos;s why every Vesper event is developed independently.</p>

                <div style={{ borderLeft: "1px solid rgba(198,162,88,0.3)", paddingLeft: 28, display: "flex", flexDirection: "column", gap: 8, fontStyle: "italic", color: "#6f6c63", fontSize: "clamp(14px,1.3vw,17px)", margin: "4px 0 24px" }}>
                  <span>Polo has its universe.</span>
                  <span>Tennis has its universe.</span>
                  <span>Football has its universe.</span>
                  <span>Golf has its universe.</span>
                  <span>Formula 1 has its universe.</span>
                </div>

                <p style={{ margin: "0 0 24px" }}>Vesper doesn&apos;t seek to impose the same format everywhere. It seeks to understand each sport, respect its codes, and build each vertical from within — hand in hand with real-world figures from that world.</p>
                <p style={{ margin: 0 }}>We&apos;re not looking for celebrities. We&apos;re looking for people with history, character, legitimacy, and criteria. We want to transcend the known. Vesper is convinced that elite athletes possess this power — because they have already proven it. If we channel all this energy in a certain direction, unimaginable things will be achieved.</p>
              </div>
            </div>

            {/* closing line */}
            <div style={{ marginTop: 64, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(22px,2.4vw,30px)", color: "#F4EFE4" }}>
              Welcome to Vesper.
            </div>
          </div>
        </div>
      )}

      {/* ============ CONTACT OVERLAY ============ */}
      {contactOpen && (
        <div
          onClick={() => setContactOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflowY: "auto", animation: "vUp .4s both" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(60px,10vh,100px) clamp(28px,6vw,60px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "start" }}>

            {/* LEFT — info */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 32 }}>Contact</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px,4vw,52px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 32px" }}>Get in touch.</h1>
              <span style={{ display: "block", width: 40, height: 1, background: "#C6A258", marginBottom: 36 }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(16px,1.4vw,19px)", color: "#9b988e", lineHeight: 1.75, margin: "0 0 40px" }}>
                For general inquiries, membership questions or partnership opportunities, reach out directly or use the form.
              </p>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#56544c", marginBottom: 10 }}>Email</div>
              <a href="mailto:info@vesper.com" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(16px,1.4vw,20px)", color: "#C6A258", textDecoration: "none", letterSpacing: "0.04em" }}>info@vesper.com</a>
            </div>

            {/* RIGHT — form */}
            <div>
              {contactSubmitted ? (
                <div style={{ paddingTop: 60, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#C6A258", marginBottom: 18 }}>Message received.</div>
                  <p style={{ fontSize: 15, color: "#bdb9af", fontWeight: 300, lineHeight: 1.7 }}>We will be in touch.</p>
                  <button onClick={() => setContactOpen(false)} className="v-close" style={{ marginTop: 32, background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>Close</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (!robotChecked) return; setContactSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 8 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Full Name</span>
                    <input required type="text" placeholder="Full name" className="v-field" style={fieldStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Email</span>
                    <input required type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Telephone</span>
                    <input type="tel" placeholder="+1 000 000 0000" className="v-field" style={fieldStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Message</span>
                    <textarea required rows={4} placeholder="Your message." className="v-field" style={{ ...fieldStyle, resize: "none" }} />
                  </label>

                  {/* I'm not a robot */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(236,231,219,0.12)", padding: "14px 18px", background: "rgba(255,255,255,0.02)" }}>
                    <div
                      onClick={() => setRobotChecked(!robotChecked)}
                      style={{ width: 22, height: 22, border: `2px solid ${robotChecked ? "#C6A258" : "rgba(236,231,219,0.3)"}`, background: robotChecked ? "rgba(198,162,88,0.15)" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s ease" }}
                    >
                      {robotChecked && <span style={{ color: "#C6A258", fontSize: 13, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: "#9b988e", letterSpacing: "0.04em" }}>I&apos;m not a robot</span>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "#3a3830", textTransform: "uppercase", lineHeight: 1.4 }}>reCAPTCHA<br/>Privacy · Terms</div>
                    </div>
                  </div>

                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: robotChecked ? "#C6A258" : "rgba(198,162,88,0.3)", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: robotChecked ? "pointer" : "not-allowed", transition: "background .3s ease" }}>
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ MEMBERS OVERLAY ============ */}
      {membersOpen && (
        <div
          onClick={() => setMembersOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(4,5,10,0.97)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", animation: "vUp .4s both" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 420, background: "#0B0E16", border: "1px solid rgba(198,162,88,0.22)", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", padding: "clamp(36px,5vw,52px)", animation: "vIn .55s cubic-bezier(.16,1,.3,1) both" }}>

            {/* eyebrow */}
            <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "#C6A258", marginBottom: 24 }}>Members</div>

            {membersStep === "login" && (
              <>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(28px,3vw,38px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 8px" }}>Member access.</h2>
                <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "0 0 36px", lineHeight: 1.6 }}>Enter your email to continue.</p>
                <form onSubmit={(e) => { e.preventDefault(); setMembersStep("create"); }} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Email</span>
                    <input required type="email" placeholder="you@email.com" className="v-field" style={fieldStyle} value={membersEmail} onChange={(e) => setMembersEmail(e.target.value)} />
                  </label>
                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>Continue</button>
                </form>
              </>
            )}

            {membersStep === "create" && (
              <>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(26px,3vw,36px)", color: "#F4EFE4", lineHeight: 1.1, margin: "0 0 8px" }}>Create your password.</h2>
                <p style={{ fontSize: 13, color: "#9b988e", fontWeight: 300, margin: "0 0 36px", lineHeight: 1.6 }}>Welcome, {membersEmail}.<br />Set a password to access your account.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const pw = (form.elements.namedItem("pw") as HTMLInputElement).value;
                    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;
                    if (pw !== confirm) { alert("Passwords do not match."); return; }
                    setMembersStep("done");
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 22 }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>New Password</span>
                    <input required name="pw" type="password" placeholder="••••••••" className="v-field" style={fieldStyle} minLength={8} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabel}>Confirm Password</span>
                    <input required name="confirm" type="password" placeholder="••••••••" className="v-field" style={fieldStyle} minLength={8} />
                  </label>
                  <button type="submit" className="v-submit" style={{ marginTop: 4, color: "#06080F", background: "#C6A258", border: "none", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", padding: "16px 30px", fontWeight: 600, cursor: "pointer" }}>Set Password</button>
                </form>
              </>
            )}

            {membersStep === "done" && (
              <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "#C6A258", marginBottom: 16 }}>Welcome.</div>
                <p style={{ fontSize: 14, color: "#bdb9af", fontWeight: 300, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 300 }}>Your password has been set. Your access to Vesper is now active.</p>
                <button onClick={() => setMembersOpen(false)} className="v-close" style={{ background: "transparent", border: "1px solid rgba(236,231,219,0.2)", color: "#ECE7DB", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", padding: "13px 30px", cursor: "pointer" }}>Enter</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
