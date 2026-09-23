"use client";

import React from "react";
import {
  type Lang,
  MADRID_GALLERY,
  MADRID_PARTICIPANTS,
  chapterById,
  localized,
} from "@/lib/chapters";

/**
 * Chapter I — Madrid, as an archive.
 *
 * The night already happened, so nothing here sells it: no request access, no
 * private spaces, no tables, no hospitality, no invitation-only badge. What
 * remains is the record of it — the evening as it ran, the setting, and a
 * reference to the conversations filmed that night.
 *
 * The Vesper Moment block is a mention and nothing more. /moment stays
 * unlisted for the printed QR, so this page must never link to it.
 */

const GOLD = "#C6A258";
const IVORY = "#F4EFE4";
const BODY = "#d6d2c8";
const SOFT = "#bdb9af";
const MUTED = "#9b988e";
const SERIF = "'Cormorant Garamond', serif";

export type ChapterArchiveCopy = {
  eyebrow: string;
  headline: string;
  nightLabel: string;
  nightCopy: string;
  eveningLabel: string;
  eveningIntro: string;
  settingLabel: string;
  settingPlace: string;
  galleryLabel: string;
  peopleLabel: string;
  momentLabel: string;
  momentCopy: string;
  back: string;
};

type Step = { time: string; name: string; desc: string };

const Divider = ({ label }: { label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, maxWidth: 1240, margin: "0 auto" }}>
    <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
    <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>{label}</span>
    <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
  </div>
);

export default function ChapterMadrid({
  t,
  lang,
  isMobile,
  timeline,
  stats,
  venueName,
  venueAddress,
  onBack,
}: {
  t: ChapterArchiveCopy;
  lang: Lang;
  isMobile: boolean;
  timeline: readonly Step[];
  stats: readonly string[];
  venueName: string;
  venueAddress: string;
  onBack: () => void;
}) {
  const chapter = chapterById("madrid");
  const gallery = MADRID_GALLERY;
  const people = MADRID_PARTICIPANTS;

  return (
    <>
      {/* ============ OPENING ============ */}
      <div style={{ position: "relative", minHeight: isMobile ? "58vh" : "68vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(96px,14vh,160px) clamp(28px,6vw,80px) clamp(64px,9vh,110px)", overflow: "hidden" }}>
        {chapter?.heroImage && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${chapter.heroImage}')`, backgroundSize: "cover", backgroundPosition: "center center", zIndex: 0 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "rgba(6,8,15,0.74)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,8,15,0.5) 0%, rgba(6,8,15,0.12) 40%, rgba(6,8,15,0.88) 100%)", zIndex: 1 }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/vesper-logo.png" alt="Vesper" style={{ width: "clamp(56px,7vw,82px)", height: "auto", position: "relative", zIndex: 2, marginBottom: "clamp(24px,4vh,40px)", opacity: 0.92 }} />

        <div style={{ position: "relative", zIndex: 2, fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, marginBottom: "clamp(20px,3.5vh,32px)" }}>
          {t.eyebrow}
        </div>

        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(36px,5.6vw,80px)", color: IVORY, lineHeight: 1.06, margin: 0, position: "relative", zIndex: 2, letterSpacing: "-0.005em" }}>
          {t.headline}
        </h1>

        <div style={{ position: "relative", zIndex: 2, marginTop: "clamp(26px,4vh,40px)", display: "flex", flexDirection: "column", gap: 8 }}>
          {chapter?.date && (
            <span style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD }}>{localized(chapter.date, lang)}</span>
          )}
          {chapter?.venue && (
            <span style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(236,231,219,0.62)" }}>{chapter.venue}</span>
          )}
        </div>
      </div>

      {/* ============ THE NIGHT ============ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(28px,6vw,80px) clamp(48px,8vh,88px)" }}>
        <Divider label={t.nightLabel} />
        <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(17px,1.7vw,25px)", color: BODY, lineHeight: 1.8, textAlign: "center", maxWidth: 760, margin: "clamp(38px,6vh,68px) auto 0" }}>
          {t.nightCopy}
        </p>
      </section>

      {/* ============ THE EVENING ============ */}
      <section style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(52px,8vh,90px)" }}>
        <Divider label={t.eveningLabel} />
        <p style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(15px,1.4vw,20px)", color: BODY, lineHeight: 1.75, textAlign: "center", maxWidth: 620, margin: "clamp(24px,4vh,36px) auto clamp(38px,6vh,64px)" }}>
          {t.eveningIntro}
        </p>

        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {timeline.map((step, i, arr) => (
            <div key={i} style={{ display: "flex", gap: isMobile ? 18 : 34, paddingBottom: i === arr.length - 1 ? 0 : "clamp(30px,4.5vh,48px)" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                {i !== arr.length - 1 && <span style={{ flex: 1, width: 1, background: "linear-gradient(to bottom, rgba(198,162,88,0.45), rgba(198,162,88,0.1))", marginTop: 8 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: isMobile ? 10 : 16, marginBottom: 14 }}>
                  <span style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.6vw,34px)", color: GOLD, lineHeight: 1 }}>{step.time}</span>
                  <span style={{ fontSize: 10, letterSpacing: "0.36em", textTransform: "uppercase", color: IVORY }}>{step.name}</span>
                </div>
                <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(14px,1.3vw,18px)", color: SOFT, lineHeight: 1.7, margin: 0, maxWidth: "58ch" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "clamp(14px,2.5vw,32px)", marginTop: "clamp(40px,6vh,68px)", paddingTop: "clamp(28px,4vh,40px)", borderTop: "1px solid rgba(198,162,88,0.18)", maxWidth: 780, marginLeft: "auto", marginRight: "auto" }}>
          {stats.map((stat, i, arr) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>{stat}</span>
              {i !== arr.length - 1 && <span style={{ color: "rgba(198,162,88,0.4)", fontSize: 10 }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ============ THE SETTING ============ */}
      <section style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(52px,8vh,90px)", textAlign: "center" }}>
        <Divider label={t.settingLabel} />
        <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.2vw,58px)", color: IVORY, letterSpacing: "0.1em", margin: "clamp(34px,5.5vh,60px) 0 0" }}>
          {venueName}
        </h2>
        <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginTop: 16 }}>{t.settingPlace}</div>
        <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(14px,1.2vw,17px)", color: MUTED, lineHeight: 1.7, margin: "clamp(20px,3vh,28px) 0 0", whiteSpace: "pre-line" }}>
          {venueAddress}
        </p>
      </section>

      {/* ============ THE NIGHT IN IMAGES ============ */}
      {gallery.length > 0 && (
        <section style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(52px,8vh,90px)" }}>
          <Divider label={t.galleryLabel} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
              alignItems: "start",
              columnGap: "clamp(24px,3.5vw,64px)",
              rowGap: isMobile ? "clamp(40px,6vh,64px)" : "clamp(50px,8vh,104px)",
              maxWidth: 1240,
              margin: "clamp(44px,7vh,88px) auto 0",
            }}
          >
            {gallery.map((photo, i) => (
              <figure key={i} style={{ margin: 0, gridColumn: !isMobile && photo.orientation === "landscape" && gallery.length % 2 === 1 && i === gallery.length - 1 ? "1 / -1" : undefined }}>
                <div style={{ width: "100%", aspectRatio: photo.orientation === "portrait" ? "4 / 5" : "3 / 2", overflow: "hidden", border: "1px solid rgba(198,162,88,0.13)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={localized(photo.alt, lang)} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ============ THE PEOPLE ============ */}
      {people.length > 0 && (
        <section style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(52px,8vh,90px)" }}>
          <Divider label={t.peopleLabel} />
          <div style={{ maxWidth: 900, margin: "clamp(40px,6.5vh,80px) auto 0" }}>
            {people.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 14, padding: "clamp(18px,2.8vh,26px) 0", borderTop: i === 0 ? "none" : "1px solid rgba(198,162,88,0.14)" }}>
                <span style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(21px,2.2vw,32px)", color: IVORY, letterSpacing: "0.02em" }}>{p.name}</span>
                <span style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD }}>{localized(p.discipline, lang)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ VESPER MOMENT — a mention, never a link ============ */}
      <section style={{ padding: "clamp(20px,3vh,40px) clamp(28px,6vw,80px) clamp(64px,10vh,110px)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", border: "1px solid rgba(198,162,88,0.22)", padding: "clamp(40px,7vh,76px) clamp(26px,5vw,64px)", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD }}>{t.momentLabel}</div>
          <p style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(18px,1.8vw,26px)", color: BODY, lineHeight: 1.7, margin: "clamp(20px,3vh,30px) 0 0" }}>
            {t.momentCopy}
          </p>
        </div>
      </section>

      {/* ============ BACK TO THE INDEX ============ */}
      <div
        onClick={onBack}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onBack(); } }}
        style={{ borderTop: "1px solid rgba(198,162,88,0.28)", padding: "clamp(22px,3.2vh,30px) clamp(28px,6vw,80px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, cursor: "pointer" }}
        className="v-chapter"
      >
        <span style={{ color: GOLD, fontSize: 17, lineHeight: 1 }}>←</span>
        <span style={{ fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD }}>{t.back}</span>
      </div>
    </>
  );
}
