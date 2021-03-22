import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import routes from "voie-pages";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import "tailwindcss/tailwind.css";

import App from "./app.vue";

createApp(App).use(router).mount("#app");
