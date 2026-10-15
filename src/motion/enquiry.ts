// Enquiry forms and the enquiry dialog.
// With no endpoint configured, the form composes a DM and hands off to Instagram: it never claims
// that anything was sent. With an endpoint, it shows success only after a 2xx response.
import { composeMessage, readEnquiry, toPayload, validateEnquiry, type EnquiryErrors } from "@/lib/enquiry.ts";
import type { EnquiryPreset } from "@/lib/enquiry-preset.ts";
import { lockScroll } from "./scroll.ts";

interface Config {
  endpoint: string | null;
  dmUrl: string;
  homes: Record<string, { title: string; url: string }>;
  copy: { errors: { name: string; nameLength: string; message: string }; sending: string };
}
interface HandoffCopy {
  title: string;
  copied: string;
  manual: string;
  copiedShort: string;
  copy: string;
  endpointSuccess: { title: string; text: string };
  endpointError: string;
}

/** Copies to the clipboard; on failure selects the visible message so the visitor can copy it. */
async function copyText(text: string, field: HTMLTextAreaElement): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    field.select();
    return false;
  }
}

class EnquiryController {
  readonly form: HTMLFormElement;
  private readonly root: HTMLElement;
  private readonly config: Config;
  private readonly copy: HandoffCopy;
  private readonly done: HTMLElement;
  private readonly composed: HTMLTextAreaElement;
  private busy = false;

  constructor(form: HTMLFormElement) {
    this.form = form;
    this.root = form.closest<HTMLElement>("[data-enquiry-root]")!;
    this.config = JSON.parse(form.dataset.config!) as Config;
    this.copy = JSON.parse(this.root.querySelector("[data-copy-text]")!.textContent!) as HandoffCopy;
    this.done = this.root.querySelector<HTMLElement>("[data-handoff]")!;
    this.composed = this.root.querySelector<HTMLTextAreaElement>("[data-composed]")!;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      void this.submit();
    });
    this.root.querySelector("[data-home-clear]")?.addEventListener("click", () => this.setHome(null));
    const copyBtn = this.root.querySelector<HTMLButtonElement>("[data-copy]")!;
    copyBtn.addEventListener("click", async () => {
      if (await copyText(this.composed.value, this.composed)) {
        copyBtn.textContent = this.copy.copiedShort;
        window.setTimeout(() => (copyBtn.textContent = this.copy.copy), 2000);
      }
    });
    for (const name of ["name", "message"]) {
      (form.elements.namedItem(name) as HTMLElement | null)?.addEventListener("input", () => this.showErrors({}, name));
    }
  }

  reset() {
    this.form.reset();
    this.setHome(null);
    this.showErrors({});
    this.form.hidden = false;
    this.done.hidden = true;
    this.status("");
  }

  applyPreset(preset: EnquiryPreset) {
    const els = this.form.elements;
    if (preset.interest) {
      const radio = this.form.querySelector<HTMLInputElement>(`input[name="interest"][value="${preset.interest}"]`);
      if (radio) radio.checked = true;
    }
    if (preset.type) (els.namedItem("propertyType") as HTMLSelectElement).value = preset.type;
    this.setHome(preset.home ?? null);
  }

  focusFirst() {
    (this.form.elements.namedItem("name") as HTMLInputElement).focus();
  }

  private setHome(slug: string | null) {
    const home = slug ? this.config.homes[slug] : undefined;
    const chip = this.root.querySelector<HTMLElement>("[data-home-chip]")!;
    chip.hidden = !home;
    (this.form.elements.namedItem("home") as HTMLInputElement).value = home ? slug! : "";
    this.root.querySelector("[data-home-title]")!.textContent = home?.title ?? "";
  }

  private status(text: string) {
    this.root.querySelector("[data-form-status]")!.textContent = text;
  }

  private showErrors(errors: EnquiryErrors, only?: string) {
    const messages = {
      name: errors.name === "required" ? this.config.copy.errors.name : errors.name ? this.config.copy.errors.nameLength : "",
      message: errors.message ? this.config.copy.errors.message : "",
    };
    for (const [field, msg] of Object.entries(messages)) {
      if (only && only !== field) continue;
      const input = this.form.elements.namedItem(field) as HTMLInputElement | null;
      input?.setAttribute("aria-invalid", msg ? "true" : "false");
      this.root.querySelector(`[data-error-for="${field}"]`)!.textContent = msg;
    }
  }

  private async submit() {
    if (this.busy) return;
    const raw = Object.fromEntries(new FormData(this.form));
    const slug = typeof raw.home === "string" ? raw.home : "";
    const input = readEnquiry(raw, this.config.homes[slug] ?? null);
    const errors = validateEnquiry(input);
    this.showErrors(errors);
    const firstInvalid = (["name", "message"] as const).find((f) => errors[f]);
    if (firstInvalid) {
      (this.form.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }

    if (this.config.endpoint) {
      await this.send(input);
      return;
    }

    const text = composeMessage(input);
    this.composed.value = text;
    const copied = await copyText(text, this.composed);
    this.root.querySelector("[data-done-title]")!.textContent = this.copy.title;
    this.root.querySelector("[data-done-text]")!.textContent = copied ? this.copy.copied : this.copy.manual;
    this.form.hidden = true;
    this.done.hidden = false;
    this.done.focus();
  }

  private async send(input: ReturnType<typeof readEnquiry>) {
    const button = this.form.querySelector<HTMLButtonElement>("[data-submit]")!;
    this.busy = true;
    button.disabled = true;
    this.status(this.config.copy.sending);
    try {
      const res = await fetch(this.config.endpoint!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(input)),
      });
      if (!res.ok) throw new Error(String(res.status));
      this.root.querySelector("[data-done-title]")!.textContent = this.copy.endpointSuccess.title;
      this.root.querySelector("[data-done-text]")!.textContent = this.copy.endpointSuccess.text;
      for (const el of this.done.querySelectorAll<HTMLElement>("[data-composed], [data-handoff-actions], [data-handoff-note]")) el.hidden = true;
      this.form.hidden = true;
      this.done.hidden = false;
      this.done.focus();
    } catch {
      this.status(this.copy.endpointError);
    } finally {
      this.busy = false;
      button.disabled = false;
    }
  }
}

function presetFromSearch(): EnquiryPreset {
  const p = new URLSearchParams(window.location.search);
  return {
    interest: (p.get("interest") as EnquiryPreset["interest"]) ?? undefined,
    type: (p.get("type") as EnquiryPreset["type"]) ?? undefined,
    home: p.get("home") ?? undefined,
  };
}

export function initEnquiry() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-enquiry-dialog]");
  let dialogCtrl: EnquiryController | null = null;

  for (const form of document.querySelectorAll<HTMLFormElement>("[data-enquiry-form]")) {
    const ctrl = new EnquiryController(form);
    if (dialog?.contains(form)) dialogCtrl = ctrl;
    else ctrl.applyPreset(presetFromSearch()); // /enquire page
  }
  if (!dialog || !dialogCtrl) return;

  let opener: HTMLElement | null = null;
  document.addEventListener("click", (e) => {
    const trigger = (e.target as Element).closest<HTMLElement>("[data-enquire]");
    if (!trigger || e.defaultPrevented || (e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey) return;
    e.preventDefault();
    opener = trigger;
    dialogCtrl!.reset();
    dialogCtrl!.applyPreset(JSON.parse(trigger.dataset.enquire || "{}") as EnquiryPreset);
    document.querySelector<HTMLDialogElement>("[data-menu]")?.close();
    dialog.showModal();
    lockScroll(true);
    dialogCtrl!.focusFirst();
  });
  dialog.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  // Click on the backdrop (outside the card) closes.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    lockScroll(false);
    opener?.focus();
  });
}
