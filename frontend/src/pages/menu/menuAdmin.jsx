import { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../../../utils/baseUrl";
import Cookies from "js-cookie";

export function MenuViewAdmin() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,  // add this line to send cookies

        }; 

        const prodRes = await axios.get(`${baseUrl}/product`, config);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [token]);

  // Get unique categories from products (with populated categoryId)
  const categories = [
    ...new Map(
      products
        .filter((p) => p.categoryId && typeof p.categoryId === "object")
        .map((p) => [p.categoryId._id, p.categoryId])
    ).values(),
  ];

  // Filter products based on selected category
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-center text-green-900 mb-10">
          Menu <span className="text-pink-600 text-2xl">❤️</span>
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-6 mb-12 text-lg font-medium text-gray-700">
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
            <p className="text-center text-gray-500 col-span-2">
              No products available.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-start gap-4 border-b pb-6"
              >
                {product.image && (
                  <img
                    src={`${baseUrl}${product.image}`}
                    alt={product.name}
                    className="w-32 h-24 object-cover rounded-xl border-2 border-green-400 shadow-sm"
                  />
                )}

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-800 font-semibold text-lg">
                      {product.name}
                    </h3>
                    <span className="text-gray-700 font-semibold text-sm">
                      ${product.price}
                    </span>
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

export default MenuViewAdmin;
