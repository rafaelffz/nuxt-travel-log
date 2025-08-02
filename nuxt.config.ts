import tailwindcss from "@tailwindcss/vite";

import "./lib/env";

/* eslint-disable node/no-process-env */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "motion-v/nuxt",
    "nuxt-csurf",
    "nuxt-maplibre",
    "@vueuse/nuxt",
    "@sentry/nuxt/module",
  ],

  css: ["~/assets/css/main.css"],

  eslint: {
    config: {
      standalone: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["maplibre-gl"],
    },
  },

  colorMode: {
    dataValue: "theme",
  },

  app: {
    head: {
      title: "MyTravlo",
    },
  },

  runtimeConfig: {
    tursoDatabaseUrl: process.env.TURSO_DATABASE_URL,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    authGithubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
    authGithubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3AccessSecret: process.env.S3_ACCESS_SECRET,

    public: {
      s3Endpoint: process.env.S3_ENDPOINT || "",
      s3PubEndpoint: process.env.S3_PUB_ENDPOINT || "",
      s3Bucket: process.env.S3_BUCKET || "",
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: import.meta.env.SENTRY_ORG,
      project: import.meta.env.SENTRY_PROJECT,
    },

    autoInjectServerSentry: "top-level-import",
  },

  sourcemap: {
    client: "hidden",
  },
});
