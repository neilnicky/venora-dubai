// Business facts and integration settings. Every contact value here must come from a verified source.
// Source: instagram.com/venora_dubai, read 15 Oct 2026 (docs/property-content-audit.md).

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  /** Placeholder until the client confirms a domain. Keep in sync with astro.config.mjs `site`. */
  url: string;
  verifiedOn: string;
  contact: {
    instagram: { handle: string; profileUrl: string; dmUrl: string };
    /** Not published by Venora. Fill in only from a confirmed source; the UI hides null channels. */
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: string | null;
  };
  enquiry: {
    /**
     * Optional backend/CRM endpoint. When set, the form POSTs JSON here and shows success only on a 2xx.
     * When null, the form composes the message and hands off to Instagram DM.
     */
    endpoint: string | null;
  };
  /** Public profile figures shown with their date. Update both together. */
  audience: { followers: string; posts: number; asOf: string };
}

export const siteConfig: SiteConfig = {
  name: "Venora Dubai",
  shortName: "Venora",
  tagline: "Luxury Real Estate",
  url: "https://venora-dubai.example",
  verifiedOn: "2026-10-15",
  contact: {
    instagram: {
      handle: "venora_dubai",
      profileUrl: "https://www.instagram.com/venora_dubai/",
      dmUrl: "https://ig.me/m/venora_dubai",
    },
    phone: null,
    whatsapp: null,
    email: null,
    address: null,
  },
  enquiry: { endpoint: null },
  audience: { followers: "26K", posts: 86, asOf: "2026-10-15" },
};
