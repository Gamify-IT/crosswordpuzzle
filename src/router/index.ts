import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Crosswordpuzzle from "../views/Crosswordpuzzle.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/crosswordpuzzle",
      name: "crosswordpuzzle",
      component: Crosswordpuzzle,
      props: true,
    },
  ],
});

export default router;
