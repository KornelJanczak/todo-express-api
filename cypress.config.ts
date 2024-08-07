import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  projectId: '5x15rw',
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    sessionSecret: process.env.OAUTH2_TOKEN,
  },
});
