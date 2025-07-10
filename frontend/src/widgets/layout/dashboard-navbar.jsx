import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
console.log("user",user)
  // Fetch user from token cookie on mount
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/auth/verifToken`,
          { token },
          { withCredentials: true }
        );
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          Cookies.remove("token");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setUser(null);
        Cookies.remove("token");
      } finally {
        setLoadingUser(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    setUser(null);
    navigate("/auth/sign-in");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Show loading spinner or something if loading user? */}
          {loadingUser ? (
            <Typography className="text-sm px-4">Loading...</Typography>
          ) : user ? (
            // Show user name and dropdown menu with logout
            <Menu>
            <MenuHandler>
  <Button
    variant="text"
    color="blue-gray"
    className="flex items-center gap-2 normal-case"
  >
    <Avatar
      src={user.photo || undefined}
      alt={user.photo}
      size="sm"
      variant="circular"
    />
    {`${user.nom} ${user.prenom}`}
    {/* Ajoutez l'icône ChevronDownIcon ici */}
    <ChevronDownIcon strokeWidth={2.5} className="h-3 w-3" />
  </Button>
</MenuHandler>
              <MenuList>
                <MenuItem disabled>
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    Signed in as <strong>{user.email}</strong>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            // If no user, show sign in buttons
            <>
              <Link to="/auth/sign-in">
                <Button
                  variant="text"
                  color="blue-gray"
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Sign In
                </Button>
                <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                </IconButton>
              </Link>
            </>
          )}

          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuList className="w-max border-0">
              <MenuItem>Notification 1</MenuItem>
              <MenuItem>Notification 2</MenuItem>
              {/* Ajoutez plus de MenuItem selon vos besoins */}
            </MenuList>
            </MenuList>
          </Menu>

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
