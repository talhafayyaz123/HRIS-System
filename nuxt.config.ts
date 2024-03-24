// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      ]
    }
  },
  router: {
    middleware: ["auth", "permission"],
    extendRoutes(routes: any) {
      routes.push({
        path: "/",
        component: "~/pages/dashboard/index.vue",
      });
    },
  },
  meta: {
    title: "Admin Portal",
  },
  /*
  ** Global CSS
  */

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    "~/assets/css/custom.css",
    "~/assets/sass/style.scss",
  ],
  loading: "~/components/Loading.vue",
  
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  i18n: {
    vueI18n: './nuxt-i18n.js' // custom path example
  },
  buildModules: [
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins

  plugins: [
    "~/plugins/sweetalert2.ts",
    "~/plugins/axios.ts",
    "~/plugins/apexcharts.ts",
    "~/plugins/eventBus.ts",
  ],
  runtimeConfig:{
     //apiSecret: process.env.API_SECRET,
    public: {
      apiBase: "/api",
      backEndUrl: process.env.BACKEND_URL,
      authBaseUrl: process.env.VUE_APP_AUTH_API,
      licenseServiceUrl: process.env.VUE_APP_LICENSE_SERVICE_API,
      documentServiceUrl: process.env.VUE_APP_DOCUMENT_SERVICE_API,
      authServiceBaseUrl: process.env.VITE_AUTH_SERVICE_URL,
      listUsersUrl: process.env.VUE_APP_LIST_USERS_API,
      mailServiceUrl: process.env.VITE_MAIL_SERVICE_URL,
      listProjectsUrl: `${process.env.VUE_APP_PROJECTS_API}/api`
    },
  }
    // Keys within public, will be also be
    // exposed to the client-side

})