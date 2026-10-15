// Enquiry validation and message composition. Shared by the form script and the unit tests.
import type { PropertyType } from "@/content/types.ts";
import { isPropertyType, typeLabels } from "./homes.ts";

export const interests = {
  buy: "Buying a home",
  invest: "Investing",
  brief: "Sending a private brief",
} as const;
export type Interest = keyof typeof interests;

export const budgets = {
  "under-5m": "Under AED 5M",
  "5-10m": "AED 5M to 10M",
  "10-20m": "AED 10M to 20M",
  "20m-plus": "Above AED 20M",
} as const;
export type Budget = keyof typeof budgets;

export const timings = {
  now: "Ready to buy now",
  "3-months": "Within 3 months",
  "12-months": "Within a year",
  exploring: "Just exploring",
} as const;
export type Timing = keyof typeof timings;

export interface EnquiryInput {
  name: string;
  interest: Interest;
  propertyType: PropertyType | "any";
  budget: Budget | null;
  timing: Timing | null;
  message: string;
  /** The home the enquiry is about, when sent from a home page. */
  home: { title: string; url: string } | null;
}

export type EnquiryField = "name" | "message";
export type EnquiryErrors = Partial<Record<EnquiryField, "required" | "too-long">>;

export const limits = { name: 80, message: 800 } as const;

function pick<T extends string>(value: unknown, options: Record<T, string>): T | null {
  return typeof value === "string" && value in options ? (value as T) : null;
}

/** Normalises raw form values. Unknown option values become null instead of passing through. */
export function readEnquiry(raw: Record<string, unknown>, home: EnquiryInput["home"] = null): EnquiryInput {
  const str = (v: unknown) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");
  const type = raw.propertyType;
  return {
    name: str(raw.name),
    interest: pick(raw.interest, interests) ?? "buy",
    propertyType: isPropertyType(type) ? type : "any",
    budget: pick(raw.budget, budgets),
    timing: pick(raw.timing, timings),
    message: typeof raw.message === "string" ? raw.message.trim() : "",
    home,
  };
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!input.name) errors.name = "required";
  else if (input.name.length > limits.name) errors.name = "too-long";
  if (input.message.length > limits.message) errors.message = "too-long";
  return errors;
}

/** The DM text. Plain lines so it reads naturally when pasted into Instagram. */
export function composeMessage(input: EnquiryInput): string {
  const lines = [`Hello Venora, I'm ${input.name}.`];
  if (input.home) lines.push(`I'm interested in this home: ${input.home.title} (${input.home.url})`);
  lines.push(`Interest: ${interests[input.interest]}`);
  if (input.propertyType !== "any") lines.push(`Looking for: ${typeLabels[input.propertyType].one}`);
  if (input.budget) lines.push(`Budget: ${budgets[input.budget]}`);
  if (input.timing) lines.push(`Timing: ${timings[input.timing]}`);
  if (input.message) lines.push("", input.message);
  return lines.join("\n");
}

/** JSON body for a configured backend endpoint. */
export function toPayload(input: EnquiryInput) {
  return {
    name: input.name,
    interest: input.interest,
    propertyType: input.propertyType,
    budget: input.budget,
    timing: input.timing,
    message: input.message,
    homeUrl: input.home?.url ?? null,
    text: composeMessage(input),
  };
}
