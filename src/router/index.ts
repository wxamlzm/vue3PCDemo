import { createRouter, createWebHistory } from "vue-router";

// 静态路由 - 不需要权限控制的基础路由
export const constantRoutes = [
  // {
  //   path: "/login",
  //   name: "Login",
  //   component: () => import("@/views/login/index.vue"),
  //   hidden: true,
  // },
];

// 动态路由模板
export const asyncRoutes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/ResourceManagement",
    name: "ResourceManagement",
    component: () =>
      import("../views/ResourceManagement/ResourceManagement.vue"),
  },
  {
    path: "/ResourceRequestDetail",
    name: "ResourceRequestDetail",
    component: () =>
      import("../views/ResourceManagement/ResourceManagement.vue"),
  },
  {
    path: "/ApplyAdd",
    name: "ApplyAdd",
    component: () => import("../views/ResourceApplication/ApplyAdd.vue"),
  },
];

const isDevelopment = import.meta.env.NODE_ENV === "development";

// 根据环境决定初始路由
const initialRoutes = isDevelopment
  ? [
      ...constantRoutes,
      ...asyncRoutes,
      { path: "/:pathMatch(.*)*", redirect: "/404", hidden: true },
    ]
  : constantRoutes;

const router = createRouter({
  history: createWebHistory(),
  routes: initialRoutes,
});

export default router;
