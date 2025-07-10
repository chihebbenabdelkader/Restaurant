import { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";

export function MenuView() {
  const token = Cookies.get("token");
  const { adminId, tableNumber } = useParams();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [restaurantName, setRestaurantName] = useState("");
  const [categories, setCategories] = useState([]);
  const [openWelcomeDialog, setOpenWelcomeDialog] = useState(!!adminId && !!tableNumber);
  const [loading, setLoading] = useState(false);

  // New state to store table info fetched by adminId and tableNumber
  const [tableInfo, setTableInfo] = useState(null);

  // Fetch products for admin
  const fetchProducts = async () => {
    try {
      const prodRes = await axios.get(`${baseUrl}/product/byAdmin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const productsData = prodRes.data;
      setProducts(productsData);

      // Extract unique categories from products
      const uniqueCategoriesMap = {};
      productsData.forEach((product) => {
        const category = product.categoryId;
        if (category && category._id && !uniqueCategoriesMap[category._id]) {
          uniqueCategoriesMap[category._id] = category;
        }
      });
      setCategories(Object.values(uniqueCategoriesMap));
    } catch (err) {
      console.error("Failed to fetch menu for table:", err);
    }
  };

  // Fetch admin (restaurant) details
  const fetchAdminDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/user/public/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setRestaurantName(res.data.restauName || "notre restaurant");
    } catch (err) {
      console.error("Erreur lors de la récupération du nom du restaurant:", err);
      setRestaurantName("notre restaurant");
    }
  };

  // NEW: Fetch table info by adminId and tableNumber
// NEW: Fetch table info from public endpoint
const fetchTableInfo = async () => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/public-menu/${adminId}/${tableNumber}`
    );
    setTableInfo(res.data.table); // we only care about the table object
  } catch (err) {
    console.error("Erreur lors de la récupération des infos de la table:", err);
    setTableInfo(null);
  }
};


  useEffect(() => {
    if (adminId && tableNumber) {
      setOpenWelcomeDialog(true); // Open dialog if route params exist
    }

    if (adminId) {
      fetchProducts();
      fetchAdminDetails();
    }

    if (adminId && tableNumber) {
      fetchTableInfo();
    }
  }, [adminId, tableNumber]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => {
          const catId =
            typeof product.categoryId === "object"
              ? product.categoryId._id
              : product.categoryId;
          return catId === selectedCategory;
        });

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-4">
      {openWelcomeDialog && (
        <Dialog
          open={openWelcomeDialog}
          handler={() => setOpenWelcomeDialog(false)}
          size="sm"
        >
          <DialogHeader className="flex flex-col items-center gap-2 pb-0">
            <HomeIcon className="h-12 w-12 text-green-600" />
            <Typography variant="h4" color="green" className="text-center mt-2">
              Bienvenue chez {restaurantName} !
            </Typography>
          </DialogHeader>
          <DialogBody divider className="pt-2 text-center">
            <Typography className="text-lg font-semibold text-blue-gray-800">
              Vous êtes actuellement à la{" "}
              <span className="text-pink-600 text-xl font-bold">Table numéro {tableNumber}</span>.
            </Typography>
            {tableInfo && tableInfo.status && (
              <Typography className="mt-2 text-md text-gray-700 font-medium">
                Statut de la table : <strong>{tableInfo.status}</strong>
              </Typography>
            )}
            <Typography className="mt-4 text-md text-gray-700">
              Préparez-vous à découvrir notre délicieux menu et à passer votre commande en toute
              simplicité.
            </Typography>
          </DialogBody>
          <DialogFooter className="justify-center pt-2">
            <Button
              variant="gradient"
              color="green"
              onClick={() => setOpenWelcomeDialog(false)}
              className="text-lg py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Voir le menu
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-green-900 mb-10">
          Menu <span className="text-pink-600 text-2xl">❤️</span>
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-6 mb-12 text-lg font-medium text-gray-700 overflow-x-auto">
          <span
            onClick={() => setSelectedCategory("all")}
            className={`cursor-pointer hover:text-green-700 ${
              selectedCategory === "all" ? "text-green-900 font-bold" : ""
            }`}
          >
            All
          </span>

          {categories.map((cat) => (
            <span
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`cursor-pointer hover:text-green-700 ${
                selectedCategory === cat._id ? "text-green-900 font-bold" : ""
              }`}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 col-span-2">Aucun produit disponible.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="flex items-start gap-4 border-b pb-6">
                {product.image && (
                  <img
                    src={`${baseUrl}${product.image}`}
                    alt={product.name}
                    className="w-32 h-24 object-cover rounded-xl border-2 border-green-400 shadow-sm"
                  />
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-800 font-semibold text-lg">{product.name}</h3>
                    <span className="text-gray-700 font-semibold text-sm">{product.price} DT</span>
                  </div>
                  <hr className="border-dashed border-green-400 my-1" />
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuView;
