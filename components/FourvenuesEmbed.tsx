"use client";

import { useEffect, useRef } from "react";

/**
 * Fourvenues ticketing iframe.
 *
 * The vendor ships a single <script src=".../iframe/vesper/ITTO"> that is meant
 * to sit in static HTML. Two things about it dictate the shape of this file:
 *
 *  1. If #fourvenues-iframe is missing when the loader runs, it calls
 *     document.write(). After the document has closed — which is always the
 *     case here — that wipes the whole page. So the container must exist in
 *     the DOM before the script executes AND must never leave it afterwards.
 *
 *  2. The loader is not re-entrant: running it twice appends a second iframe
 *     and a second window "message" listener. The Events overlay mounts and
 *     unmounts every time it is opened, so we load the script once and keep
 *     the vendor's container alive across mounts instead of rebuilding it.
 *
 * The container is therefore a plain DOM node this component owns outside of
 * React: parked in a hidden holder on <body> while the overlay is closed,
 * moved into the slot below while it is open. React never renders its
 * children, so it never tries to reconcile the vendor's iframe.
 */

const LOADER_SRC = "https://www.fourvenues.com/assets/iframe/vesper/ITTO";
const ELEMENT_ID = "fourvenues-iframe";

let host: HTMLDivElement | null = null;
let parking: HTMLDivElement | null = null;
let loaderRequested = false;
let autoScrollGated = false;

/** The vendor's container, created on first use and never destroyed. */
function getHost(): HTMLDivElement {
  if (!host) {
    parking = document.createElement("div");
    parking.style.display = "none";
    document.body.appendChild(parking);

    host = document.createElement("div");
    host.id = ELEMENT_ID;
    parking.appendChild(host);
  }
  return host;
}

export default function FourvenuesEmbed({ minHeight = 420 }: { minHeight?: number }) {
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slotEl = slot.current;
    if (!slotEl) return;

    const hostEl = getHost();
    slotEl.appendChild(hostEl);

    // Two vendor behaviours have to be held back, both by stopping the message
    // before the loader's own listener sees it:
    //
    //  "navigate" — the loader answers it by writing window.location.hash, to
    //    deep-link the widget. Here that only pollutes the URL (the widget
    //    lives inside an overlay that no URL can restore) and, worse, the
    //    fragment navigation fires popstate, which closes the Events overlay.
    //
    //  "toTop" — the loader scrolls its anchor into view. On load that throws
    //    the visitor straight past the hero, the programme and the venue into
    //    ticket selection. Allowed once the visitor is inside the widget,
    //    which is the case the message was written for.
    // Registered once and never removed: re-registering after the vendor's own
    // listener exists would put us second in line, too late to stop it.
    if (!autoScrollGated) {
      autoScrollGated = true;
      window.addEventListener("message", (e: MessageEvent) => {
        const key = e.data?.key;
        if (key === "navigate") {
          e.stopImmediatePropagation();
          return;
        }
        if (key !== "toTop") return;
        const inside = document.activeElement?.id?.startsWith("iframeFourvenues");
        if (!inside) e.stopImmediatePropagation();
      });
    }

    // Appended after the container is in the DOM, so the document.write branch
    // of the loader can never be reached.
    if (!loaderRequested) {
      loaderRequested = true;
      const script = document.createElement("script");
      script.src = LOADER_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Park it, never remove it: the loader's message handlers keep resolving
      // #fourvenues-iframe by id long after the overlay is closed.
      parking?.appendChild(hostEl);
    };
  }, []);

  return <div ref={slot} style={{ width: "100%", minHeight }} />;
}
