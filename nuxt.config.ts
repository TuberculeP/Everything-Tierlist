// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "nuxt-icon"],
  plugins: ["plugins/toaster"],
  css: ["vue-toast-notification/dist/theme-default.css"],
});
