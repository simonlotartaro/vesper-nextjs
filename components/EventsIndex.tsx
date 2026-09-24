"use client";

import React from "react";
import { type Lang, type VesperChapter, localized, pastChapters, upcomingChapters } from "@/lib/chapters";

/**
 * The Events index: what is coming, and what already happened.
 *
 * Events used to open straight into Madrid. It now opens here, and Madrid
 * lives one level down as an archive.
 */

const GOLD = "#C6A258";
const IVORY = "#F4EFE4";
const BODY = "#d6d2c8";
const MUTED = "#9b988e";
const SERIF = "'Cormorant Garamond', serif";

export type EventsIndexCopy = {
  upNext: string;
  previous: string;
  comingNext: string;
  viewChapter: string;
};

const Divider = ({ label }: { label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, maxWidth: 1240, margin: "0 auto" }}>
    <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
    <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>{label}</span>
    <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
  </div>
);

export default function EventsIndex({
  t,
  lang,
  isMobile,
  onOpenChapter,
}: {
  t: EventsIndexCopy;
  lang: Lang;
  isMobile: boolean;
  onOpenChapter: (id: string) => void;
}) {
  const next = upcomingChapters();
  const past = pastChapters();

  return (
    <div style={{ paddingBottom: "clamp(72px,11vh,130px)" }}>
      {/* ============ UP NEXT ============ */}
      {next.map((c) => (
        <section
          key={c.id}
          style={{
            position: "relative",
            overflow: "hidden",
            marginBottom: "clamp(74px,12vh,150px)",
            padding: `calc(env(safe-area-inset-top,0px) + clamp(104px,15vh,180px)) clamp(28px,6vw,80px) clamp(76px,12vh,140px)`,
          }}
        >
          {/* The photograph sits behind the type, darkened to the Vesper ground.
              Daylight needs a heavier hand than the Madrid night shot did. */}
          {c.heroImage && (
            <>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${c.heroImage}')`, backgroundSize: "cover", backgroundPosition: "center center", filter: "grayscale(0.35) saturate(0.75) brightness(0.62)", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(6,8,15,0.7)", zIndex: 1 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,8,15,0.92) 0%, rgba(6,8,15,0.55) 30%, rgba(6,8,15,0.72) 70%, #06080F 100%)", zIndex: 1 }} />
            </>
          )}

          <div style={{ position: "relative", zIndex: 2 }}>
            <Divider label={t.upNext} />

            <div style={{ textAlign: "center", marginTop: "clamp(46px,8vh,96px)" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, marginBottom: "clamp(20px,3.5vh,32px)" }}>
                {c.chapter}
              </div>

              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(40px,7.4vw,104px)", lineHeight: 1.02, letterSpacing: "0.01em", color: IVORY, margin: 0, textShadow: "0 6px 30px rgba(0,0,0,0.55)" }}>
                {c.city}
              </h2>

              {c.sport && (
                <div style={{ fontSize: isMobile ? 11 : 12, letterSpacing: "0.52em", textTransform: "uppercase", color: IVORY, marginTop: "clamp(18px,3vh,30px)", paddingLeft: "0.52em" }}>
                  {localized(c.sport, lang)}
                </div>
              )}

              <span style={{ display: "block", width: 1, height: "clamp(34px,6vh,62px)", background: "linear-gradient(to bottom, rgba(198,162,88,0.55), rgba(198,162,88,0))", margin: "clamp(26px,4.5vh,44px) auto" }} />

              {c.tagline && (
                <p style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(16px,1.5vw,22px)", color: BODY, lineHeight: 1.75, maxWidth: 620, margin: "0 auto", textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}>
                  {localized(c.tagline, lang)}
                </p>
              )}

              <div style={{ display: "inline-block", border: "1px solid rgba(198,162,88,0.35)", background: "rgba(6,8,15,0.35)", padding: "13px 38px", marginTop: "clamp(30px,5vh,48px)" }}>
                <span style={{ fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD }}>{t.comingNext}</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============ PREVIOUS CHAPTERS ============ */}
      {past.length > 0 && (
        <section style={{ padding: "0 clamp(28px,6vw,80px)" }}>
          <Divider label={t.previous} />

          <div style={{ maxWidth: 1240, margin: "clamp(44px,7vh,86px) auto 0" }}>
            {past.map((c) => (
              <ChapterRow key={c.id} chapter={c} lang={lang} isMobile={isMobile} cta={t.viewChapter} onOpen={onOpenChapter} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Access to Vesper itself, not to any one chapter. It lives on the index
 * rather than inside an archive, and on desktop it is the only route to the
 * request form — the home hero only offers that button on mobile.
 */
export function RequestAccessBar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      style={{ background: "linear-gradient(90deg,#120e04 0%,#1e1606 50%,#120e04 100%)", borderTop: "1px solid rgba(198,162,88,0.38)", padding: "clamp(20px,3vh,28px) clamp(28px,6vw,80px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(90deg,#1a1405 0%,#2a1e08 50%,#1a1405 100%)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(90deg,#120e04 0%,#1e1606 50%,#120e04 100%)")}
    >
      <span style={{ fontSize: 11, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD }}>{label}</span>
      <span style={{ color: GOLD, fontSize: 18, lineHeight: 1 }}>→</span>
    </div>
  );
}

function ChapterRow({
  chapter: c,
  lang,
  isMobile,
  cta,
  onOpen,
}: {
  chapter: VesperChapter;
  lang: Lang;
  isMobile: boolean;
  cta: string;
  onOpen: (id: string) => void;
}) {
  const body = (
    <>
      <div style={{ display: "flex", alignItems: "baseline", gap: isMobile ? 16 : 26, marginBottom: 14 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.36em", color: GOLD, flexShrink: 0 }}>{c.numeral}</span>
        <h3 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(26px,3.4vw,48px)", lineHeight: 1.1, letterSpacing: "0.02em", color: IVORY, margin: 0 }}>
          {c.chapter} — {c.city}
        </h3>
      </div>
      <div style={{ paddingLeft: isMobile ? 26 : 36 }}>
        {c.date && (
          <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: MUTED, marginBottom: 7 }}>{localized(c.date, lang)}</div>
        )}
        {c.venue && (
          <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: MUTED }}>{c.venue}</div>
        )}
        {c.tagline && (
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px,1.6vw,23px)", color: BODY, margin: "clamp(16px,2.5vh,22px) 0 0" }}>
            {localized(c.tagline, lang)}
          </p>
        )}
      </div>
    </>
  );

  if (!c.hasArchive) {
    return <div style={{ padding: "clamp(28px,4vh,40px) 0", borderTop: "1px solid rgba(198,162,88,0.18)" }}>{body}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(c.id)}
      className="v-chapter"
      aria-label={`${c.chapter} — ${c.city}`}
      style={{
        display: "block", width: "100%", textAlign: "left", cursor: "pointer",
        background: "transparent", border: "none", borderTop: "1px solid rgba(198,162,88,0.18)",
        padding: "clamp(30px,4.5vh,46px) 0 clamp(26px,4vh,40px)",
      }}
    >
      {body}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "clamp(22px,3.5vh,32px)", paddingLeft: isMobile ? 26 : 36 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD }}>{cta}</span>
        <span style={{ color: GOLD, fontSize: 17, lineHeight: 1 }}>→</span>
      </div>
    </button>
  );
}
