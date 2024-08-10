import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  projectId: process.env.PROJECT_ID,
  e2e: {
    baseUrl: process.env.BASE_URL,
  },
  env: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    sessionSecret: process.env.OAUTH2_TOKEN,
  },
});
