import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  UserPlusIcon,
  ServerStackIcon,
  PlusIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, AddUser,Users } from "@/pages/dashboard";
import {  CategoryManagement,ProductManagement,MenuView,MenuViewAdmin} from "@/pages/menu";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <Users />,
        roles: ["super-admin"],
      },
    ],
  },
  {
  title: "menu",
  layout: "menu",
  pages: [
    {
      icon: <PlusIcon {...icon} />,
      name: "category",
      path: "/category", // no leading slash
      element: <CategoryManagement />,
      roles: ["admin"],
    },
    {
      icon: <PlusIcon {...icon} />,
      name: "product",
      path: "/product", // no leading slash
      element: <ProductManagement />,
      roles: ["admin"],
    },
  {
      icon: <PlusIcon {...icon} />,
      name: "menu",
      path: "/menuAdmin", // no leading slash
      element: <MenuViewAdmin />,
      roles: ["admin"],
    },
    //   {
    //   icon: <PlusIcon {...icon} />,
    //   name: "menu",
    //   path: "/menu", // no leading slash
    //   element: <MenuView />,
    //   roles: ["admin"],
    // },
    
  ],
}

];



export default routes;
