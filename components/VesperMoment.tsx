"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  type Lang,
  type VesperMoment,
  localized,
  orderedMoments,
  vimeoEmbedUrl,
} from "@/lib/moments";

/**
 * /moment — the post-event chapter, reached from the QR printed on the cards.
 *
 * Unlisted rather than private: no password, no login, no link from anywhere
 * else on the site, and noindex in the route's metadata.
 *
 * The page has two states and picks between them from the data alone. While
 * lib/moments.ts is empty it reads as a finished editorial landing; the moment
 * entries appear there it becomes the collection, with no change here.
 */

const GOLD = "#C6A258";
const IVORY = "#F4EFE4";
const BODY = "#d6d2c8";
const MUTED = "#9b988e";
const SERIF = "'Cormorant Garamond', serif";

const T = {
  en: {
    eyebrow: "VESPER MOMENT",
    headline: "The conversations behind the night.",
    chapter: "Chapter I — Madrid",
    description: "A private collection of conversations from Vesper Madrid. Available after the event.",
    status: "COMING SOON",
    collection: "THE CONVERSATIONS",
    back: "Back to vesperevent.com",
    close: "Close",
    soon: "Available soon",
    watch: "Watch the conversation",
  },
  es: {
    eyebrow: "VESPER MOMENT",
    headline: "Las conversaciones detrás de la noche.",
    chapter: "Chapter I — Madrid",
    description: "Una colección privada de conversaciones de Vesper Madrid. Disponible después del evento.",
    status: "PRÓXIMAMENTE",
    collection: "LAS CONVERSACIONES",
    back: "Volver a vesperevent.com",
    close: "Cerrar",
    soon: "Disponible próximamente",
    watch: "Ver la conversación",
  },
  fr: {
    eyebrow: "VESPER MOMENT",
    headline: "Les conversations qui ont fait la nuit.",
    chapter: "Chapter I — Madrid",
    description: "Une collection privée de conversations de Vesper Madrid. Disponible après l'événement.",
    status: "BIENTÔT",
    collection: "LES CONVERSATIONS",
    back: "Retour à vesperevent.com",
    close: "Fermer",
    soon: "Bientôt disponible",
    watch: "Voir la conversation",
  },
} as const;

/**
 * Seam for the analytics we agreed to add later — moment_page_view,
 * moment_video_open, moment_video_play. It deliberately does nothing today:
 * no request, no beacon, no storage. Wiring it up later means filling this one
 * function in, not hunting for the call sites.
 */
type MomentEvent = "moment_page_view" | "moment_video_open" | "moment_video_play";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trackMoment = (_event: MomentEvent, _id?: string) => {
  /* intentionally empty until the analytics placement exists */
};

export default function VesperMomentPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const t = T[lang];
  const moments = orderedMoments();
  const open = moments.find((m) => m.id === openId) ?? null;

  const openRef = useRef<string | null>(null);
  openRef.current = openId;

  useEffect(() => {
    const mq = () => { setIsMobile(window.innerWidth < 820); setReady(true); };
    mq();
    window.addEventListener("resize", mq);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    trackMoment("moment_page_view");
    return () => {
      window.removeEventListener("resize", mq);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  // The document language follows the picker, for screen readers and hyphenation
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  useEffect(() => { document.body.style.overflow = openId ? "hidden" : ""; }, [openId]);

  // Browser Back closes the conversation instead of leaving the page
  useEffect(() => { if (openId) window.history.pushState({ vesperMoment: true }, ""); }, [openId]);
  useEffect(() => {
    const onPop = () => { if (openRef.current) setOpenId(null); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openMoment = (m: VesperMoment) => { trackMoment("moment_video_open", m.id); setOpenId(m.id); };

  return (
    <main style={{ minHeight: "100dvh", background: "#06080F", position: "relative", overflowX: "hidden" }}>
      {/* ============ HEADER ============ */}
      {ready && (
        <>
          <a
            href="/"
            aria-label={t.back}
            className="v-close"
            style={{
              position: "fixed",
              top: "calc(env(safe-area-inset-top,0px) + 28px)",
              left: "calc(env(safe-area-inset-left,0px) + 28px)",
              zIndex: 300, background: "transparent", border: "1px solid rgba(198,162,88,0.4)",
              borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center",
              justifyContent: "center", color: GOLD, textDecoration: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5" /></svg>
          </a>

          <nav
            aria-label="Language"
            style={{
              position: "fixed",
              top: "calc(env(safe-area-inset-top,0px) + 30px)",
              right: "calc(env(safe-area-inset-right,0px) + 28px)",
              zIndex: 300, display: "flex", gap: 6, alignItems: "center",
            }}
          >
            {(["en", "es", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-current={lang === l ? "true" : undefined}
                className="v-lang"
                style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', system-ui, sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: lang === l ? GOLD : "rgba(236,231,219,0.58)", padding: "8px 6px", transition: "color .3s ease", fontWeight: lang === l ? 500 : 400, borderBottom: lang === l ? `1px solid ${GOLD}` : "1px solid transparent", lineHeight: 1 }}
              >
                {l}
              </button>
            ))}
          </nav>
        </>
      )}

      {/* ============ EDITORIAL OPENING ============ */}
      <section
        style={{
          minHeight: moments.length ? "auto" : "100dvh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: `calc(env(safe-area-inset-top,0px) + clamp(96px,12vh,150px)) clamp(28px,6vw,80px) clamp(64px,9vh,110px)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/vesper-logo.png"
          alt="Vesper"
          style={{ width: "clamp(58px,7vw,86px)", height: "auto", opacity: 0.92, marginBottom: "clamp(26px,4.5vh,44px)", animation: "vUp 1.2s both" }}
        />

        <div style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, marginBottom: "clamp(18px,3vh,30px)", animation: "vUp 1.2s .1s both" }}>
          {t.eyebrow}
        </div>

        <h1 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(34px,5.4vw,76px)", lineHeight: 1.08, letterSpacing: "-0.01em", color: IVORY, margin: 0, maxWidth: 16 + "ch", animation: "vUp 1.2s .2s both" }}>
          {t.headline}
        </h1>

        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(17px,1.8vw,25px)", color: GOLD, margin: "clamp(16px,2.6vh,26px) 0 0", animation: "vUp 1.2s .3s both" }}>
          {t.chapter}
        </p>

        <span style={{ display: "block", width: 1, height: "clamp(30px,5vh,52px)", background: "linear-gradient(to bottom, rgba(198,162,88,0.55), rgba(198,162,88,0))", margin: "clamp(22px,3.6vh,36px) 0" }} />

        <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(15px,1.4vw,20px)", color: BODY, lineHeight: 1.8, maxWidth: 560, margin: 0, animation: "vUp 1.2s .4s both" }}>
          {t.description}
        </p>

        {moments.length === 0 && (
          <div style={{ display: "inline-block", border: "1px solid rgba(198,162,88,0.35)", padding: "13px 38px", marginTop: "clamp(30px,5vh,46px)", animation: "vUp 1.2s .5s both" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD }}>{t.status}</span>
          </div>
        )}
      </section>

      {/* ============ THE CONVERSATIONS ============ */}
      {moments.length > 0 && (
        <section style={{ padding: "0 clamp(28px,6vw,80px) clamp(90px,14vh,160px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: "clamp(46px,8vh,88px)", maxWidth: 1240, marginLeft: "auto", marginRight: "auto" }}>
            <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
            <h2 style={{ fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap", margin: 0, fontWeight: 400 }}>{t.collection}</h2>
            <span style={{ flex: 1, height: 1, background: "rgba(198,162,88,0.28)" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))",
              alignItems: "start",
              columnGap: "clamp(24px,3.5vw,64px)",
              rowGap: isMobile ? "clamp(48px,7vh,72px)" : "clamp(56px,9vh,120px)",
              maxWidth: 1240,
              margin: "0 auto",
            }}
          >
            {moments.map((m) => {
              const discipline = localized(m.discipline, lang);
              const title = localized(m.title, lang);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openMoment(m)}
                  className="v-space"
                  aria-label={`${m.athlete} — ${discipline}`}
                  style={{ display: "block", width: "100%", padding: 0, border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", overflow: "hidden", border: "1px solid rgba(198,162,88,0.13)", background: "#0b0e18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {m.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.thumbnail} alt={`${m.athlete} — ${discipline}`} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15px,1.5vw,20px)", color: MUTED }}>{t.soon}</span>
                    )}
                    {m.duration && (
                      <span style={{ position: "absolute", right: 14, bottom: 12, fontSize: 10, letterSpacing: "0.2em", color: IVORY, background: "rgba(6,8,15,0.62)", padding: "5px 9px" }}>{m.duration}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 16 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.36em", color: GOLD }}>{m.id}</span>
                    <span style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(19px,1.9vw,28px)", color: IVORY, letterSpacing: "0.02em" }}>{m.athlete}</span>
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: MUTED, marginTop: 8, paddingLeft: 38 }}>
                    {discipline}
                  </div>
                  {title && (
                    <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(14px,1.3vw,18px)", color: BODY, lineHeight: 1.65, margin: "12px 0 0", paddingLeft: 38, maxWidth: "46ch" }}>{title}</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ CONVERSATION MODAL ============ */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.athlete} style={{ position: "fixed", inset: 0, zIndex: 160, background: "#06080F", overflowY: "auto", animation: "vFadeIn .5s both" }}>
          <button
            onClick={() => setOpenId(null)}
            aria-label={t.close}
            className="v-close"
            style={{ position: "fixed", top: "calc(env(safe-area-inset-top,0px) + 28px)", left: "calc(env(safe-area-inset-left,0px) + 28px)", zIndex: 170, background: "transparent", border: "1px solid rgba(198,162,88,0.4)", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5" /></svg>
          </button>

          <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 1100, margin: "0 auto", padding: `${isMobile ? 96 : 104}px clamp(24px,6vw,72px) clamp(56px,9vh,90px)` }}>
            <MomentPlayer moment={open} soon={t.soon} />

            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: "clamp(26px,4vh,40px)", flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, letterSpacing: "0.36em", color: GOLD }}>{open.id}</span>
              <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,4vw,52px)", color: IVORY, letterSpacing: "0.02em", margin: 0 }}>{open.athlete}</h2>
            </div>
            <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginTop: 12 }}>
              {localized(open.discipline, lang)}{open.duration ? ` — ${open.duration}` : ""}
            </div>
            {localized(open.title, lang) && (
              <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px,1.7vw,24px)", color: BODY, lineHeight: 1.6, margin: "clamp(20px,3vh,28px) 0 0", maxWidth: "42ch" }}>{localized(open.title, lang)}</p>
            )}
            {localized(open.description, lang) && (
              <p style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(15px,1.4vw,19px)", color: MUTED, lineHeight: 1.8, margin: "clamp(16px,2.5vh,24px) 0 0", maxWidth: "62ch" }}>{localized(open.description, lang)}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * 16:9 Vimeo embed, or the placeholder plate while the edit is still coming.
 * An entry without a usable link never renders an empty iframe.
 */
function MomentPlayer({ moment, soon }: { moment: VesperMoment; soon: string }) {
  const src = vimeoEmbedUrl(moment.videoUrl);

  if (!src) {
    return (
      <div style={{ width: "100%", aspectRatio: "16 / 9", border: "1px solid rgba(198,162,88,0.13)", background: "#0b0e18", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(15px,1.5vw,20px)", color: MUTED }}>{soon}</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#000", border: "1px solid rgba(198,162,88,0.13)" }}>
      <iframe
        src={src}
        title={moment.athlete}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => trackMoment("moment_video_play", moment.id)}
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}
