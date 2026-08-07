import { createBrowserRouter } from "react-router-dom";
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

const routes = createBrowserRouter([
  {
    path: "/",
    element: <RedirectIfAuth />, 
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  },

  // Grupo de Rotas do Dashboard (Privadas)
  {
    path: "/dashboard",
    element: <RequireAuth />, 
    children: [
      {
        path: "",
        element: <DashboardHome />
      },
      {
        path: "teachers",
        element: <DashboardTeachers />
      },
      {
        path: "teachers/:id",
        element: <DashboardTeacherProfile />
      },
      {
        path: "courses",
        element: <DashboardCourses />
      },
      {
        path: "my-courses",
        element: <DashboardMyCourses />
      },
      {
        path: "create-course",
        element: (
          <RequireRole role="PROFESSOR">
            <DashboardCreateCourse />
          </RequireRole>
        )
      },
      {
        path: "availability",
        element: (
          <RequireRole role="PROFESSOR">
            <DashboardSchedule />
          </RequireRole>
        )
      },
      {
        path: "courses/:id",
        element: <DashboardCourseView />
      },
      {
        path: "agenda",
        element: <DashboardLiveClasses />
      },
      {
        path: "checkout/:id",
        element: <DashboardCheckout />
      },
      {
        path: "profile",
        element: <DashboardProfile />
      },
      {
        path: "help",
        element: <DashboardHelp />
      }
    ]
  },

  // Rota de fallback (404)
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;