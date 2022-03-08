import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'


import routes from './routes'
import App from "./App.vue";


const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

createApp(App)
.use(router)
.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})
.mount("#app");
