import { recordOutboundClick } from "@/lib/analytics";

/**
 * Outbound click on the floating WhatsApp button.
 *
 * Sent with navigator.sendBeacon, so nothing here can delay or block the
 * navigation: the browser opens WhatsApp through a plain <a target="_blank">
 * and never waits for this response.
 *
 * The visitor's number and the prefilled message travel from the browser
 * straight to WhatsApp through the wa.me URL. They never reach this server.
 */
export async function POST(req: Request) {
  return recordOutboundClick(req, {
    bucket: "wa_outbound",
    eventName: "whatsapp_outbound_click",
    placement: "floating_whatsapp",
  });
}
