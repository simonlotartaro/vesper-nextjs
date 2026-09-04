import type { Metadata } from "next";
import VesperMoment from "@/components/VesperMoment";

/**
 * Unlisted, not private: reachable by anyone holding the QR, absent from every
 * menu, and kept out of search results by the robots directives below.
 *
 * There is deliberately no robots.txt rule for this path. A Disallow would
 * stop crawlers from ever reading the noindex — and, since robots.txt is
 * itself public, it would publish the URL we are trying to keep unlisted.
 */
export const metadata: Metadata = {
  title: "Vesper Moment — Chapter I, Madrid",
  description: "A private collection of conversations from Vesper Madrid.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function MomentPage() {
  return <VesperMoment />;
}
