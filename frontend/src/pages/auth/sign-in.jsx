import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleLogin as setLoginCookie } from "../../../utils/auth";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { useAuth } from '../../context/authContext';

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post(
      `${baseUrl}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Response", res);
    if (res.data.statue) {
      setLoginCookie(res.data.token);
              login(res.data.user, res.data.token);

      navigate("/dashboard/home");
    } else {
      setError(res.data.message || "Erreur lors de la connexion");
    }
  } catch (err) {
    const errorData = err.response?.data;
    const errorMessage =
      typeof errorData === "string"
        ? errorData
        : errorData?.message || "Erreur lors de la connexion";

    setError(errorMessage);
  }
};


  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form
          onSubmit={handleLogin}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          {error && (
            <Typography color="red" className="text-sm mb-4">
              {error}
            </Typography>
          )}
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your email
            </Typography>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              placeholder="Your email"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
           <div className="relative">
  <Input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    size="lg"
    placeholder="********"
    className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-12"
    labelProps={{
      className: "before:content-none after:content-none",
    }}
  />
  <div
    className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
    ) : (
      <EyeIcon className="h-5 w-5 text-gray-500" />
    )}
  </div>
</div>

          </div>
         
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
          {/* ... rest of form unchanged */}
        </form>
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
             Don't have an account?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Sign up</Link>
          </Typography>
      </div>
        
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
