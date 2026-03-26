import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const found = routes.find((r) =>
      location.pathname.includes(r.layout + "/" + r.path.replace("/*", ""))
    );
    if (found) setCurrentRoute(found.name);
  }, [location.pathname]);

  const getActiveNavbar = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        location.pathname.includes(
          routes[i].layout + "/" + routes[i].path.replace("/*", "")
        )
      ) {
        return routes[i].secondary || false;
      }
    }
    return false;
  };

  const getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      }
      return null;
    });

  document.documentElement.dir = "ltr";

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {open && (
        <div
          className="bg-black/30 fixed inset-0 z-40 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col bg-gray-50 dark:bg-[#051d28]">
        <main className="flex-1 transition-all duration-300 md:pr-2 xl:ml-[260px]">
          <Navbar
            onOpenSidenav={() => setOpen(true)}
            logoText={"The Correct Steps"}
            brandText={currentRoute}
            secondary={getActiveNavbar(routes)}
            {...rest}
          />

          <div className="w-full p-2 md:pr-2">
            <Routes>
              {getRoutes(routes)}
              <Route
                path="/"
                element={<Navigate to="/admin/default" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
