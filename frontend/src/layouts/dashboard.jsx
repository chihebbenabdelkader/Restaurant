import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useAuth } from '@/context/AuthContext';

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { user } = useAuth();

  // Filter all routes by user role (both dashboard and menu)
  const filteredRoutes = routes
    .map(({ layout, title, pages }) => ({
      layout,
      title,
      pages: pages.filter(
        (page) => !page.roles || page.roles.includes(user?.role || "guest")
      ),
    }))
    .filter(({ pages }) => pages.length > 0);

  console.log("USER ROLE:DASH", user?.role);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={filteredRoutes} // Pass all filtered routes for sidenav
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        <Routes>
          {filteredRoutes
            .filter(({ layout }) => layout === "dashboard") // Only dashboard routes here
            .flatMap(({ pages }) =>
              pages.map(({ path, element }) => (
                <Route key={path} exact path={path} element={element} />
              ))
            )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}



Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
