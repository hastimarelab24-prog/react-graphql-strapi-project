import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getCategories,
  updateProductStock,
  uploadProductImage,
  createProduct,
  API_URL,
} from "../api/stockManagementApi";

export const StockManagementContext =
  createContext(null);

const StockManagementProvider = ({ children }) => {
  /* =========================
     PRODUCTS
  ========================= */

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  /* =========================
     LOADING
  ========================= */

  const [loading, setLoading] = useState(true);

  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [savingId, setSavingId] = useState(null);

  const [creatingProduct, setCreatingProduct] =
    useState(false);

  /* =========================
     ERROR
  ========================= */

  const [error, setError] = useState("");

  /* =========================
     STOCK INPUT
  ========================= */

  const [stockInputs, setStockInputs] = useState({});

  /* =========================
     PRODUCT FORM
  ========================= */

  const [productForm, setProductForm] =
    useState({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      isDiscountActive: false,
      discountType: "percentage",
      discountValue: "",
    });

  /* =========================
     IMAGE
  ========================= */

  const [selectedImage, setSelectedImage] =
    useState(null);

  /* =========================
     GET PRODUCTS
  ========================= */

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts();

      const productData = Array.isArray(result?.data)
        ? result.data
        : [];

      setProducts(productData);
    } catch (err) {
      console.error(
        "Fetch products error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load products."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     GET CATEGORIES
  ========================= */

  const fetchCategories = useCallback(async () => {
    try {
      setCategoryLoading(true);

      const result = await getCategories();

      const categoryData = Array.isArray(
        result?.data
      )
        ? result.data
        : [];

      setCategories(categoryData);
    } catch (err) {
      console.error(
        "Fetch categories error:",
        err
      );

      setError(
        err?.message ||
          "Failed to load categories."
      );

      setCategories([]);
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [
    fetchProducts,
    fetchCategories,
  ]);

  /* =========================
     STOCK INPUT CHANGE
  ========================= */

  const handleStockInputChange = (
    documentId,
    value
  ) => {
    setStockInputs((previous) => ({
      ...previous,
      [documentId]: value,
    }));
  };

  /* =========================
     ADD STOCK
  ========================= */

  const handleAddStock = async (product) => {
    const documentId =
      product?.documentId;

    if (!documentId) {
      setError(
        "Product documentId not found."
      );
      return;
    }

    const quantity = Number(
      stockInputs[documentId]
    );

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      setError(
        "Please enter a valid stock quantity."
      );
      return;
    }

    const currentStock = Number(
      product?.stock || 0
    );

    const newStock =
      currentStock + quantity;

    try {
      setSavingId(documentId);
      setError("");

      await updateProductStock(
        documentId,
        newStock
      );

      setProducts((previousProducts) =>
        previousProducts.map((item) =>
          item.documentId === documentId
            ? {
                ...item,
                stock: newStock,
              }
            : item
        )
      );

      setStockInputs((previous) => ({
        ...previous,
        [documentId]: "",
      }));
    } catch (err) {
      console.error(
        "Add stock error:",
        err
      );

      setError(
        err?.message ||
          "Failed to update stock."
      );
    } finally {
      setSavingId(null);
    }
  };

  /* =========================
     PRODUCT FORM CHANGE
  ========================= */

  const handleProductFormChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setProductForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0] || null;

    setSelectedImage(file);
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      isDiscountActive: false,
      discountType: "percentage",
      discountValue: "",
    });

    setSelectedImage(null);
  };

  /* =========================
     DESCRIPTION → STRAPI BLOCKS
  ========================= */

  const convertDescriptionToBlocks = (
    description
  ) => {
    return description
      .split("\n")
      .filter(
        (line) => line.trim() !== ""
      )
      .map((line) => ({
        type: "paragraph",
        children: [
          {
            type: "text",
            text: line.trim(),
          },
        ],
      }));
  };

  /* =========================
     CREATE PRODUCT
  ========================= */

  const handleCreateProduct = async () => {
    try {
      setCreatingProduct(true);
      setError("");

      /* NAME */

      if (!productForm.name.trim()) {
        throw new Error(
          "Product name is required."
        );
      }

      /* PRICE */

      const price = Number(
        productForm.price
      );

      if (
        !Number.isInteger(price) ||
        price < 0
      ) {
        throw new Error(
          "Price must be a whole number."
        );
      }

      /* STOCK */

      const stock = Number(
        productForm.stock
      );

      if (
        !Number.isInteger(stock) ||
        stock < 0
      ) {
        throw new Error(
          "Stock must be a whole number."
        );
      }

      /* CATEGORY */

      if (!productForm.category) {
        throw new Error(
          "Please select a category."
        );
      }

      /* DESCRIPTION */

      if (
        !productForm.description.trim()
      ) {
        throw new Error(
          "Product description is required."
        );
      }

      /* IMAGE */

      if (!selectedImage) {
        throw new Error(
          "Please select a product image."
        );
      }

      /* DISCOUNT */

      let discountValue = 0;

      if (
        productForm.isDiscountActive
      ) {
        discountValue = Number(
          productForm.discountValue
        );

        if (
          !Number.isInteger(
            discountValue
          ) ||
          discountValue < 0
        ) {
          throw new Error(
            "Discount value must be a whole number."
          );
        }

        if (
          productForm.discountType ===
            "percentage" &&
          discountValue > 100
        ) {
          throw new Error(
            "Percentage discount cannot be more than 100."
          );
        }
      }

      /* =========================
         UPLOAD IMAGE
      ========================= */

      const uploadedImage =
        await uploadProductImage(
          selectedImage
        );

      if (!uploadedImage?.id) {
        throw new Error(
          "Image upload failed."
        );
      }

      /* =========================
         CREATE PRODUCT DATA
      ========================= */

      const productData = {
        name: productForm.name.trim(),

        description:
          convertDescriptionToBlocks(
            productForm.description
          ),

        price,

        stock,

        images: [uploadedImage.id],

        category: {
          connect: [
            productForm.category,
          ],
        },

        isDiscountActive:
          productForm.isDiscountActive,

        discountType:
          productForm.discountType,

        discountValue:
          productForm.isDiscountActive
            ? discountValue
            : 0,
      };

      /* =========================
         CREATE
      ========================= */

      await createProduct(
        productData
      );

      /* =========================
         REFRESH PRODUCTS
      ========================= */

      await fetchProducts();

      resetProductForm();

      alert(
        "Product created successfully."
      );
    } catch (err) {
      console.error(
        "Create product error:",
        err
      );

      setError(
        err?.message ||
          "Failed to create product."
      );
    } finally {
      setCreatingProduct(false);
    }
  };

  /* =========================
     COUNTS
  ========================= */

  const totalProducts =
    products.length;

  const outOfstockCount =
    products.filter(
      (product) =>
        Number(product?.stock || 0) === 0
    ).length;

  const avilableCount =
    products.filter(
      (product) =>
        Number(product?.stock || 0) > 0
    ).length;

  /* =========================
     CONTEXT
  ========================= */

  return (
    <StockManagementContext.Provider
      value={{
        products,
        categories,

        loading,
        categoryLoading,
        savingId,
        creatingProduct,

        stockInputs,
        error,

        productForm,
        selectedImage,

        totalProducts,
        outOfstockCount,
        avilableCount,

        fetchProducts,

        handleStockInputChange,
        handleAddStock,

        handleProductFormChange,
        handleImageChange,
        handleCreateProduct,

        resetProductForm,

        API_URL,
      }}
    >
      {children}
    </StockManagementContext.Provider>
  );
};

export default StockManagementProvider;