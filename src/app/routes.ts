import { createElement as h } from "react";
import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { DashboardHome } from "./components/DashboardHome";
import { DashboardTeachers } from "./components/DashboardTeachers";
import { DashboardTeacherProfile } from "./components/DashboardTeacherProfile";
import { DashboardCourses } from "./components/DashboardCourses";
import { DashboardMyCourses } from "./components/DashboardMyCourses";
import { DashboardCheckout } from "./components/DashboardCheckout";
import { DashboardLiveClasses } from "./components/DashboardLiveClasses";
import { DashboardCourseView } from "./components/DashboardCourseView";
import { DashboardCreateCourse } from "./components/DashboardCreateCourse";
import { DashboardSchedule } from "./components/DashboardSchedule";
import { DashboardProfile } from "./components/DashboardProfile";
import { DashboardHelp } from "./components/DashboardHelp";
import { NotFound } from "./components/NotFound";
import { RequireAuth, RequireRole, RedirectIfAuth } from "./components/RouteGuards";

// Envolve uma página de dashboard exigindo autenticação.
const auth = (Component: ComponentType) => h(RequireAuth, null, h(Component));

// Envolve uma página exigindo papel específico (já inclui autenticação).
const role = (r: "aluno" | "professor", Component: ComponentType) =>
  h(RequireRole, { role: r }, h(Component));

export const router = createBrowserRouter([
  { path: "/", element: h(RedirectIfAuth, null, h(Login)) },
  { path: "/register", element: h(RedirectIfAuth, null, h(Register)) },

  { path: "/dashboard", element: auth(DashboardHome) },
  { path: "/dashboard/teachers", element: auth(DashboardTeachers) },
  { path: "/dashboard/teachers/:id", element: auth(DashboardTeacherProfile) },
  { path: "/dashboard/courses", element: auth(DashboardCourses) },
  { path: "/dashboard/my-courses", element: auth(DashboardMyCourses) },
  { path: "/dashboard/create-course", element: role("professor", DashboardCreateCourse) },
  { path: "/dashboard/availability", element: role("professor", DashboardSchedule) },
  { path: "/dashboard/courses/:id", element: auth(DashboardCourseView) },
  { path: "/dashboard/agenda", element: auth(DashboardLiveClasses) },
  { path: "/dashboard/checkout/:id", element: auth(DashboardCheckout) },
  { path: "/dashboard/profile", element: auth(DashboardProfile) },
  { path: "/dashboard/help", element: auth(DashboardHelp) },

  { path: "*", element: h(NotFound) },
]);
