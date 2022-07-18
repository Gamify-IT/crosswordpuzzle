import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CrosswordpuzzleView from "../views/CrosswordpuzzleView.vue";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/:id",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:id/crosswordpuzzle",
      name: "crosswordpuzzle",
      component: CrosswordpuzzleView,
      props: true,
    },
  ],
});

export default router;
