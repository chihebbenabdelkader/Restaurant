import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { Routes, Route } from "react-router-dom";
import { Dashboard ,Menu} from "@/layouts";
import ProtectedRoute from "./context/protectedRoute";
import { SignIn, SignUp } from "./pages/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    async function verifyToken() {
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
      } catch {
        setUser(null);
        Cookies.remove("token");
      } finally {
        setLoadingUser(false);
      }
    }
    verifyToken();
  }, []);

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
       {/* PUBLIC MENU ROUTE — NO PROTECTION */}
      <Route path="/menu/*" element={<Menu />} />


      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}

export default App;
