
// import { useState } from "react";

// const API_URL = "http://localhost:1337";

// const useCreateProduct = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Get login token from localStorage
//   const getHeaders = () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       throw new Error("Please login before managing products.");
//     }

//     return {
//       Authorization: `Bearer ${token}`,
//     };
//   };

//   // Convert description into Strapi Blocks format
//   const convertDescriptionToBlocks = (text) => {
//     return text
//       .split("\n")
//       .filter((line) => line.trim() !== "")
//       .map((line) => ({
//         type: "paragraph",
//         children: [
//           {
//             type: "text",
//             text: line,
//           },
//         ],
//       }));
//   };

//   // Handle Strapi API response
//   const getResponseData = async (response) => {
//     let result;

//     try {
//       result = await response.json();
//     } catch {
//       throw new Error("Invalid response received from Strapi.");
//     }

//     if (!response.ok) {
//       throw new Error(
//         result?.error?.message ||
//         `Request failed with status ${response.status}`
//       );
//     }

//     return result;
//   };

//   // Fetch all products
//   const getProducts = async () => {
//     try {
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
//         {
//           method: "GET",
//           headers: getHeaders(),
//         }
//       );

//       const result = await getResponseData(response);

//       return {
//         products: result.data || [],
//         totalProducts:
//           result.meta?.pagination?.total ??
//           result.data?.length ??
//           0,
//       };
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Fetch all categories
//   const getCategories = async () => {
//     try {
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/categories?pagination[pageSize]=100`,
//         {
//           method: "GET",
//           headers: getHeaders(),
//         }
//       );

//       const result = await getResponseData(response);

//       return result.data || [];
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Upload product images to Strapi
//   const uploadImages = async (images) => {
//     if (!images || images.length === 0) {
//       throw new Error("Please select at least one product image.");
//     }

//     const uploadedImages = [];

//     for (const image of images) {
//       const imageFormData = new FormData();

//       imageFormData.append("files", image);

//       const response = await fetch(`${API_URL}/api/upload`, {
//         method: "POST",
//         headers: getHeaders(),
//         body: imageFormData,
//       });

//       const result = await getResponseData(response);

//       if (Array.isArray(result)) {
//         uploadedImages.push(...result);
//       }
//     }

//     if (uploadedImages.length === 0) {
//       throw new Error("Image upload failed.");
//     }

//     return uploadedImages;
//   };

//   // Create product in Strapi
//   const createProduct = async (formData, images) => {
//     try {
//       setLoading(true);
//       setError("");

//       // Upload images first
//       const uploadedImages = await uploadImages(images);

//       // Prepare product data
//       const productData = {
//         name: formData.name.trim(),

//         description: convertDescriptionToBlocks(
//           formData.description
//         ),

//         price: Number(formData.price),

//         images: uploadedImages.map((image) => image.id),

//         stock: Number(formData.stock),

//         isDiscountActive: formData.isDiscountActive,

//         discountType: formData.discountType,

//         discountValue: formData.isDiscountActive
//           ? Number(formData.discountValue)
//           : 0,

//         ...(formData.category
//           ? {
//               category: {
//                 connect: [formData.category],
//               },
//             }
//           : {}),
//       };

//       const response = await fetch(`${API_URL}/api/products?populate=*`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...getHeaders(),
//         },
//         body: JSON.stringify({
//           data: productData,
//         }),
//       });

//       const result = await getResponseData(response);

//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     createProduct,
//     getProducts,
//     getCategories,
//     uploadImages,
//     loading,
//     error,
//   };
// };

// export default useCreateProduct;