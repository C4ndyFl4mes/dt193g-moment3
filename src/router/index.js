import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AnimeListView from '@/views/AnimeListView.vue';
import EvaluationView from '@/views/EvaluationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/", component: HomeView
    },
    {
      path: "/anime", component: AnimeListView
    },
    {
      path: "/evaluation", component: EvaluationView
    }
  ]
});

export default router;
