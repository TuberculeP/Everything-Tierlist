// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "nuxt-icon", "@nuxt/ui"],
  plugins: ["plugins/toaster", "plugins/chartjs"],
  css: ["vue-toast-notification/dist/theme-default.css"],
  colorMode: {
    preference: "light",
  },
});
