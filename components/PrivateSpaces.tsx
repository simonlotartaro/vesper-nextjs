"use client";

import React from "react";

/**
 * Private spaces at Ramsés — a chapter of the Events overlay.
 *
 * The overview plan comes first and is not a room: it locates the spaces
 * inside the venue. Only the six spaces that have their own photograph get a
 * card; the plan shows others that deliberately have none.
 *
 * The open modal is owned by VesperHome, so Escape, the browser Back button,
 * the body scroll lock and the floating WhatsApp button all keep working from
 * the handlers that already exist there.
 */

export type SpaceId =
  | "map"
  | "la-taberna"
  | "el-tabanco"
  | "el-senorito"
  | "chimenea"
  | "captain-room"
  | "black";

/** Proper nouns — never translated, identical in the three languages. */
const SPACES: readonly { id: SpaceId; name: string; src: string }[] = [
  { id: "la-taberna", name: "La Taberna", src: "/assets/la-taberna.jpg" },
  { id: "el-tabanco", name: "El Tabanco", src: "/assets/el-tabanco.jpg" },
  { id: "el-senorito", name: "El Señorito", src: "/assets/el-senorito.jpg" },
  { id: "chimenea", name: "Christine", src: "/assets/chimenea.jpg" },
  { id: "captain-room", name: "Captain Room", src: "/assets/captain-room.jpg" },
  { id: "black", name: "Black", src: "/assets/black.jpg" },
];

const MAP_SRC = "/assets/private-spaces-map.jpg";

export type SpacesCopy = {
  label: string;
  intro: string;
  explore: string;
  mapHint: string;
  mapAlt: string;
  eyebrow: string;
  cta: string;
  enquiry: string;
};

const GOLD = "#C6A258";
const IVORY = "#F4EFE4";
const SERIF = "'Cormorant Garamond', serif";

const numeral = (i: number) => String(i + 1).padStart(2, "0");

/** wa.me link for one space. Plain href — WhatsApp opens without any JS. */
const enquiryHref = (waNumber: string, template: string, space: string) =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(template.replace("{space}", space))}`;

export default function PrivateSpaces({
  t,
  isMobile,
  waNumber,
  open,
  onOpen,
  onClose,
}: {
  t: SpacesCopy;
  isMobile: boolean;
  waNumber: string;
  open: SpaceId | null;
  onOpen: (id: SpaceId) => void;
  onClose: () => void;
}) {
  const space = SPACES.find((s) => s.id === open) ?? null;

  return (
    <>
      <div style={{ padding: "0 clamp(28px,6vw,80px) clamp(48px,7vh,80px)" }}>
        {/* Same divider as THE EVENING INCLUDES and PROGRAMME */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: "clamp(22px,3vh,32px)" }}>
          <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>{t.label}</span>
          <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
        </div>

        <p style={{ fontFamily: SERIF, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(15px,1.4vw,20px)", color: "#d6d2c8", lineHeight: 1.75, textAlign: "center", maxWidth: 620, margin: "0 auto clamp(34px,5vh,56px)" }}>
          {t.intro}
        </p>

        {/* Overview plan — sits on the page background, no frame, no radius */}
        <button
          type="button"
          onClick={() => onOpen("map")}
          className="v-space"
          aria-label={t.mapAlt}
          style={{ display: "block", width: "100%", maxWidth: 1240, margin: "0 auto", padding: 0, border: "none", background: "transparent", cursor: "zoom-in" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MAP_SRC} alt={t.mapAlt} style={{ display: "block", width: "100%", height: "auto" }} />
        </button>

        <div style={{ textAlign: "center", marginTop: "clamp(18px,2.5vh,26px)" }}>
          {isMobile && (
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: "#9b988e", marginBottom: 14 }}>{t.mapHint}</div>
          )}
          <span style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD }}>{t.explore}</span>
        </div>

        {/* Gallery — two staggered columns on desktop, one per row on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
            alignItems: "start",
            columnGap: "clamp(24px,3.5vw,64px)",
            rowGap: isMobile ? "clamp(48px,7vh,72px)" : "clamp(56px,9vh,120px)",
            maxWidth: 1240,
            margin: "clamp(52px,8vh,96px) auto 0",
          }}
        >
          {SPACES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpen(s.id)}
              className="v-space"
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", overflow: "hidden", border: "1px solid rgba(198,162,88,0.13)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.name}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 16 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.36em", color: GOLD }}>{numeral(i)}</span>
                <span style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(19px,1.9vw,28px)", color: IVORY, letterSpacing: "0.02em" }}>{s.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ============ SPACE / PLAN MODAL ============ */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 160, background: "#06080F", overflowY: "auto", animation: "vFadeIn .5s both" }}>
          <button
            onClick={onClose}
            className="v-close"
            style={{ position: "fixed", top: 28, left: 28, zIndex: 170, background: "transparent", border: "1px solid rgba(198,162,88,0.4)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5" /></svg>
          </button>

          {open === "map" ? (
            // Full size, panned rather than shrunk: the plan's lettering has to
            // stay readable on a phone.
            <div style={{ minHeight: "100%", padding: `${isMobile ? 86 : 96}px 0 40px`, overflowX: "auto" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={MAP_SRC}
                alt={t.mapAlt}
                style={{ display: "block", width: isMobile ? 1200 : "100%", maxWidth: isMobile ? "none" : 1400, height: "auto", margin: "0 auto" }}
              />
            </div>
          ) : space ? (
            // the photograph is capped so the name, the line and the CTA all
            // stay above the fold on a laptop, without scrolling
            <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `${isMobile ? 92 : 96}px clamp(24px,6vw,80px) clamp(48px,7vh,72px)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={space.src}
                alt={space.name}
                style={{ display: "block", width: "100%", maxWidth: 1100, maxHeight: "46vh", objectFit: "contain", marginBottom: "clamp(26px,4vh,42px)" }}
              />
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(30px,4.4vw,58px)", color: IVORY, letterSpacing: "0.03em", margin: "0 0 14px" }}>{space.name}</h2>
              <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: "clamp(30px,5vh,46px)" }}>{t.eyebrow}</div>

              <a
                href={enquiryHref(waNumber, t.enquiry, space.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="v-space-cta"
                style={{ display: "inline-flex", alignItems: "center", gap: 16, border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none", padding: "16px 40px", fontSize: 11, letterSpacing: "0.44em", textTransform: "uppercase" }}
              >
                {t.cta}
                <span style={{ fontSize: 17, lineHeight: 1, letterSpacing: 0 }}>→</span>
              </a>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
