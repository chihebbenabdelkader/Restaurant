
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "../../../utils/baseUrl";

export function CategoryManagement() {
  const token = Cookies.get("token");
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
   const res = await axios.get(`${baseUrl}/category`, {
  headers: { Authorization: `Bearer ${token}` },
  withCredentials: true,  // add this line to send cookies
});

      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories failed:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddDialog = () => {
    setEditingCategory(null);
    setCategoryName("");
    setOpenDialog(true);
  };

  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await axios.put(
          `${baseUrl}/category/${editingCategory._id}`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${baseUrl}/category`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setOpenDialog(false);
      fetchCategories();
    } catch (err) {
      console.error("Save category failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${baseUrl}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Delete category failed:", err);
    }
  };

  return (
    <div className="mt-12 mb-8 space-y-6">
      <div className="flex justify-end mr-6">
        <Button
          onClick={openAddDialog}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" /> Add Category
        </Button>
      </div>
<br></br>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Categories
          </Typography>
        </CardHeader>
        <CardBody>
          <table className="w-full min-w-[320px]">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b">
                  <td className="px-5 py-3">{cat.name}</td>
                  <td className="px-5 py-3 space-x-2">
                    <Button
                      size="sm"
                      color="blue"
                      variant="outlined"
                      onClick={() => openEditDialog(cat)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      variant="outlined"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Dialog open={openDialog} handler={() => setOpenDialog(!openDialog)}>
        <DialogHeader>{editingCategory ? "Edit Category" : "Add Category"}</DialogHeader>
        <DialogBody divider>
          <Input
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            size="lg"
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingCategory ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default CategoryManagement;
