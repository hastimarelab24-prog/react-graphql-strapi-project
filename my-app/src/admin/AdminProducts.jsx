import React, { useEffect, useState } from "react";
import { useOffer } from "../context/OfferContext";

const API_URL = "http://localhost:1337";

// Get the existing login token, if your app stores one.
const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login before managing products.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Convert textarea text into Strapi Blocks format.
const convertDescriptionToBlocks = (text) => {
  return text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => ({
      type: "paragraph",
      children: [
        {
          type: "text",
          text: line,
        },
      ],
    }));
};

// Read API response and show useful errors.
const getResponseData = async (response) => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || "Something went wrong");
  }

  return result;
};

const AdminProducts = () => {
  // global offer
  const { offer, loading: offerLoading } = useOffer();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    isDiscountActive: false,
    discountType: "percentage",
    discountValue: "0",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories and products from Strapi.

  const fetchProductsAndCategories = async () => {
    try {
      setFetching(true);
      setError("");

      const headers = getHeaders();

      const productUrl = 
       `${API_URL}/api/products?populate=*&pagination[pageSize]=100`;
      const response= await fetch(productUrl,{
        method:"GET",
        headers,
      })
      

      const text = await response.text();
      let result;
      try{
        result=JSON.parse(text)     
       }catch(err){
        console.error("strapi returned non-json respons:",text);
        throw new Error(`Strapi returned HTML instend of JSON.Status:${response.status}`);
       }

      if (!response.ok) {
        throw new Error(result?.error?.message || "Unable to load products");
      }

      // All products from Strapi
      setProducts(result.data || []);

      // Actual total count from Strapi
      setTotalProducts(
        result.meta?.pagination?.total ?? result.data.length ?? 0,
      );
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };



  // fetch categories
  const fetchCategories= async ()=>{
    try{
      const response = await fetch(`${API_URL}/api/categories?pagination[pageSize]=100`,
        {headers:getHeaders(),}
      );
      const result = await response.json();
      if(!response.ok){
        throw new Error(result?.error?.message || "Unable to load categories")
      }
      setCategories(result.data || []);
    }catch(err){
      console.error("fetch categories error",err);

    }
  }


  //   const fetchCategories = async () => {
  //   try {
  //     setFetching(true);
  //     setError("");
  //     const response = await fetch(
  //       `${API_URL}/api/categories?pagination[pageSize]=100&sort=name:asc`,
  //       {
  //         method: "GET",
  //         headers: getHeaders(),
  //       },
  //     );
  //     const result = await getResponseData(response);
  //     setCategories(result?.data || []);
  //   } catch (err) {
  //     console.error("fetch categories error:", err);
  //     setError(err.message);
  //   } finally {
  //     setFetching(false);
  //   }
  // };

  useEffect(() => {
    fetchProductsAndCategories();
    fetchCategories()
  }, []);

  // Handle normal inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle discount toggle.
  const handleDiscountChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isDiscountActive: e.target.checked,
    }));
  };

  // Handle multiple image selection.
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    setImages(selectedImages);
  };

  // Upload selected images to Strapi Media Library.
  const uploadImages = async () => {
    const uploadedImages = [];

    for (const image of images) {
      const imageFormData = new FormData();

      imageFormData.append("files", image);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getHeaders(),
        body: imageFormData,
      });

      const result = await getResponseData(response);

      if (Array.isArray(result)) {
        uploadedImages.push(...result);
      }
    }

    return uploadedImages;
  };

  // Add product to Strapi.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (
        !Number.isInteger(Number(formData.price)) ||
        Number(formData.price) < 0
      ) {
        throw new Error("Price must be a whole number.");
      }

      if (
        !Number.isInteger(Number(formData.stock)) ||
        Number(formData.stock) < 0
      ) {
        throw new Error("Stock must be a whole number.");
      }

      if (
        formData.isDiscountActive &&
        (!Number.isInteger(Number(formData.discountValue)) ||
          Number(formData.discountValue) < 0)
      ) {
        throw new Error("Discount value must be a whole number.");
      }

      if (images.length === 0) {
        throw new Error("Please select at least one product image.");
      }

      // Upload images first.
      const uploadedImages = await uploadImages();

      if (uploadedImages.length === 0) {
        throw new Error("Image upload failed.");
      }

      // Prepare product data.
      const productData = {
        name: formData.name.trim(),

        description: convertDescriptionToBlocks(formData.description),

        price: Number(formData.price),

        // Strapi media field.
        images: uploadedImages.map((image) => image.id),

        stock: Number(formData.stock),

        isDiscountActive: formData.isDiscountActive,

        discountType: formData.discountType,

        discountValue: formData.isDiscountActive
          ? Number(formData.discountValue)
          : 0,

        // Strapi category relation.
        ...(formData.category
          ? {
              category: {
                connect: [formData.category],
              },
            }
          : {}),

        // Publish the product immediately.
        publishedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/api/products?populate=*`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify({
          data: productData,
        }),
      });

      await getResponseData(response);

      alert("Product successfully added!");

      // Reset form.
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "0",
        isDiscountActive: false,
        discountType: "percentage",
        discountValue: "0",
      });

      setImages([]);

      // Refresh product count and list.
      await fetchProductsAndCategories();
    } catch (err) {
      console.error("Product creation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // delete products from strapi
  const handleDeleteProduct = async (product) => {
    const productId = product.documentId;

    if (!productId) {
      setError("products documentId not found");
      return;
    }

    const confirmDelete = window.confirm(
      `Are yousure you want to delete"${product.name}"?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/products/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      // handle sucess and eror response
      if (!response.ok) {
        let result = {};

        try {
          result = await response.json();
        } catch {
          // respnse may not json
        }
        throw new Error(result?.error?.message || "unable to delete product");
      }
      alert("products delete successfully");

      // refesh products and total count\
      await fetchProductsAndCategories();
    } catch (err) {
      console.error("Delete products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEffectivalDiscount = (product) => {
    // global festival discount has prioprity
    if (offer?.isActive && Number(offer?.discountValue) > 0) {
      return {
        active: true,
        type: offer.discountType || "percentage",
        value: Number(offer.discountValue),
        name: offer.name || "Festival offer",
        source: "global",
      };
    }

    // otherwise use products discount
    if (product?.isDiscountActive && Number(product?.discountValue) > 0) {
      return {
        active: true,
        type: product.discountType || "percentage",
        value: Number(product.discountValue),
        name: "Products Discount",
        source: "product",
      };
    }
    return {
      active: false,
      type: null,
      value: 0,
      name: "",
      source: null,
    };
  };

  // calculate discount price
  const getDiscountPrice = (product) => {
    const discount = getEffectivalDiscount(product);
    const price = Number(product.price) || 0;
    if (!discount.active) {
      return price;
    }
    if (discount.type === "percentage") {
      return Math.max(0, price - (price * discount.value) / 100);
    }
    if (discount.type === "fixed") {
      return Math.max(0, price - discount.value);
    }
    return price;
  };

 // Group products by category.
const getProductsByCategory = () => {
  const grouped = {};

  products.forEach((product) => {
    const category = product.category;

    const categoryName =
      category?.name ||
      category?.data?.name ||
      "Uncategorized";

    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }

    grouped[categoryName].push(product);
  });

  return grouped;
};

const groupedProducts = getProductsByCategory();
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add and manage your ecommerce products.
        </p>
      </div>

      {/* Product count */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>

              <h2 className="mt-2 text-3xl font-bold text-blue-600">
                {fetching ? "..." : totalProducts}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-2xl">📦</div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products Loaded</p>

              <h2 className="mt-2 text-3xl font-bold text-green-600">
                {fetching ? "..." : products.length}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-4 text-2xl">🛍️</div>
          </div>
        </div>
      </div>

      {/* Add product form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white p-5 shadow-sm md:p-7"
      >
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Add New Product
        </h2>

        {/* Product name */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Product Name *
          </label>

          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Description *
          </label>

          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <p className="mt-1 text-xs text-gray-400">
            Each new line will be saved as a separate text block.
          </p>
        </div>

        {/* Price and stock */}
        <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Price (₹) *
            </label>

            <input
              type="number"
              name="price"
              min="0"
              step="1"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Stock *</label>

            <input
              type="number"
              name="stock"
              min="0"
              step="1"
              required
              value={formData.stock}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">
            Product Images *
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleImageChange}
            className="w-full rounded-lg border border-dashed p-4"
          />

          {images.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium">Category</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.documentId || category.id}
                value={category.documentId || category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Discount toggle */}
        <div className="mb-5 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-medium text-gray-800">Is Discount Active?</h3>

              <p className="text-sm text-gray-500">
                Enable or disable product discount.
              </p>
            </div>

            <input
              type="checkbox"
              checked={formData.isDiscountActive}
              onChange={handleDiscountChange}
              className="h-5 w-5 accent-blue-600"
            />
          </div>

          {formData.isDiscountActive && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Discount type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Discount Type
                </label>

                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white p-3"
                >
                  <option value="percentage">Percentage</option>

                  <option value="fixed">Fixed</option>
                </select>
              </div>

              {/* Discount value */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Discount Value
                </label>

                <input
                  type="number"
                  name="discountValue"
                  min="0"
                  step="1"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto"
        >
          {loading ? "Adding Product..." : "+ Add Product"}
        </button>
      </form>

      {/* Product list */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <h2 className="text-lg font-semibold">All Products</h2>
{/* 
          {offer?.isActive && (
            <p>
              {offer.name || "Festival offer"}
              is currently active.
            </p>
          )} */}

          <p className="mt-1 text-sm text-gray-500">
            products are displayed according to their selected categrogy
          </p>

          <button
            type="button"
            onClick={()=>{fetchProductsAndCategories();fetchCategories()}}
            disabled={fetching}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {fetching ? "Loading..." : "Refresh"}
          </button>
        </div>

        {fetching ? (
          <p className="p-6 text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Discount</th>
                  <th>Discount Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Delete</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const firstImage = product.images?.[0]?.url;
                  const discount = getEffectivalDiscount(product);
                  const finalprice = getDiscountPrice(product);

                  return (
                    <tr
                      key={product.documentId || product.id}
                      className="border-t"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {firstImage ? (
                            <img
                              src={`${API_URL}${firstImage}`}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                              📦
                            </div>
                          )}

                          <span className="font-medium">{product.name}</span>
                          {discount.active && discount.source === "global" && (
                            <span className="text-xs text-green-600">
                              {discount.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={
                            discount.active
                              ? "text-gray-400 line-through"
                              : "font-medium"
                          }
                        >
                          ₹{product.price}
                        </span>
                      </td>


                      {/* discount */}
                       <td className="p-4">
                        {discount.active ? (
                          <div>
                           
                            <span className="font-semibold text-green-600">
                              {discount.type === "percentage"
                                ? `${discount.value}%OFF`
                                : `${discount.value}OFF`}
                            </span>
                            {discount.source === "global" && (
                              <p className="mt-1 text-xs text-blue-600">
                                Festival
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400">No Discount</div>
                        )} *
                        {product.isDiscountActive
                          ? `${product.discountValue} ${
                              product.discountType === "percentage" ? "%" : "₹"
                            }`
                          : "No discount"}
                       </td>
                      {/* fianl discount */}
                       <td className="p-4">
                        {discount.active ? (
                          <span>{finalprice.toFixed(0)}</span>
                        ) : (
                          <span>{finalprice}</span>
                        )}
                      </td>

                      <td className="p-4">{product.stock ?? 0}</td>

                      <td className="p-4">
                        <button
                          className=" rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-400 disabled:opacity-50"
                          onClick={() => handleDeleteProduct(product)}
                          disabled={loading}
                        >
                          remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div> 



    </div>
  );
};

export default AdminProducts;
