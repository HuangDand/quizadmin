import Vue from "vue";
import Router from "vue-router";

import UserView from "@/views/UserView.vue";
import QuizView from "@/views/QuizView.vue";

Vue.use(Router);

const router = new Router({
  mode: "hash",

  routes: [
    {
      path: "/",
      redirect: "/user"
    },
    {
      path: "/user",
      name: "UserView",
      component: UserView
    },
    {
      path: "/quiz",
      name: "QuizView",
      component: QuizView
    }
  ]
});

export default router;