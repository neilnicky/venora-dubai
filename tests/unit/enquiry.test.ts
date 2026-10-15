import { describe, expect, it } from "vitest";
import { composeMessage, readEnquiry, toPayload, validateEnquiry } from "@/lib/enquiry.ts";

describe("readEnquiry", () => {
  it("trims and collapses whitespace in the name", () => {
    expect(readEnquiry({ name: "  Aisha   Rahman " }).name).toBe("Aisha Rahman");
  });
  it("drops option values that are not on the list", () => {
    const input = readEnquiry({ name: "A", interest: "hack", propertyType: "castle", budget: "999m", timing: "yesterday" });
    expect(input).toMatchObject({ interest: "buy", propertyType: "any", budget: null, timing: null });
  });
  it("keeps valid option values", () => {
    const input = readEnquiry({ name: "A", interest: "invest", propertyType: "penthouse", budget: "10-20m", timing: "now" });
    expect(input).toMatchObject({ interest: "invest", propertyType: "penthouse", budget: "10-20m", timing: "now" });
  });
});

describe("validateEnquiry", () => {
  it("requires a name", () => {
    expect(validateEnquiry(readEnquiry({ name: "   " }))).toEqual({ name: "required" });
  });
  it("limits name and message length", () => {
    const errors = validateEnquiry(readEnquiry({ name: "x".repeat(81), message: "y".repeat(801) }));
    expect(errors).toEqual({ name: "too-long", message: "too-long" });
  });
  it("accepts a minimal valid enquiry", () => {
    expect(validateEnquiry(readEnquiry({ name: "Omar" }))).toEqual({});
  });
});

describe("composeMessage", () => {
  it("writes only the lines the visitor filled in", () => {
    expect(composeMessage(readEnquiry({ name: "Omar" }))).toBe("Hello Venora, I'm Omar.\nInterest: Buying a home");
  });
  it("references the home and every answered question", () => {
    const text = composeMessage(
      readEnquiry(
        { name: "Omar", interest: "invest", propertyType: "villa", budget: "20m-plus", timing: "3-months", message: "Four bedrooms please." },
        { title: "White villa behind a pivot door", url: "https://venora-dubai.example/homes/villa-2026-10-06" },
      ),
    );
    expect(text).toBe(
      [
        "Hello Venora, I'm Omar.",
        "I'm interested in this home: White villa behind a pivot door (https://venora-dubai.example/homes/villa-2026-10-06)",
        "Interest: Investing",
        "Looking for: Villa",
        "Budget: Above AED 20M",
        "Timing: Within 3 months",
        "",
        "Four bedrooms please.",
      ].join("\n"),
    );
  });
});

describe("toPayload", () => {
  it("includes structured fields and the composed text", () => {
    const payload = toPayload(readEnquiry({ name: "Omar", budget: "5-10m" }));
    expect(payload).toMatchObject({ name: "Omar", budget: "5-10m", homeUrl: null });
    expect(payload.text).toContain("Budget: AED 5M to 10M");
  });
});
