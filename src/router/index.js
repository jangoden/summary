import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

// Import komponen admin yang baru dibuat
import LoginView from "../views/admin/LoginView.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import CreateArticleView from "../views/admin/CreateArticleView.vue";
import EditArticleView from "../views/admin/EditArticleView.vue";

const routes = [
  // --- RUTE PUBLIK (YANG SUDAH ADA) ---
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/portfolio",
    name: "portfolio",
    component: () =>
      import(/* webpackChunkName: "portfolio" */ "../views/PortfolioView.vue"),
  },
  {
    path: "/blog",
    name: "blog",
    component: () =>
      import(/* webpackChunkName: "blog" */ "../views/BlogView.vue"),
  },
  {
    path: "/read/:slug/:id",
    name: "read",
    component: () =>
      import(/* webpackChunkName: "article" */ "../views/ArticleView.vue"),
  },

  // --- RUTE ADMIN BARU ---
  {
    path: "/admin/login",
    name: "admin-login",
    component: LoginView,
  },
  {
    path: "/admin/dashboard",
    name: "admin-dashboard",
    component: DashboardView,
    meta: { requiresAuth: true }, // Penanda untuk rute yang butuh login
  },
  {
    path: "/admin/create",
    name: "admin-create",
    component: CreateArticleView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/edit/:id", // Menggunakan parameter dinamis untuk ID artikel
    name: "admin-edit",
    component: EditArticleView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
