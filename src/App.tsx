import React from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}