// import React, { createContext, useCallback, useEffect, useState } from "react";

// import {
//   getProducts,
//   getCategories,
//   uploadImages as uploadProductImages,
//   uploadImageFromUrl,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } from "../api/adminProductsApi";

// import { useOffer } from "./OfferContext";


// export const AdminProductsContext = createContext(null);

// // DESCRIPTION → STRAPI BLOCKS

// const convertDescriptionToBlocks = (text) => {
//   if (!text || typeof text !== "string") {
//     return [];
//   }
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

// // strapi txt blocks
// const converBlocksToDescription = (description) => {
//   if (description === null || description === undefined) {
//     return "";
//   }
//   if (typeof description === "string") {
//     return description;
//   }
//   if (typeof description === "boolean" || typeof description === "number") {
//     return String(description);
//   }

//   if (!Array.isArray(description)) {
//     return description
//       .map((block) => {
//         if (!block) {
//           return "";
//         }
//         if (Array.isArray(block.children)) {
//           return block.children
//             .map((child) => {
//               if (child === null || child === undefined) {
//                 return "";
//               }
//               if (typeof child.text === "string") {
//                 return child.text;
//               }
//               if (
//                 typeof child.text === "boolean" ||
//                 typeof child.text === "number"
//               ) {
//                 return String(child.text);
//               }
//               return "";
//             })
//             .join("");
//         }
//         if (typeof block.text === "string") {
//           return block.text;
//         }
//         if (
//           typeof block === "string" ||
//           typeof block === "number" ||
//           typeof block === "boolean"
//         ) {
//           return String(block);
//         }
//         return "";
//       })
//       .filter((line) => typeof line === "string" && line.trim() !== "")
//       .join("\n");
//   }

//   if (typeof description === "object") {
//     if (Array.isArray(description.data)) {
//       return converBlocksToDescription(description.data);
//     }
//     if (Array.isArray(description.children)) {
//       return description.children
//         .map((child) => {
//           if (typeof child?.text === "string") {
//             return child.text;
//           }
//           if (
//             typeof child?.text === "boolean" ||
//             typeof child?.text === "number"
//           ) {
//             return String(child.text);
//           }
//           return "";
//         })
//         .filter(Boolean)
//         .join("");
//     }
//     return "";
//   }
//   return "";
// };
// // PROVIDER

// const AdminProductsProvider = ({ children }) => {
//   const { offer, loading: offerLoading } = useOffer();

//   // FORM

//   const emptyForm = {
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     stock: "0",
//     isDiscountActive: false,
//     discountType: "percentage",
//     discountValue: "0",
//   };
//   const [formData, setFormData] = useState(emptyForm);
//   const [images, setImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   const [imageUrl, setImageUrl] = useState("");
//   const [urlImages, setUrlImages] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // DATA

//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [totalProducts, setTotalProducts] = useState(0);

//   // LOADING / ERROR

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");
//   const[successMessage,setSuccessMessage]=useState("")
//   const isEditing = Boolean(editingProduct);
//   // FETCH PRODUCTS

//   const fetchProducts = useCallback(async () => {
//     try {
//       setFetching(true);
//       setError("");

//       const result = await getProducts();

//       const productData = Array.isArray(result?.data) ? result.data : [];

//       setProducts(productData);

//       setTotalProducts(result?.meta?.pagination?.total ?? productData.length);
//     } catch (err) {
//       console.error("Fetch products error:", err);

//       setError(err?.message || "Unable to load products.");

//       setProducts([]);
//       setTotalProducts(0);
//     } finally {
//       setFetching(false);
//     }
//   }, []);

//   // FETCH CATEGORIES

//   const fetchCategoriesData = useCallback(async () => {
//     try {
//       const result = await getCategories();

//       setCategories(Array.isArray(result?.data) ? result.data : []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);

//       setError(err?.message || "Unable to load categories.");

//       setCategories([]);
//     }
//   }, []);

//   // REFRESH EVERYTHING

//   const refreshProducts = useCallback(async () => {
//     await Promise.all([fetchProducts(), fetchCategoriesData()]);
//   }, [fetchProducts, fetchCategoriesData]);

//   // INITIAL LOAD

//   useEffect(() => {
//     refreshProducts();
//   }, [refreshProducts]);

//   // FORM CHANGE

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // DISCOUNT TOGGLE

//   const handleDiscountChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       isDiscountActive: e.target.checked,
//     }));
//   };

//   // IMAGE CHANGE
//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     if (!selectedFiles.length > 0) {

//       setImages((prev) => [...prev, ...selectedFiles]);
//     }

//     e.target.value = "";
//   };

//   // remove existing image
//   const handleRemoveExistingImage = (imageId) => {
//     setExistingImages((prev) => prev.filter((image) => image?.id !== imageId && image?.documentId !==imageId));
//   };

//   // remove new image
//   const handleRemoveNewImage = (index) => {
//     setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
//   };
//   // RESET FORM

//   const resetForm = () => {
//     setFormData({
//       ...emptyForm,
//     });

//     setImages([]);
//     setExistingImages([]);
//     setUrlImages([]);
//     setImageUrl("");
//     setEditingProduct(null);
//     setSuccessMessage("")
//     setError("");
//   };

//   // edit product
//   const handleEditProduct = (product) => {
//     if (!product) {
//       return;
//     }
//     setEditingProduct(product);
//     setFormData({
//       name: product?.name || "",
//       description: converBlocksToDescription(product?.description),
//       price: product?.price ?? "",
//       category:
//         product?.category?.documentId ||
//         product?.category?.id ||
//         product?.category?.data?.documentId ||
//         product?.category?.data?.id ||
//         "",
//       stock: product?.stock ?? 0,
//       isDiscountActive: Boolean(product?.isDiscountActive),
//       discountType: product?.discountType || "percentage",
//       discountValue: product?.discountValue ?? 0,
//     });
//     setExistingImages(
//       Array.isArray(product?.images)
//         ? product.images
//             .filter(Boolean)
//             .map((image) => ({
//               ...image,
//               url: image?.url || "",
//             }))
//         : [],
//     );
//     setImages([]);
//     setUrlImages([]);
//     setImageUrl("");
//     setError("");
//     setSuccessMessage("")
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // CREATE PRODUCT

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     setLoading(true);
//   //     setError("");

//   //     // PRODUCT NAME

//   //     if (!formData.name.trim()) {
//   //       throw new Error("Product name is required.");
//   //     }

//   //     // DESCRIPTION

//   //     if (!formData.description.trim()) {
//   //       throw new Error("Product description is required.");
//   //     }

//   //     // PRICE

//   //     if (
//   //       !Number.isInteger(Number(formData.price)) ||
//   //       Number(formData.price) < 0
//   //     ) {
//   //       throw new Error("Price must be a whole number.");
//   //     }

//   //     // STOCK

//   //     if (
//   //       !Number.isInteger(Number(formData.stock)) ||
//   //       Number(formData.stock) < 0
//   //     ) {
//   //       throw new Error("Stock must be a whole number.");
//   //     }

//   //     // DISCOUNT

//   //     if (
//   //       formData.isDiscountActive &&
//   //       (!Number.isInteger(Number(formData.discountValue)) ||
//   //         Number(formData.discountValue) < 0)
//   //     ) {
//   //       throw new Error("Discount value must be a whole number.");
//   //     }

//   //     // IMAGE
//   //     let uploadImages = [];
//   //     if (images.length > 0) {
//   //       uploadImages = await uploadProductImages(images);
//   //     }

//   //     // UPLOAD IMAGES
//   //     const existingImageIds = (existingImages || [])
//   //       .map((image) => image?.id)
//   //       .filter(Boolean);
//   //     const uploadImageIds = (uploadImages || [])
//   //       .map((images) => images?.id)
//   //       .filter(Boolean);

//   //     const allImageIds = [...existingImageIds, ...uploadImageIds];
//   //     if (allImageIds.length === 0) {
//   //       throw new Error("please add at least one product image");
//   //     }

//   //     // PRODUCT DATA

//   //     const productData = {
//   //       name: formData.name.trim(),

//   //       description: convertDescriptionToBlocks(formData.description),

//   //       price: Number(formData.price),
//   //       stock: Number(formData.stock),

//   //       isDiscountActive: formData.isDiscountActive,

//   //       discountType: formData.discountType,

//   //       discountValue: formData.isDiscountActive
//   //         ? Number(formData.discountValue)
//   //         : 0,

//   //       images: allImageIds,

//   //       ...(formData.category
//   //         ? {
//   //             category: formData.category,
//   //           }
//   //         : {
//   //             category: null,
//   //           }),
//   //     };

//   //     // update
//   //     if (isEditing) {
//   //       if (!editingProduct?.documentId) {
//   //         throw new Error("products documentidnot found");
//   //       }
//   //       await updateProduct(editingProduct.documentId, productData);
//   //       alert("products update successfully");
//   //     }
//   //     // CREATE
//   //     else {
//   //       await createProduct(productData);

//   //       alert("Product successfully added!");
//   //     }

//   //     resetForm();

//   //     // REFRESH

//   //     await refreshProducts();
//   //   } catch (err) {
//   //     console.error("Product creation error:", err);

//   //     setError(err?.message || "Failed to create product.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);
//     setError("");
//     setSuccessMessage("")
//     // -----------------------------------------
//     // 1. Upload PC images
//     // -----------------------------------------
//     const uploadedPCImages = await uploadImages(images);

//     // -----------------------------------------
//     // 2. Upload URL images to Strapi Media
//     // -----------------------------------------
//     const uploadedURLImages = [];

//     for (const item of urlImages || []) {
//       if (!item?.url) continue;

//       const result = await uploadImageFromUrl(item.url);

//       if (result?.file) {
//         uploadedURLImages.push(result.file);
//       }
//     }

//     // -----------------------------------------
//     // 3. Convert uploaded files into IDs
//     // -----------------------------------------
//     const newImageIds = [
//       ...uploadedPCImages,
//       ...uploadedURLImages,
//     ]
//       .map((image) => image?.id)
//       .filter(Boolean);

//     // -----------------------------------------
//     // 4. Existing image IDs
//     // -----------------------------------------
//     const existingImageIds = (existingImages || [])
//       .map((image) => image?.id)
//       .filter(Boolean);

//     // -----------------------------------------
//     // 5. Keep existing images first
//     //    then PC/URL new images
//     // -----------------------------------------
//     const allImageIds = [
//       ...existingImageIds,
//       ...newImageIds,
//     ];

//     // -----------------------------------------
//     // 6. Product data
//     // -----------------------------------------
//     const productData = {
//       name: formData.name,
//       description: formData.description,
//       price: Number(formData.price),
//       stock: Number(formData.stock),
//       category: formData.category || null,

//       isDiscountActive:
//         Boolean(formData.isDiscountActive),

//       discountType:
//         formData.discountType || "percentage",

//       discountValue:
//         Number(formData.discountValue) || 0,

//       images: allImageIds,
//     };

//     // -----------------------------------------
//     // 7. Create / Update
//     // -----------------------------------------
//     if (editingProduct?.documentId) {
//       await updateProduct(
//         editingProduct.documentId,
//         productData
//       );
//     } else {
//       await createProduct(productData);
//     }

//     // -----------------------------------------
//     // 8. Refresh product list
//     // -----------------------------------------
//     await refreshProducts();

//     // -----------------------------------------
//     // 9. Reset form
//     // -----------------------------------------
//     resetForm();

//     // -----------------------------------------
//     // 10. Success
//     // -----------------------------------------
//     setError("");
//     setSuccessMessage(
//       editingProduct
//         ? "Product updated successfully!"
//         : "Product created successfully!"
//     );
//   } catch (error) {
//     console.error(
//       "Product save error:",
//       error
//     );

//     setError(
//       error?.message ||
//         "Unable to save product."
//     );
//   } finally {
//     setLoading(false);
//   }
// };


//   // DELETE PRODUCT

//   const handleDeleteProduct = async (product) => {
//     const documentId = product?.documentId;

//     if (!documentId) {
//       setError("Product documentId not found.");
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${product?.name}"?`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await deleteProduct(documentId);

//       alert("Product deleted successfully.");

//       await fetchProducts();
//     } catch (err) {
//       console.error("Delete product error:", err);

//       setError(err?.message || "Unable to delete product.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EFFECTIVE DISCOUNT

//   const getEffectiveDiscount = (product) => {
//     // Global offer has priority
//     if (offer?.isActive && Number(offer?.discountValue) > 0) {
//       return {
//         active: true,
//         type: offer?.discountType || "percentage",
//         value: Number(offer.discountValue),
//         name: offer?.name || "Festival offer",
//         source: "global",
//       };
//     }

//     // Product discount
//     if (product?.isDiscountActive && Number(product?.discountValue) > 0) {
//       return {
//         active: true,
//         type: product?.discountType || "percentage",
//         value: Number(product.discountValue),
//         name: "Product Discount",
//         source: "product",
//       };
//     }

//     return {
//       active: false,
//       type: null,
//       value: 0,
//       name: "",
//       source: null,
//     };
//   };

//   // DISCOUNT PRICE

//   const getDiscountPrice = (product) => {
//     const discount = getEffectiveDiscount(product);

//     const price = Number(product?.price) || 0;

//     if (!discount.active) {
//       return price;
//     }

//     if (discount.type === "percentage") {
//       return Math.max(0, price - (price * discount.value) / 100);
//     }

//     if (discount.type === "fixed") {
//       return Math.max(0, price - discount.value);
//     }

//     return price;
//   };

//   // GROUP PRODUCTS BY CATEGORY

//   const getProductsByCategory = () => {
//     const grouped = {};

//     products.forEach((product) => {
//       const category = product?.category;

//       const categoryName =
//         category?.name || category?.data?.name || "Uncategorized";

//       if (!grouped[categoryName]) {
//         grouped[categoryName] = [];
//       }

//       grouped[categoryName].push(product);
//     });

//     return grouped;
//   };

//   const groupedProducts = getProductsByCategory();

//   // IMAGE URL INPUT
//   const handleImageUrlChange = (e) => {
//     const value = e.target.value;

//     console.log("Image URL typing:", value);

//     setImageUrl(value);
//   };

//   // ADD IMAGE URL
//   const handleAddImageUrl = () => {
//     const url = String(imageUrl || "").trim();

//     console.log("Adding image URL:", url);

//     if (!url) {
//       setError("Please enter an image URL.");
//       return;
//     }

//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("Please enter a valid image URL.");
//       return;
//     }

//     const newImage = {
//       key: `url-${Date.now()}-${Math.random()}`,
//       type: "url",
//       url: url,
//     };

//     setUrlImages((prev) => [...prev, newImage]);

//     // Clear input
//     setImageUrl("");

//     setError("");
//   };

//   // REMOVE URL IMAGE
//   const handleRemoveImagesUrl = (index) => {
//     setUrlImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // CONTEXT VALUE

//   return (
//     <AdminProductsContext.Provider
//       value={{
//         // Offer
//         offer,
//         offerLoading,

//         // Form
//         formData,
//         setFormData,

//         // PC Images
//         images,
//         setImages,

//         // Existing Strapi Images
//         existingImages,
//         setExistingImages,

//         // URL Images
//         imageUrl,
//         urlImages,

//         // Image URL Functions
//         handleImageUrlChange,
//         handleAddImageUrl,
//         handleRemoveImagesUrl,

//         // Edit
//         editingProduct,
//         isEditing,

//         // Data
//         categories,
//         products,
//         totalProducts,
//         groupedProducts,

//         // Loading
//         loading,
//         fetching,
//         error,

//         // Functions
//         fetchProducts,
//         fetchCategories: fetchCategoriesData,
//         refreshProducts,

//         handleChange,
//         handleDiscountChange,
//         handleImageChange,

//         handleRemoveExistingImage,
//         handleRemoveNewImage,

//         handleEditProduct,

//         handleSubmit,
//         handleDeleteProduct,

//         resetForm,

//         getEffectiveDiscount,
//         getDiscountPrice,

//         getProductsByCategory,
//       }}
//     >
//       {children}
//     </AdminProductsContext.Provider>
//   );
// };

// export default AdminProductsProvider;


import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getCategories,
  uploadImages as uploadProductImages,
  uploadImageFromUrl,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/adminProductsApi";

import { useOffer } from "./OfferContext";

export const AdminProductsContext = createContext(null);

// Convert description text to Strapi Blocks format.
const convertDescriptionToBlocks = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

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

// Convert Strapi Blocks description to editable text.
const convertBlocksToDescription = (description) => {
  if (description == null) return "";

  if (typeof description === "string") {
    return description;
  }

  if (
    typeof description === "number" ||
    typeof description === "boolean"
  ) {
    return String(description);
  }

  if (Array.isArray(description)) {
    return description
      .map((block) => {
        if (typeof block === "string") return block;

        if (
          typeof block === "number" ||
          typeof block === "boolean"
        ) {
          return String(block);
        }

        if (Array.isArray(block?.children)) {
          return block.children
            .map((child) => {
              if (typeof child?.text === "string") {
                return child.text;
              }

              if (
                typeof child?.text === "number" ||
                typeof child?.text === "boolean"
              ) {
                return String(child.text);
              }

              return "";
            })
            .join("");
        }

        return typeof block?.text === "string"
          ? block.text
          : "";
      })
      .filter((line) => line.trim() !== "")
      .join("\n");
  }

  if (typeof description === "object") {
    if (Array.isArray(description.data)) {
      return convertBlocksToDescription(description.data);
    }

    if (Array.isArray(description.children)) {
      return description.children
        .map((child) => child?.text ?? "")
        .join("");
    }
  }

  return "";
};

const AdminProductsProvider = ({ children }) => {
  const { offer, loading: offerLoading } = useOffer();

  // Initial form values.
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    isDiscountActive: false,
    discountType: "percentage",
    discountValue: "0",
  };

  // All Hooks are inside the provider component.
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [urlImages, setUrlImages] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductId,setEditingProductId] =useState(null)

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = Boolean(editingProduct);

  // Fetch products.
 const fetchProducts = useCallback(async () => {
  try {
    setFetching(true);
    setError("");

    const result = await getProducts();

    // API array અથવા Strapi { data: [...] } બંને support કરે છે
    const productData = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];

    setProducts(productData);

    setTotalProducts(
      result?.meta?.pagination?.total ?? productData.length
    );
  } catch (err) {
    console.error("Fetch products error:", err);
    setError(err?.message || "Unable to load products.");
    setProducts([]);
    setTotalProducts(0);
  } finally {
    setFetching(false);
  }
}, []);

  // Fetch categories.
const fetchCategoriesData = useCallback(async () => {
  try {
    const result = await getCategories();

    const categoryData = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];

    setCategories(categoryData);
  } catch (err) {
    console.error("Fetch categories error:", err);
    setError(err?.message || "Unable to load categories.");
    setCategories([]);
  }
}, []);;

  // Refresh products and categories.
  const refreshProducts = useCallback(async () => {
    await Promise.all([
      fetchProducts(),
      fetchCategoriesData(),
    ]);
  }, [fetchProducts, fetchCategoriesData]);

  // Load data when the provider mounts.
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Form input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Discount checkbox.
  const handleDiscountChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isDiscountActive: e.target.checked,
    }));
  };

  // Add selected local images.
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 0) {
      setImages((prev) => [...prev, ...selectedFiles]);
    }

    // Allow selecting the same file again.
    e.target.value = "";
  };

  // Remove an existing Strapi image.
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) =>
      prev.filter(
        (image) =>
          image?.id !== imageId &&
          image?.documentId !== imageId
      )
    );
  };

  // Remove a newly selected local image.
  const handleRemoveNewImage = (index) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // Reset the product form.
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setImages([]);
    setExistingImages([]);
    setUrlImages([]);
    setImageUrl("");
    setEditingProduct(null);
    setError("");
    setSuccessMessage("");
  };

  // Load a product into the form for editing.
  const handleEditProduct = (product,index) => {

    if (!product) return;
    setEditingProductId(product.documentId)
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: convertBlocksToDescription(
        product.description
      ),
      price: product.price ?? "",
      category:
        product.category?.documentId ||
        product.category?.id ||
        product.category?.data?.documentId ||
        product.category?.data?.id ||
        "",
      stock: product.stock ?? 0,
      isDiscountActive: Boolean(product.isDiscountActive),
      discountType: product.discountType || "percentage",
      discountValue: product.discountValue ?? 0,
    });

    setExistingImages(
      Array.isArray(product.images)
        ? product.images.filter(Boolean).map((image) => ({
            ...image,
            url: image.url || "",
          }))
        : []
    );

    setImages([]);
    setUrlImages([]);
    setImageUrl("");
    setError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Create or update a product.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      // Validate product name.
      if (!formData.name.trim()) {
        throw new Error("Product name is required.");
      }

      // Validate description.
      if (!formData.description.trim()) {
        throw new Error("Product description is required.");
      }

      // Strapi schema uses an integer price.
      if (
        formData.price === "" ||
        !Number.isInteger(Number(formData.price)) ||
        Number(formData.price) < 0
      ) {
        throw new Error(
          "Price must be a non-negative whole number."
        );
      }

      // Validate stock.
      if (
        formData.stock === "" ||
        !Number.isInteger(Number(formData.stock)) ||
        Number(formData.stock) < 0
      ) {
        throw new Error(
          "Stock must be a non-negative whole number."
        );
      }

      // Validate discount.
      const discountValue = Number(formData.discountValue);

      if (
        formData.isDiscountActive &&
        (
          !Number.isFinite(discountValue) ||
          discountValue < 0 ||
          (
            formData.discountType === "percentage" &&
            discountValue > 100
          )
        )
      ) {
        throw new Error(
          "Enter a valid discount value. Percentage must be between 0 and 100."
        );
      }

      // 1. Upload local images using the imported API function.
    const uploadedPCImages = images.length
  ? await uploadProductImages(images)
  : [];

const uploadedURLImages = [];

for (const item of urlImages) {
  if (!item?.url) continue;

  const result = await uploadImageFromUrl(item.url);
  const file = result?.file || result;

  if (file?.id) {
    uploadedURLImages.push(file);
  }
}

const localFiles = Array.isArray(uploadedPCImages)
  ? uploadedPCImages
  : [];

const newImageIds = [
  ...localFiles,
  ...uploadedURLImages,
]
  .map((image) => image?.id)
  .filter(Boolean);

const existingImageIds = existingImages
  .map((image) => image?.id)
  .filter(Boolean);

const allImageIds = [
  ...existingImageIds,
  ...newImageIds,
];

     

      if (allImageIds.length === 0) {
        throw new Error(
          "Please add at least one product image."
        );
      }

      // 5. Build product data for Strapi.
      const productData = {
        name: formData.name.trim(),
        description: convertDescriptionToBlocks(
          formData.description
        ),
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category || null,
        isDiscountActive: Boolean(formData.isDiscountActive),
        discountType: formData.discountType || "percentage",
        discountValue: formData.isDiscountActive
          ? Number(formData.discountValue) || 0
          : 0,
        images: allImageIds,
      };

      // 6. Create or update.
      const wasEditing = Boolean(editingProduct?.documentId);

      if (wasEditing) {
        await updateProduct(
          editingProduct.documentId,
          productData
        );
      } else {
        await createProduct(productData);
      }

      // 7. Refresh the product list.
      await refreshProducts();

      // 8. Clear the form and show confirmation.
      setFormData({ ...emptyForm });
      setImages([]);
      setExistingImages([]);
      setUrlImages([]);
      setImageUrl("");
      setEditingProduct(null);

      setSuccessMessage(
        wasEditing
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (err) {
      console.error("Product save error:", err);

      setError(
        err?.message || "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a product.
  const handleDeleteProduct = async (product) => {
    const documentId = product?.documentId;

    if (!documentId) {
      setError("Product documentId not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product?.name}"?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      await deleteProduct(documentId);
      await fetchProducts();

      setSuccessMessage("Product deleted successfully!");
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err?.message || "Unable to delete product."
      );
    } finally {
      setLoading(false);
    }
  };

  // Determine the effective discount.
  const getEffectiveDiscount = (product) => {
    // Global offer takes priority when active.
    if (offer?.isActive && Number(offer.discountValue) > 0) {
      return {
        active: true,
        type: offer.discountType || "percentage",
        value: Number(offer.discountValue),
        name: offer.name || "Festival offer",
        source: "global",
      };
    }

    // Otherwise use the product's discount.
    if (
      product?.isDiscountActive &&
      Number(product.discountValue) > 0
    ) {
      return {
        active: true,
        type: product.discountType || "percentage",
        value: Number(product.discountValue),
        name: "Product Discount",
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

  // Calculate the discounted price.
  const getDiscountPrice = (product) => {
    const price = Number(product?.price) || 0;
    const discount = getEffectiveDiscount(product);

    if (!discount.active) return price;

    if (discount.type === "percentage") {
      return Math.max(
        0,
        price - (price * discount.value) / 100
      );
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
      const categoryName =
        product?.category?.name ||
        product?.category?.data?.name ||
        "Uncategorized";

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      grouped[categoryName].push(product);
    });

    return grouped;
  };

  const groupedProducts = getProductsByCategory();

  // URL image input.
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Add an image URL to the pending list.
  const handleAddImageUrl = () => {
    const url = String(imageUrl || "").trim();

    if (!url) {
      setError("Please enter an image URL.");
      return;
    }

    if (!/^https?:\/\/\S+$/i.test(url)) {
      setError("Please enter a valid HTTP or HTTPS image URL.");
      return;
    }

    setUrlImages((prev) => [
      ...prev,
      {
        key: `url-${Date.now()}-${Math.random()}`,
        type: "url",
        url,
      },
    ]);

    setImageUrl("");
    setError("");
  };

  // Remove a pending URL image.
  const handleRemoveImageUrl = (index) => {
    setUrlImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <AdminProductsContext.Provider
      value={{
        // Global offer.
        offer,
        offerLoading,

        // Form state.
        formData,
        setFormData,
        resetForm,

        // Local images.
        images,
        setImages,

        // Existing Strapi images.
        existingImages,
        setExistingImages,

        // URL images.
        imageUrl,
        urlImages,
        handleImageUrlChange,
        handleAddImageUrl,
        handleRemoveImageUrl,

        // Editing state.
        editingProduct,
        isEditing,

        // Product and category data.
        categories,
        products,
        totalProducts,
        groupedProducts,

        // Loading and messages.
        loading,
        fetching,
        error,
        successMessage,

        // Fetching functions.
        fetchProducts,
        fetchCategories: fetchCategoriesData,
        refreshProducts,

        // Form handlers.
        handleChange,
        handleDiscountChange,
        handleImageChange,
        handleRemoveExistingImage,
        handleRemoveNewImage,
        handleEditProduct,
        handleSubmit,
        handleDeleteProduct,

        // Discount helpers.
        getEffectiveDiscount,
        getDiscountPrice,
        getProductsByCategory,
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
};

export default AdminProductsProvider;