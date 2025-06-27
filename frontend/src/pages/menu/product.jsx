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
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "../../../utils/baseUrl";

export function ProductManagement() {
  const token = Cookies.get("token");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
  });

  // For the selected image file
  const [selectedFile, setSelectedFile] = useState(null);
  // For previewing the image when editing or selecting
  const [imagePreview, setImagePreview] = useState(null);

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get(`${baseUrl}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/product`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddDialog = () => {
    setEditingProduct(null);
    setProductData({ name: "", price: "", description: "", categoryId: "" });
    setSelectedFile(null);
    setImagePreview(null);
    setOpenDialog(true);
  };

  const openEditDialog = (prod) => {
    setEditingProduct(prod);
    setProductData({
      name: prod.name,
      price: prod.price,
      description: prod.description,
      categoryId:
        typeof prod.categoryId === "object" && prod.categoryId !== null
          ? prod.categoryId._id
          : prod.categoryId,
    });

    setSelectedFile(null);
    // If product has an image URL, show preview
    if (prod.image) {
      setImagePreview(prod.image);
    } else {
      setImagePreview(null);
    }

    setOpenDialog(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Show preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description);
      formData.append("categoryId", productData.categoryId);

      // Only append image if a new file is selected
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (editingProduct) {
        await axios.put(`${baseUrl}/product/${editingProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${baseUrl}/product`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Save product failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${baseUrl}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  };

  return (
    <div className="mt-12 mb-8 space-y-6">
      <div className="flex justify-end mr-6">
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> Add Product
        </Button>
      </div>
      <br></br>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Products
          </Typography>
        </CardHeader>
        <CardBody>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left">Image</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} className="border-b">
                  <td className="px-5 py-3">
                    {prod.image ? (
                      <img
                        src={`${baseUrl}${prod.image}`}
                        alt={prod.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="px-5 py-3">{prod.name}</td>
                  <td className="px-5 py-3">{prod.price}</td>
                  <td className="px-5 py-3">{prod.description}</td>
                  <td className="px-5 py-3">
                    {typeof prod.categoryId === "object" && prod.categoryId !== null
                      ? prod.categoryId.name
                      : categories.find((cat) => cat._id === prod.categoryId)?.name ||
                        "N/A"}
                  </td>
                  <td className="px-5 py-3 space-x-2">
                    <Button
                      size="sm"
                      color="blue"
                      variant="outlined"
                      onClick={() => openEditDialog(prod)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      variant="outlined"
                      onClick={() => handleDelete(prod._id)}
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
        <DialogHeader>{editingProduct ? "Edit Product" : "Add Product"}</DialogHeader>
        <DialogBody divider className="space-y-4">
          <Input
            label="Product Name"
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
          <Input
            type="number"
            label="Price"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />
          <Input
            label="Description"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />
          <select
            className="w-full rounded border border-gray-300 p-2"
            value={productData.categoryId}
            onChange={(e) =>
              setProductData({ ...productData, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block mb-1 font-medium">Product Image</label>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {imagePreview ? (
              <img
                src={
                  imagePreview.startsWith("http") || imagePreview.startsWith("data:")
                    ? imagePreview
                    : `${baseUrl}${imagePreview}`
                }
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              />
            ) : (
              <Button
                variant="outlined"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingProduct ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProductManagement;
