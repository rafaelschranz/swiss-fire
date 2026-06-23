/**
 * Affiliate slot configuration. Centralised here so links can be swapped
 * without touching component code. All slots are disclosed as advertising
 * (Swiss UWG requires ads to be recognisable as such) and rendered
 * visually separate from calculation results.
 *
 * No real partner links yet — `href: "#"` placeholders. Replace with real
 * affiliate URLs when a partnership is in place; do not invent tracking
 * params or commission terms.
 */
export interface AffiliateSlotConfig {
  id: string;
  name: string;
  description: string;
  href: string;
}

export const AFFILIATE_SLOTS: Record<"broker" | "pillar3a", AffiliateSlotConfig> = {
  broker: {
    id: "broker",
    name: "Broker (Platzhalter)",
    description: "Ein Online-Broker zur Verwahrung des steuerbaren Brücken-Portfolios.",
    href: "#",
  },
  pillar3a: {
    id: "pillar3a",
    name: "3a-Anbieter (Platzhalter)",
    description: "Ein Säule-3a-Wertschriftenlösungsanbieter.",
    href: "#",
  },
};
