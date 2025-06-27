import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "../../../utils/baseUrl";
import { useNavigate } from "react-router-dom";

import { ArrowPathIcon } from "@heroicons/react/24/solid";



export function Users() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    username:"",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
// Utility to generate a random password
const generatePassword = (length = 10) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const handleGeneratePassword = () => {
  const newPassword = generatePassword();
  setForm((prev) => ({ ...prev, password: newPassword }));
};

  const token = Cookies.get("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("ss",res)
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
const toggleActivation = async (userId) => {
  try {
    const res = await axios.put(`${baseUrl}/toggle-user/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchUsers(); // Refresh list
  } catch (err) {
    console.error("Failed to toggle activation:", err);
  }
};

  const handleOpen = () => setOpen(!open);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

  

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/create-admin`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.status === 201) {
        handleOpen();
        setForm({
          nom: "",
          prenom: "",
          email: "",
          password: "",
        });
        fetchUsers(); // refresh table
      } else {
        setError(res.data.message || "Registration failed.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
    <div className="flex justify-end mr-6">
  <Button onClick={handleOpen} className="flex items-center gap-2">
    <UserPlusIcon className="h-5 w-5" />
    Add User
  </Button>
</div>


      {/* Table */}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Admin Users
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["name","resto name", "email", "created at", "status", ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === users.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                return (
                  <tr key={user._id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}`}
                          alt={user.nom}
                          size="sm"
                          variant="rounded"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {user.nom} {user.prenom}
                        </Typography>
                      </div>
                    </td>
                     <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {user.username}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {user.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                 <td className={className}>
  <Chip
    value={user.active ? "Active" : "Inactive"}
    color={user.active ? "green" : "red"}
    className="py-0.5 px-2 text-[11px] font-medium w-fit"
  />
</td>
<td className={className}>
  <Button
    onClick={() => toggleActivation(user._id)}
    size="sm"
    color={user.active ? "red" : "green"}
    variant="outlined"
    className="text-xs"
  >
    {user.active ? "Deactivate" : "Activate"}
  </Button>
</td>

                    <td className={className}>
                      <Typography
                        as="a"
                        href="#"
                        className="text-xs font-semibold text-blue-gray-600"
                      >
                        Edit
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Dialog */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Add New User</DialogHeader>
        <DialogBody divider>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Typography color="red" className="text-sm">
                {error}
              </Typography>
            )}
            <Input
              name="nom"
              value={form.nom}
              onChange={handleChange}
              label="Firstname"
              size="lg"
            />
            <Input
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              label="Lastname"
              size="lg"
            />
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              label="Restaurant Name"
              size="lg"
            />
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              label="Email"
              type="email"
              size="lg"
            />
           <div className="relative">
  <Input
    name="password"
    value={form.password}
    onChange={handleChange}
    label="Password"
    type="text"
    size="lg"
  />
  <ArrowPathIcon
    onClick={handleGeneratePassword}
    className="h-5 w-5 text-blue-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
  />
</div>

          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleOpen}>
            Cancel
          </Button>
          <Button
       
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Users;
