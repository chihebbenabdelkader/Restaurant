import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import baseUrl from "../../../utils/baseUrl";
import Cookies from "js-cookie";

export function AddUser() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
      const token = Cookies.get("token");
  
console.log('pass',form.password)
console.log('confrmpass',form.confirmPassword)

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // ✅ Vérification côté frontend
  if (form.password !== form.confirmPassword) {
    return setError("Mot de passe et confirme mot de passe ne sont pas identiques !");
  }

  try {
    setLoading(true);

    const res = await axios.post(`${baseUrl}/create-admin`, form, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
console.log('confrmpass1',res)

    if (res.status === 201) {
      navigate("/dashboard/home");
    } else {
      setError(res.data.message || "Erreur lors de l'inscription");
    }
  } catch (err) {
    const message =
      err.response?.data?.message || err.response?.data || "Server error";
    setError(message);
  } finally {
    setLoading(false);
  }
};



  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Register Illustration"
        />
      </div>

      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Join Us Today
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your details to register.
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          {error && (
            <Typography color="red" className="text-sm mb-4">
              {error}
            </Typography>
          )}

          <div className="mb-1 flex flex-col gap-6">
            <Input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              size="lg"
              label="Firstname"
            />
            <Input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              size="lg"
              label="Lastname"
            />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              size="lg"
              label="Email"
            />
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              size="lg"
              label="Password"
            />
            <Input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              size="lg"
              label="Confirm Password"
            />
          </div>

          <Checkbox
            required
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black hover:underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

          <Button type="submit" className="mt-6" fullWidth disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </Button>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default AddUser;
