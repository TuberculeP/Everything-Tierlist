// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase"],
  saucisse: {
    web: {
      client_id:
        "388730330015-rtcjgcmqj8h2760ppj2v4phov0r421vd.apps.googleusercontent.com",
      project_id: "everything-tierlist",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_secret: "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",
      redirect_uris: [
        "https://shfsniasdorfayoipek.supabase.co/auth/v1/callback",
      ],
      javascript_origins: [
        "https://everything-tierlist.vercel.app",
        "http://localhost:3000",
      ],
    },
  },
});
