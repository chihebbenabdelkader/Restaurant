import cookie from "js-cookie";

export const handleLogin = (token) => {
  cookie.set("token", token, {
    expires: 7,
    path: "/",
  });
};

export const handleLogout = () => {
  cookie.remove("token", { path: "/" });
};
