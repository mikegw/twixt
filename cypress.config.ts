import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 375,
  viewportHeight: 667,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
