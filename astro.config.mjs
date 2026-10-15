// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Placeholder until the client confirms a domain (see docs/design-system.md, Open items).
  site: "https://venora-dubai.example",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  // "class" passes a component's scope through the `class` prop, so parent styles reach child roots.
  scopedStyleStrategy: "class",
  image: { responsiveStyles: false },
  build: { inlineStylesheets: "auto" },
});
