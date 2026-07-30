"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ABOUT — editorial redesign.
 *
 * Layout system
 *   container   1240 max, gutters clamp(24px,5vw,72px)
 *   rhythm      section padding clamp(96px,16vh,180px)
 *   grid        desktop 0.85fr / 1.15fr, gap clamp(48px,7vw,120px)
 *   measure     body copy capped at 62ch
 *
 * Type system
 *   serif  (Cormorant Garamond)  headline, manifesto, closing — emotion
 *   sans   (Hanken Grotesk)      body, labels, numerals, UI — precision
 *
 * Gold (#C6A258) is an accent of precision: labels, rules, numerals, hover.
 * Never body text, never fills.
 *
 * Cinematic anchor: drop a vertical 3:4 photo (concentration / tension /
 * hands / tunnel / locker room) at public/assets/about-anchor.jpg and set
 * ANCHOR_SRC below. Until then a composed editorial plate stands in.
 */
const ANCHOR_SRC: string | null = null;

const GOLD = "#C6A258";
const IVORY = "#F4EFE4";
const BODY = "#D6D1C5";
const MUTED = "#8E8A80";
const SANS = "'Hanken Grotesk', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', serif";

const EASE = "cubic-bezier(.16,1,.3,1)";

/** Film grain, inlined so the page stays self-contained. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E\")";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduced;
}

/** Opacity + small vertical rise on enter. 700ms, once, never reverses. */
function Reveal({
  children,
  delay = 0,
  rise = 22,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  rise?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); io.disconnect(); } },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown || reduced ? "none" : `translateY(${rise}px)`,
        transition: reduced ? "none" : `opacity 800ms ${EASE} ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const label: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.42em",
  textTransform: "uppercase",
  color: GOLD,
};

const body: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: "clamp(15.5px,1.05vw,17.5px)",
  lineHeight: 1.78,
  color: BODY,
  maxWidth: "62ch",
  margin: 0,
};

const numeral: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.3em",
  color: "rgba(198,162,88,0.55)",
};

const shell = (extra?: React.CSSProperties): React.CSSProperties => ({
  maxWidth: 1240,
  margin: "0 auto",
  padding: "0 clamp(24px,5vw,72px)",
  ...extra,
});

type AboutCopy = {
  eyebrow: string;
  headline: string;
  p1: string; p2: string; p3: string;
  neg: readonly string[];
  p4: string; p5: string;
  visionLabel: string;
  vp1: string; vp2: string;
  vBullets: readonly string[];
  vp3: string; vp4: string;
  closing: string;
};

/** Vertical cinematic plate. Sticky on desktop, inline on mobile. */
function Anchor({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: isMobile ? "none" : 400,
        aspectRatio: isMobile ? "4 / 5" : "3 / 4",
        overflow: "hidden",
        background: "#04050A",
      }}
    >
      {ANCHOR_SRC ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ANCHOR_SRC}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) contrast(1.08)" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 80% at 30% 15%, rgba(198,162,88,0.16) 0%, rgba(198,162,88,0.04) 34%, rgba(4,5,10,0) 68%), linear-gradient(200deg, #0E121C 0%, #06080F 52%, #020306 100%)",
          }}
        />
      )}
      {!ANCHOR_SRC && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/vesper-logo.png"
            alt="Vesper"
            loading="lazy"
            decoding="async"
            style={{ width: "46%", maxWidth: 170, height: "auto", opacity: 0.92, filter: "drop-shadow(0 12px 34px rgba(0,0,0,0.55))" }}
          />
        </div>
      )}
      {/* grain + vignette keep the plate cinematic rather than flat */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.16, mixBlendMode: "overlay", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,8,15,0) 45%, rgba(4,5,10,0.72) 100%)", pointerEvents: "none" }} />
      {/* offset hairline frame */}
      <div style={{ position: "absolute", inset: 14, border: "1px solid rgba(198,162,88,0.22)", pointerEvents: "none" }} />
      <span style={{ position: "absolute", left: 28, bottom: 24, ...numeral, color: "rgba(198,162,88,0.7)" }}>01</span>
    </div>
  );
}

export default function AboutSection({ t, isMobile }: { t: AboutCopy; isMobile: boolean }) {
  const twoCol: React.CSSProperties = isMobile
    ? { display: "block" }
    : { display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: "clamp(48px,7vw,120px)", alignItems: "start" };

  const stick: React.CSSProperties = isMobile
    ? {}
    : { position: "sticky", top: "clamp(96px,18vh,180px)" };

  return (
    <div style={{ background: "#06080F" }}>

      {/* ── 1 · OPENING ────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: isMobile ? "82vh" : "92vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          padding: "clamp(110px,14vh,160px) 0 clamp(72px,10vh,110px)",
        }}
      >
        <div style={shell()}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: "clamp(28px,5vh,44px)" }}>
              <span style={numeral}>01</span>
              <span style={{ width: 34, height: 1, background: "rgba(198,162,88,0.4)" }} />
              <span style={label}>{t.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontSize: "clamp(40px,6.6vw,96px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                color: IVORY,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {t.headline}
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <span style={{ display: "block", width: 64, height: 1, background: GOLD, marginTop: "clamp(38px,6vh,64px)" }} />
          </Reveal>
        </div>

        {/* scroll cue */}
        <div style={{ ...shell(), position: "absolute", left: 0, right: 0, bottom: "clamp(28px,5vh,48px)" }}>
          <Reveal delay={420}>
            <span style={{ ...numeral, fontSize: 9, letterSpacing: "0.34em", color: "rgba(198,162,88,0.42)" }}>—— SCROLL</span>
          </Reveal>
        </div>
      </section>

      {/* ── 2 · NARRATIVE · sticky plate left, copy right ───────────── */}
      <section style={{ padding: "clamp(48px,8vh,96px) 0 clamp(96px,16vh,180px)" }}>
        <div style={{ ...shell(), ...twoCol }}>
          <div style={stick}>
            <Reveal>
              <Anchor isMobile={isMobile} />
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(30px,4.5vh,44px)", marginTop: isMobile ? "clamp(40px,7vh,56px)" : 0 }}>
            {[t.p1, t.p2, t.p3].map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p style={body}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 · MANIFESTO · the climax ──────────────────────────────── */}
      <section
        style={{
          background: "#03040A",
          borderTop: "1px solid rgba(198,162,88,0.14)",
          borderBottom: "1px solid rgba(198,162,88,0.14)",
          padding: "clamp(88px,14vh,150px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.05, pointerEvents: "none" }} />
        <div style={{ ...shell(), position: "relative" }}>
          <div style={{ display: "flex", gap: isMobile ? 22 : 44 }}>
            {/* the single gold rule running the height of the manifesto */}
            <span style={{ width: 1, flexShrink: 0, background: "linear-gradient(to bottom, rgba(198,162,88,0.05), rgba(198,162,88,0.55) 22%, rgba(198,162,88,0.55) 78%, rgba(198,162,88,0.05))" }} />
            <div style={{ flex: 1 }}>
              {t.neg.map((line, i) => (
                <Reveal key={line} delay={i * 140} rise={30}>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 300,
                      fontSize: "clamp(30px,5.4vw,76px)",
                      lineHeight: 1.06,
                      letterSpacing: "-0.02em",
                      color: IVORY,
                      margin: 0,
                      padding: isMobile ? "clamp(26px,5vh,40px) 0" : "clamp(40px,7vh,72px) 0",
                      maxWidth: "18ch",
                    }}
                  >
                    {line}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 · CONSEQUENCE · sticky label left, copy right ─────────── */}
      <section style={{ padding: "clamp(96px,16vh,180px) 0" }}>
        <div style={{ ...shell(), ...twoCol }}>
          <div style={stick}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={numeral}>02</span>
                <span style={{ width: 34, height: 1, background: "rgba(198,162,88,0.4)" }} />
              </div>
            </Reveal>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(30px,4.5vh,44px)", marginTop: isMobile ? "clamp(28px,4vh,40px)" : 0 }}>
            {[t.p4, t.p5].map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p style={body}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · THE VISION ─────────────────────────────────────────── */}
      <section style={{ padding: "0 0 clamp(96px,16vh,180px)" }}>
        <div style={{ ...shell(), ...twoCol }}>
          <div style={stick}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <span style={numeral}>03</span>
                <span style={{ width: 34, height: 1, background: "rgba(198,162,88,0.4)" }} />
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(30px,3.6vw,52px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.015em",
                  color: IVORY,
                }}
              >
                {t.visionLabel}
              </div>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(30px,4.5vh,44px)", marginTop: isMobile ? "clamp(28px,4vh,40px)" : 0 }}>
            <Reveal><p style={body}>{t.vp1}</p></Reveal>
            <Reveal><p style={body}>{t.vp2}</p></Reveal>

            {/* the universes — a precision list, sans, gold indices */}
            <Reveal>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid rgba(198,162,88,0.16)", maxWidth: "62ch" }}>
                {t.vBullets.map((b, i) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: isMobile ? 16 : 26,
                      padding: "clamp(13px,1.8vh,18px) 0",
                      borderBottom: "1px solid rgba(198,162,88,0.16)",
                    }}
                  >
                    <span style={{ ...numeral, fontSize: 10, letterSpacing: "0.24em", flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: SANS,
                        fontWeight: 400,
                        fontSize: "clamp(15px,1.05vw,17px)",
                        letterSpacing: "0.01em",
                        color: IVORY,
                        lineHeight: 1.5,
                      }}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal><p style={body}>{t.vp3}</p></Reveal>
            <Reveal><p style={body}>{t.vp4}</p></Reveal>
          </div>
        </div>
      </section>

      {/* ── 6 · CLOSING ────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: isMobile ? "72vh" : "88vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "#03040A",
          borderTop: "1px solid rgba(198,162,88,0.14)",
          padding: "clamp(80px,12vh,140px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(70% 55% at 50% 50%, rgba(198,162,88,0.09) 0%, rgba(3,4,10,0) 70%)", pointerEvents: "none" }} />
        <div style={{ ...shell(), position: "relative" }}>
          <Reveal>
            <span style={{ display: "block", width: 1, height: "clamp(48px,9vh,88px)", background: "linear-gradient(to bottom, rgba(198,162,88,0), #C6A258)", margin: "0 auto clamp(34px,6vh,56px)" }} />
          </Reveal>
          <Reveal delay={160} rise={28}>
            <p
              style={{
                fontFamily: SERIF,
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(34px,6vw,84px)",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                color: IVORY,
                margin: 0,
              }}
            >
              {t.closing}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
