import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Change this if your Vite port is different
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});