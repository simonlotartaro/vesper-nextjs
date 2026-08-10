import { recordOutboundClick } from "@/lib/analytics";

/**
 * Outbound click on the @Vesper link in the menu footer.
 *
 * Sent with navigator.sendBeacon, so nothing here can delay or block the
 * navigation: the browser opens Instagram through a plain <a target="_blank">
 * and never waits for this response.
 */
export async function POST(req: Request) {
  return recordOutboundClick(req, {
    bucket: "ig_outbound",
    eventName: "instagram_outbound_click",
    placement: "menu_footer",
  });
}
