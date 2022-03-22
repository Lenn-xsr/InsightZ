import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/Home.vue";
import Courses from "@/views/Courses.vue";
import Course from "@/views/Course.vue";
import Portfolio from "@/views/Portfolio.vue";
import Mercado3D from "@/views/Mercado3D.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/cursos",
    name: "Courses",
    component: Courses,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login-group" */ "@/views/Sign/Login.vue"),
  },
  {
    path: "/login/recovery",
    name: "Recovery",
    component: () =>
      import(/* webpackChunkName: "login-group" */ "@/views/Sign/Recovery.vue"),
  },
  {
    path: "/login/reset",
    name: "Reset",
    component: () =>
      import(/* webpackChunkName: "login-group" */ "@/views/Sign/Reset.vue"),
  },
  {
    path: "/curso/:cid",
    name: "Course",
    props: true,
    component: Course,
  },
  {
    path: "/curso/:cid/:lid",
    name: "Lesson",
    props: true,
    component: Course,
  },
  {
    path: "/user",
    component: () =>
      import(/* webpackChunkName: "user-group" */ "@/views/User/User.vue"),
    children: [
      {
        path: "",
        name: "User",
        component: () =>
          import(
            /* webpackChunkName: "user-group" */ "@/views/User/Routes/Arts.vue"
          ),
      },
      {
        path: "edit",
        name: "Edit",
        component: () =>
          import(
            /* webpackChunkName: "user-group" */ "@/views/User/Routes/Edit.vue"
          ),
      },
    ],
  },
  {
    path: "/dashboard",
    component: () =>
      import(
        /* webpackChunkName: "management-group" */ "@/views/Management/Dashboard.vue"
      ),
    children: [
      {
        path: "",
        name: "EditCourses",
        component: () =>
          import(
            /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Courses.vue"
          ),
      },
      {
        path: "users",
        name: "Users",
        component: () =>
          import(
            /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Users.vue"
          ),
      },
      {
        path: "depositions",
        name: "Depositions",
        component: () =>
          import(
            /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Depositions.vue"
          ),
      },
      {
        path: "faqs",
        name: "Faqs",
        component: () =>
          import(
            /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Faqs.vue"
          ),
      },
      {
        path: "course/:id",
        props: true,
        name: "editCourse",
        component: () =>
          import(
            /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Course.vue"
          ),
        children: [
          {
            path: "lesson/new",
            name: "newLesson",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Lesson.vue"
              ),
          },
          {
            path: "lesson/:lid/edit",
            name: "editLesson",
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "management-group" */ "@/views/Management/Routes/Lesson.vue"
              ),
          },
        ],
      },
    ],
  },
  {
    path: "/mercado3d",
    name: "Mercado3D",
    component: Mercado3D,
  },
  {
    path: "/:id",
    name: "Portfolio",
    component: Portfolio,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    if (to.hash)
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace(/#/, ""));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({ block: "end", behavior: "smooth" });
        }
      }, 500);
    else return { top: 0, behavior: "smooth" };
  },
});

export default router;
