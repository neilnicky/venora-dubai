// Editorial copy for the whole site. Components render this; they never hard-code copy.
// Status: PROPOSED copy built on verified facts (bio, captions, footage). Lines quoting the
// Instagram bio are marked [bio]. Nothing here states a price, location, licence or track record.
import { siteConfig } from "./site-config.ts";

/** A two-tone line: `lead` in full ink, `tail` in the muted tone. */
export interface ToneLine {
  lead: string;
  tail?: string;
}

export const seo = {
  titleSuffix: "Venora Dubai",
  defaultTitle: "Venora Dubai | Luxury villas and penthouses in Dubai, on film",
  description:
    "Venora Dubai presents ultra-luxury villas, penthouses and apartments for sale in Dubai, each with a walkthrough film. Enquire by Instagram message.",
  homesDescription: "Browse villas, penthouses and apartments Venora Dubai has presented for sale, each with a walkthrough film.",
  enquireDescription: "Tell Venora Dubai what you are looking for. We write the message for you and open a chat on Instagram.",
};

export const brand = {
  name: siteConfig.name,
  wordmarkLabel: "Venora, Luxury Real Estate",
  tagline: siteConfig.tagline,
  /** [bio] */
  positioning: "Your gateway to Dubai's ultra-luxury real estate",
  /** [bio] */
  offer: "Exclusive homes and investment opportunities",
};

export const hero = {
  eyebrow: "Venora · Luxury Real Estate · Dubai",
  /** [bio], shortened. Rendered word by word. */
  title: "Your gateway to Dubai's ultra-luxury homes",
  dek: { lead: "Villas, penthouses and apartments on film.", tail: "Walk through them here, then message us to discover more." } satisfies ToneLine,
  scrollHint: "Scroll",
};

export const why = {
  caption: "Why Venora",
  body: {
    lead: "See the home before you ask about it.",
    tail: "Each home here comes with a walkthrough film, so your first conversation with us starts from rooms you have already seen.",
  } satisfies ToneLine,
};

export const portals = {
  title: { lead: "Villas, penthouses", tail: "and apartments." } satisfies ToneLine,
  /** {count}, {from}, {to} are filled from properties.ts. */
  body: "{count} homes presented for sale in Dubai between {from} and {to}. Price, community and availability come with your enquiry.",
};

export const steps = {
  id: "how-it-works",
  title: { lead: "Start with", tail: "a message." } satisfies ToneLine,
  label: "How it works",
  items: [
    { lead: "Choose a home, or describe one.", tail: "Browse the films, or tell us the type, budget and timing you have in mind." },
    { lead: "Send it on Instagram.", tail: "Our form writes the message for you and opens a chat with @venora_dubai." },
    { lead: "Get the details.", tail: "Venora replies with price, location and availability for the homes that fit." },
  ] satisfies ToneLine[],
};

export const audience = {
  label: "On Instagram",
  /** Shown under the figures so the date travels with them. */
  note: `Figures from @${siteConfig.contact.instagram.handle} on {date}.`,
};

export const collection = {
  caption: "Collection",
  title: { lead: "Browse", tail: "by type." } satisfies ToneLine,
  rows: {
    villa: "Contemporary villas with gardens, pools and double-height living rooms.",
    penthouse: "High-floor homes with terraces over the marina and the sea.",
    apartment: "Skyline apartments with open kitchens and full-height glazing.",
  },
  brief: { lead: "Prices and availability change.", tail: "Ask about any home and Venora confirms where it stands before you plan a viewing." } satisfies ToneLine,
};

export const routes = {
  /** [bio] */
  title: { lead: "Exclusive homes", tail: "and investment opportunities." } satisfies ToneLine,
  body: { lead: "Buying to live, to invest, or both?", tail: "Say so in your enquiry and we will point you to the right homes." } satisfies ToneLine,
  cards: [
    { title: "Homes to live in", text: "Villas and penthouses presented with full walkthroughs.", action: "Browse homes", href: "/homes" },
    { title: "Investment opportunities", text: "Ask about homes that suit an investment brief.", action: "Ask about investing", interest: "invest" },
    { title: "A private brief", text: "Describe the home you want. Venora comes back with homes that match.", action: "Send a brief", interest: "brief" },
  ],
};

export const latest = {
  title: { lead: "Latest", tail: "on film." } satisfies ToneLine,
  body: { lead: "New presentations appear on Instagram about twice a week.", tail: "These are the most recent." } satisfies ToneLine,
  follow: `Follow @${siteConfig.contact.instagram.handle}`,
};

export const outro = {
  title: { lead: "Tell us what", tail: "you're looking for." } satisfies ToneLine,
};

export const footer = {
  blurb: "Luxury real estate in Dubai, presented on film.",
  contactLabel: "Enquiries",
  contactText: "By Instagram direct message",
  disclaimer:
    "Homes shown were presented for sale on @venora_dubai on the dates listed. Price, location and availability are confirmed on enquiry.",
};

export const homesPage = {
  eyebrow: "Collection",
  title: "Homes",
  dek: { lead: "Every home Venora has presented, with its walkthrough film.", tail: "Filter by type or sort by date." } satisfies ToneLine,
  note: "This is a record of presentations, not live inventory. Ask about any home for its current status.",
  filterLabel: "Property type",
  sortLabel: "Sort",
  all: "All",
  empty: "No homes of this type yet.",
};

export const homePage = {
  factsTitle: "Details",
  observedTitle: "In the film",
  captionTitle: "As published",
  onRequest: "On request",
  statusValue: "Presented for sale",
  moreTitle: "More homes",
  filmLabel: "Walkthrough film",
  playLabel: "Play the walkthrough",
};

export const enquiry = {
  title: { lead: "Start", tail: "an enquiry." } satisfies ToneLine,
  dek: "Answer a few questions and we write your message. It opens in a chat with @venora_dubai on Instagram, ready to send.",
  fields: {
    name: "Your name",
    interest: "You are",
    propertyType: "Property type",
    budget: "Budget",
    timing: "Timing",
    message: "Anything else",
    messagePlaceholder: "Bedrooms, areas you like, questions about a home…",
    home: "About this home",
  },
  submit: "Write my message",
  submitEndpoint: "Send enquiry",
  sending: "Sending…",
  optional: "optional",
  errors: {
    name: "Tell us your name so Venora knows who is asking.",
    nameLength: "Use 80 characters or fewer.",
    message: "Keep this under 800 characters.",
  },
  handoff: {
    title: "Your message is ready",
    copied: "We copied it to your clipboard. Instagram opens in a new tab: paste it into the chat and send.",
    manual: "Copy the message below, then paste it into the chat with @venora_dubai.",
    open: "Open Instagram chat",
    copy: "Copy message",
    copiedShort: "Copied",
    note: "Nothing has been sent yet. You send it from Instagram.",
  },
  endpointSuccess: { title: "Enquiry sent", text: "Venora has your enquiry and will reply." },
  endpointError: "We could not send your enquiry. Try again, or message us on Instagram.",
  close: "Close",
};

export const notFound = {
  title: { lead: "This page", tail: "is not here." } satisfies ToneLine,
  body: "The link may be old. The homes are still a click away.",
};
