import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/layout/Layout.vue";

Vue.use(Router);

export const menuRoutes = [{
  path: "/manager/",
  name: "图书管理",
  component: Layout,
  children: [{
    path: "book",
    name: "图书管理",
    component: () =>
      import("./views/manager/Book.vue")
  }, {
    path: "borrow",
    name: "借阅管理",
    component: () =>
      import("./views/borrow/index.vue")
  }, {
    path: "statistics",
    name: "图书统计",
    component: () =>
      import("./views/statistics/index.vue")
  }]
}];

let homeRoute = [{
  path: '/index2.html',
  name: 'index',
  redirect: '/home'
},{
  path: "/",
  redirect: "/home",
  component: Layout,
  children: [{
    path: 'home',
    name: "首页",
    component: () =>
      import("./views/home/index.vue")
  }]
}]

let routes = homeRoute.concat(menuRoutes);

export default new Router({
  mode: "hash",
  // base: process.env.BASE_URL,
  // scrollBehavior: () => ({
  //   y: 0
  // }),
  routes: routes
});