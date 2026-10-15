import { siteConfig } from "./site-config.ts";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const primaryNav: NavLink[] = [
  { label: "Homes", href: "/homes" },
  { label: "Villas", href: "/homes?type=villa" },
  { label: "Penthouses", href: "/homes?type=penthouse" },
  { label: "How it works", href: "/#how-it-works" },
];

/** Labels for every call to action, so wording stays consistent site-wide. */
export const cta = {
  enquire: "Start an enquiry",
  enquireHome: "Ask about this home",
  message: "Message us",
  viewHomes: "View the homes",
  viewHome: "View home",
  watchOnInstagram: "Watch on Instagram",
  allHomes: "All homes",
} as const;

export const footerNav: NavLink[] = [
  { label: "Homes", href: "/homes" },
  { label: "Enquire", href: "/enquire" },
  { label: "Instagram", href: siteConfig.contact.instagram.profileUrl, external: true },
];
