
// import { useState } from "react";

// const API_URL = "http://localhost:1337";

// export const useCreateProduct = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Get login JWT token
//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // Common API request
//   const apiRequest = async (url, options = {}) => {
//     const token = getToken();

//     if (!token) {
//       throw new Error("Please login again. JWT token not found.");
//     }

//     const response = await fetch(`${API_URL}${url}`, {
//       ...options,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         ...options.headers,
//       },
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result?.error?.message || "API request failed"
//       );
//     }

//     return result;
//   };

//   // Upload product images
//   const uploadImages = async (files) => {
//     if (!files || files.length === 0) {
//       throw new Error("Please select at least one product image.");
//     }

//     const formData = new FormData();

//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     const uploadedFiles = await apiRequest("/api/upload", {
//       method: "POST",
//       body: formData,
//     });

//     return uploadedFiles.map((file) => file.id);
//   };

//   // Create product
//   const addProduct = async (productData) => {
//     setLoading(true);
//     setError("");

//     try {
//       const imageIds = await uploadImages(productData.images);

//       const descriptionBlocks = [
//         {
//           type: "paragraph",
//           children: [
//             {
//               type: "text",
//               text: productData.description,
//             },
//           ],
//         },
//       ];

//       const result = await apiRequest("/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           data: {
//             name: productData.name,
//             description: descriptionBlocks,
//             price: Number(productData.price),
//             stock: Number(productData.stock || 0),
//             images: imageIds,
//             isDiscountActive: Boolean(productData.isDiscountActive),
//             discountType: productData.discountType || "percentage",
//             discountValue: Number(productData.discountValue || 0),
//             category: productData.category
//               ? Number(productData.category)
//               : null,
//           },
//         }),
//       });

//       return result.data;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch products
//   const getProducts = async () => {
//     const result = await apiRequest(
//       "/api/products?populate=*&pagination[pageSize]=100"
//     );

//     return result.data;
//   };

//   // Fetch categories
//   const getCategories = async () => {
//     const result = await apiRequest("/api/categories");

//     return result.data;
//   };

//   return {
//     addProduct,
//     getProducts,
//     getCategories,
//     uploadImages,
//     loading,
//     error,
//   };
// };

// export default useCreateProduct;






import React, { useEffect, useState } from "react";
import { useCreateProduct } from "../hook/useCreateProduct";

const AdminProducts = () => {
  const {
    addProduct,
    getProducts,
    getCategories,
    loading,
    error,
  } = useCreateProduct();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    images: [],
    category: "",
    isDiscountActive: false,
    discountType: "percentage",
    discountValue: 0,
  });

  // Load products and categories
  const fetchProductsAndCategories = async () => {
    try {
      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productData || []);
      setCategories(categoryData || []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Handle text input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files || []),
    }));
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addProduct(formData);

      alert("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: 0,
        images: [],
        category: "",
        isDiscountActive: false,
        discountType: "percentage",
        discountValue: 0,
      });

      e.target.reset();

      await fetchProductsAndCategories();
    } catch (err) {
      console.error("Product creation error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Manage Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <div>
          <label>Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div>
          <label>Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleImageChange}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border p-3"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDiscountActive"
            checked={formData.isDiscountActive}
            onChange={handleChange}
          />
          Is Discount Active?
        </label>

        {formData.isDiscountActive && (
          <div className="grid grid-cols-2 gap-4">
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>

            <input
              type="number"
              name="discountValue"
              min="0"
              value={formData.discountValue}
              onChange={handleChange}
              className="rounded-lg border p-3"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:bg-gray-400"
        >
          {loading ? "Adding Product..." : "+ Add Product"}
        </button>
      </form>

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Products ({products.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.documentId || product.id}
                  className="border-b"
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-3 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;







// fully code 

// import React, { useEffect, useState } from "react";

// const API_URL = "http://localhost:1337";

// // Get the existing login token, if your app stores one.
// const getHeaders = () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Please login before managing products.");
//   }

//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// // Convert textarea text into Strapi Blocks format.
// const convertDescriptionToBlocks = (text) => {
//   return text
//     .split("\n")
//     .filter((line) => line.trim() !== "")
//     .map((line) => ({
//       type: "paragraph",
//       children: [
//         {
//           type: "text",
//           text: line,
//         },
//       ],
//     }));
// };

// // Read API response and show useful errors.
// const getResponseData = async (response) => {
//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       result?.error?.message || "Something went wrong"
//     );
//   }

//   return result;
// };

// const AdminProducts = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "0",
//     isDiscountActive: false,
//     discountType: "percentage",
//     discountValue: "0",
//   });

//   const [images, setImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [totalProducts, setTotalProducts] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch categories and products from Strapi.

// const fetchProductsAndCategories = async () => {
//   try {
//     setFetching(true);
//     setError("");

//     const headers = getHeaders();

//     const response = await fetch(
//       "http://localhost:1337/api/products?populate=*&pagination[pageSize]=100",
//       { headers }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         result?.error?.message || "Unable to load products"
//       );
//     }

//     // All products from Strapi
//     setProducts(result.data || []);

//     // Actual total count from Strapi
//     setTotalProducts(
//       result.meta?.pagination?.total ?? result.data.length
//     );

//   } catch (err) {
//     console.error("Fetch products error:", err);
//     setError(err.message);
//   } finally {
//     setFetching(false);
//   }
// };

//   useEffect(() => {
//     fetchProductsAndCategories();
//   }, []);

//   // Handle normal inputs.
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle discount toggle.
//   const handleDiscountChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       isDiscountActive: e.target.checked,
//     }));
//   };

//   // Handle multiple image selection.
//   const handleImageChange = (e) => {
//     const selectedImages = Array.from(e.target.files || []);

//     setImages(selectedImages);
//   };

//   // Upload selected images to Strapi Media Library.
//   const uploadImages = async () => {
//     const uploadedImages = [];

//     for (const image of images) {
//       const imageFormData = new FormData();

//       imageFormData.append("files", image);

//       const response = await fetch(
//         `${API_URL}/api/upload`,
//         {
//           method: "POST",
//           headers: getHeaders(),
//           body: imageFormData,
//         }
//       );

//       const result = await getResponseData(response);

//       if (Array.isArray(result)) {
//         uploadedImages.push(...result);
//       }
//     }

//     return uploadedImages;
//   };

//   // Add product to Strapi.
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setError("");

//       if (!Number.isInteger(Number(formData.price)) ||
//           Number(formData.price) < 0) {
//         throw new Error("Price must be a whole number.");
//       }

//       if (!Number.isInteger(Number(formData.stock)) ||
//           Number(formData.stock) < 0) {
//         throw new Error("Stock must be a whole number.");
//       }

//       if (
//         formData.isDiscountActive &&
//         (!Number.isInteger(Number(formData.discountValue)) ||
//           Number(formData.discountValue) < 0)
//       ) {
//         throw new Error("Discount value must be a whole number.");
//       }

//       if (images.length === 0) {
//         throw new Error("Please select at least one product image.");
//       }

//       // Upload images first.
//       const uploadedImages = await uploadImages();

//       if (uploadedImages.length === 0) {
//         throw new Error("Image upload failed.");
//       }

//       // Prepare product data.
//       const productData = {
//         name: formData.name.trim(),

//         description: convertDescriptionToBlocks(
//           formData.description
//         ),

//         price: Number(formData.price),

//         // Strapi media field.
//         images: uploadedImages.map((image) => image.id),

//         stock: Number(formData.stock),

//         isDiscountActive: formData.isDiscountActive,

//         discountType: formData.discountType,

//         discountValue: formData.isDiscountActive
//           ? Number(formData.discountValue)
//           : 0,

//         // Strapi category relation.
//         ...(formData.category
//           ? {
//               category: {
//                 connect: [formData.category],
//               },
//             }
//           : {}),

//         // Publish the product immediately.
//         publishedAt: new Date().toISOString(),
//       };

//       const response = await fetch(
//         `${API_URL}/api/products?populate=*`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...getHeaders(),
//           },
//           body: JSON.stringify({
//             data: productData,
//           }),
//         }
//       );

//       await getResponseData(response);

//       alert("Product successfully added!");

//       // Reset form.
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//         stock: "0",
//         isDiscountActive: false,
//         discountType: "percentage",
//         discountValue: "0",
//       });

//       setImages([]);

//       // Refresh product count and list.
//       await fetchProductsAndCategories();

//     } catch (err) {
//       console.error("Product creation error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">

//       {/* Page heading */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Manage Products
//         </h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Add and manage your ecommerce products.
//         </p>
//       </div>

//       {/* Product count */}
//       <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">
//                 Total Products
//               </p>

//               <h2 className="mt-2 text-3xl font-bold text-blue-600">
//                 {fetching ? "..." : totalProducts}
//               </h2>
//             </div>

//             <div className="rounded-xl bg-blue-50 p-4 text-2xl">
//               📦
//             </div>
//           </div>
//         </div>

//         <div className="rounded-2xl border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">
//                 Products Loaded
//               </p>

//               <h2 className="mt-2 text-3xl font-bold text-green-600">
//                 {fetching ? "..." : products.length}
//               </h2>
//             </div>

//             <div className="rounded-xl bg-green-50 p-4 text-2xl">
//               🛍️
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add product form */}
//       <form
//         onSubmit={handleSubmit}
//         className="rounded-2xl border bg-white p-5 shadow-sm md:p-7"
//       >
//         <h2 className="mb-6 text-xl font-semibold text-gray-800">
//           Add New Product
//         </h2>

//         {/* Product name */}
//         <div className="mb-5">
//           <label className="mb-2 block text-sm font-medium">
//             Product Name *
//           </label>

//           <input
//             type="text"
//             name="name"
//             required
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter product name"
//             className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
//           />
//         </div>

//         {/* Description */}
//         <div className="mb-5">
//           <label className="mb-2 block text-sm font-medium">
//             Description *
//           </label>

//           <textarea
//             name="description"
//             required
//             rows="5"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Enter product description"
//             className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
//           />

//           <p className="mt-1 text-xs text-gray-400">
//             Each new line will be saved as a separate text block.
//           </p>
//         </div>

//         {/* Price and stock */}
//         <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Price (₹) *
//             </label>

//             <input
//               type="number"
//               name="price"
//               min="0"
//               step="1"
//               required
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="Enter price"
//               className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Stock *
//             </label>

//             <input
//               type="number"
//               name="stock"
//               min="0"
//               step="1"
//               required
//               value={formData.stock}
//               onChange={handleChange}
//               className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Images */}
//         <div className="mb-5">
//           <label className="mb-2 block text-sm font-medium">
//             Product Images *
//           </label>

//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             required
//             onChange={handleImageChange}
//             className="w-full rounded-lg border border-dashed p-4"
//           />

//           {images.length > 0 && (
//             <p className="mt-2 text-sm text-green-600">
//               {images.length} image(s) selected
//             </p>
//           )}
//         </div>

//         {/* Category */}
//         <div className="mb-5">
//           <label className="mb-2 block text-sm font-medium">
//             Category
//           </label>

//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
//           >
//             <option value="">Select Category</option>

//             {categories.map((category) => (
//               <option
//                 key={category.documentId || category.id}
//                 value={category.documentId || category.id}
//               >
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Discount toggle */}
//         <div className="mb-5 rounded-xl border p-4">
//           <div className="flex items-center justify-between gap-3">
//             <div>
//               <h3 className="font-medium text-gray-800">
//                 Is Discount Active?
//               </h3>

//               <p className="text-sm text-gray-500">
//                 Enable or disable product discount.
//               </p>
//             </div>

//             <input
//               type="checkbox"
//               checked={formData.isDiscountActive}
//               onChange={handleDiscountChange}
//               className="h-5 w-5 accent-blue-600"
//             />
//           </div>

//           {formData.isDiscountActive && (
//             <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

//               {/* Discount type */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Discount Type
//                 </label>

//                 <select
//                   name="discountType"
//                   value={formData.discountType}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border bg-white p-3"
//                 >
//                   <option value="percentage">
//                     Percentage
//                   </option>

//                   <option value="fixed">
//                     Fixed
//                   </option>
//                 </select>
//               </div>

//               {/* Discount value */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Discount Value
//                 </label>

//                 <input
//                   type="number"
//                   name="discountValue"
//                   min="0"
//                   step="1"
//                   value={formData.discountValue}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border p-3"
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 md:w-auto"
//         >
//           {loading ? "Adding Product..." : "+ Add Product"}
//         </button>
//       </form>

//       {/* Product list */}
//       <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
//         <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
//           <h2 className="text-lg font-semibold">
//             All Products
//           </h2>

//           <button
//             type="button"
//             onClick={fetchProductsAndCategories}
//             disabled={fetching}
//             className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
//           >
//             {fetching ? "Loading..." : "Refresh"}
//           </button>
//         </div>

//         {fetching ? (
//           <p className="p-6 text-gray-500">
//             Loading products...
//           </p>
//         ) : products.length === 0 ? (
//           <p className="p-6 text-gray-500">
//             No products found.
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[650px] text-left text-sm">
//               <thead className="bg-gray-50 text-gray-600">
//                 <tr>
//                   <th className="p-4">Product</th>
//                   <th className="p-4">Price</th>
//                   <th className="p-4">Stock</th>
//                   <th className="p-4">Discount</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {products.map((product) => {
//                   const firstImage = product.images?.[0]?.url;

//                   return (
//                     <tr
//                       key={product.documentId || product.id}
//                       className="border-t"
//                     >
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           {firstImage ? (
//                             <img
//                               src={`${API_URL}${firstImage}`}
//                               alt={product.name}
//                               className="h-12 w-12 rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
//                               📦
//                             </div>
//                           )}

//                           <span className="font-medium">
//                             {product.name}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="p-4">
//                         ₹{product.price}
//                       </td>

//                       <td className="p-4">
//                         {product.stock ?? 0}
//                       </td>

//                       <td className="p-4">
//                         {product.isDiscountActive
//                           ? `${product.discountValue} ${
//                               product.discountType === "percentage"
//                                 ? "%"
//                                 : "₹"
//                             }`
//                           : "No discount"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // export default AdminProducts;













C. Product form પહેલાં Global Offer UI ઉમેરો

તમારા JSX માં આ જગ્યા શોધો:

{/* Add product form */}
<form
  onSubmit={handleSubmit}

એની બરાબર ઉપર આ Global Offer form મૂકો:


{/* GLOBAL OFFER MANAGEMENT */}
<div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7">

  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-xl font-bold text-gray-800">
        Global Discount Management
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Manage one discount offer for all products.
      </p>
    </div>

    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
      globalOfferForm.isActive
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600"
    }`}>
      {globalOfferForm.isActive ? "Offer Active" : "Offer Inactive"}
    </span>
  </div>

  {offerLoading ? (
    <p className="text-gray-500">Loading Global Offer...</p>
  ) : (
    <form onSubmit={handleGlobalOfferSubmit}>

      {/* Offer name */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium">
          Offer Name *
        </label>

        <input
          type="text"
          name="name"
          value={globalOfferForm.name}
          onChange={handleGlobalOfferChange}
          placeholder="Enter offer name"
          required
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        />
      </div>

      {/* Active toggle */}
      <div className="mb-5 flex items-center justify-between rounded-xl border p-4">
        <div>
          <h3 className="font-medium text-gray-800">
            Activate Global Discount
          </h3>

          <p className="text-sm text-gray-500">
            Apply this offer across the product catalogue.
          </p>
        </div>

        <input
          type="checkbox"
          name="isActive"
          checked={globalOfferForm.isActive}
          onChange={handleGlobalOfferChange}
          className="h-5 w-5 accent-blue-600"
        />
      </div>

      {/* Discount fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Discount Type
          </label>

          <select
            name="discountType"
            value={globalOfferForm.discountType}
            onChange={handleGlobalOfferChange}
            className="w-full rounded-lg border bg-white p-3"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Discount Value
          </label>

          <input
            type="number"
            name="discountValue"
            min="0"
            step="1"
            value={globalOfferForm.discountValue}
            onChange={handleGlobalOfferChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

      </div>

      {/* Error */}
      {offerError && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {offerError}
        </p>
      )}

      {/* Save */}
      <button
        type="submit"
        disabled={offerSaving}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {offerSaving ? "Saving Offer..." : "Save Global Offer"}
      </button>

    </form>
  )}
</div>