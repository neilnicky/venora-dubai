// Context an enquiry CTA passes to the form (home, interest, type). Serialised into data attributes
// for the dialog, and into /enquire query params as the no-JS fallback.
import type { PropertyType } from "@/content/types.ts";
import type { Interest } from "./enquiry.ts";

export interface EnquiryPreset {
  interest?: Interest;
  type?: PropertyType;
  /** Property slug; the form resolves its title and URL. */
  home?: string;
}

export function enquireHref(preset: EnquiryPreset): string {
  const params = new URLSearchParams();
  if (preset.interest) params.set("interest", preset.interest);
  if (preset.type) params.set("type", preset.type);
  if (preset.home) params.set("home", preset.home);
  const s = params.toString();
  return s ? `/enquire?${s}` : "/enquire";
}
