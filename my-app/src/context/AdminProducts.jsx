import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getCategories,
  uploadImages,
  createProduct,
  deleteProduct,
} from "../api/adminProductsApi";

import { useOffer } from "./OfferContext";

export const AdminProductsContext =
  createContext(null);

// DESCRIPTION → STRAPI BLOCKS

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

// PROVIDER

const AdminProductsProvider = ({ children }) => {
  const {
    offer,
    loading: offerLoading,
  } = useOffer();

  // FORM

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

  // DATA

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [totalProducts, setTotalProducts] =
    useState(0);

  // LOADING / ERROR

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // FETCH PRODUCTS

  const fetchProducts = useCallback(async () => {
    try {
      setFetching(true);
      setError("");

      const result = await getProducts();

      const productData = Array.isArray(result?.data)
        ? result.data
        : [];

      setProducts(productData);

      setTotalProducts(
        result?.meta?.pagination?.total ??
          productData.length
      );
    } catch (err) {
      console.error(
        "Fetch products error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load products."
      );

      setProducts([]);
      setTotalProducts(0);
    } finally {
      setFetching(false);
    }
  }, []);

  // FETCH CATEGORIES

  const fetchCategoriesData =
    useCallback(async () => {
      try {
        const result =
          await getCategories();

        setCategories(
          Array.isArray(result?.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load categories."
        );

        setCategories([]);
      }
    }, []);

  // REFRESH EVERYTHING

  const refreshProducts = useCallback(
    async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategoriesData(),
      ]);
    },
    [
      fetchProducts,
      fetchCategoriesData,
    ]
  );

  // INITIAL LOAD

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // FORM CHANGE

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // DISCOUNT TOGGLE

  const handleDiscountChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isDiscountActive:
        e.target.checked,
    }));
  };

  // IMAGE CHANGE

  const handleImageChange = (e) => {
    const selectedImages = Array.from(
      e.target.files || []
    );

    setImages(selectedImages);
  };

  // RESET FORM

  const resetForm = () => {
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
  };

  // CREATE PRODUCT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // PRODUCT NAME

      if (!formData.name.trim()) {
        throw new Error(
          "Product name is required."
        );
      }

      // DESCRIPTION

      if (!formData.description.trim()) {
        throw new Error(
          "Product description is required."
        );
      }

      // PRICE

      if (
        !Number.isInteger(
          Number(formData.price)
        ) ||
        Number(formData.price) < 0
      ) {
        throw new Error(
          "Price must be a whole number."
        );
      }

      // STOCK

      if (
        !Number.isInteger(
          Number(formData.stock)
        ) ||
        Number(formData.stock) < 0
      ) {
        throw new Error(
          "Stock must be a whole number."
        );
      }

      // DISCOUNT

      if (
        formData.isDiscountActive &&
        (
          !Number.isInteger(
            Number(
              formData.discountValue
            )
          ) ||
          Number(
            formData.discountValue
          ) < 0
        )
      ) {
        throw new Error(
          "Discount value must be a whole number."
        );
      }

      // IMAGE

      if (images.length === 0) {
        throw new Error(
          "Please select at least one product image."
        );
      }

      // UPLOAD IMAGES

      const uploadedImages =
        await uploadImages(images);

      if (
        uploadedImages.length === 0
      ) {
        throw new Error(
          "Image upload failed."
        );
      }

      // PRODUCT DATA

      const productData = {
        name: formData.name.trim(),

        description:
          convertDescriptionToBlocks(
            formData.description
          ),

        price: Number(
          formData.price
        ),

        images:
          uploadedImages.map(
            (image) => image.id
          ),

        stock: Number(
          formData.stock
        ),

        isDiscountActive:
          formData.isDiscountActive,

        discountType:
          formData.discountType,

        discountValue:
          formData.isDiscountActive
            ? Number(
                formData.discountValue
              )
            : 0,

        ...(formData.category
          ? {
              category: {
                connect: [
                  formData.category,
                ],
              },
            }
          : {}),
      };

      // CREATE

      await createProduct(
        productData
      );

      alert(
        "Product successfully added!"
      );

      resetForm();

      // REFRESH

      await refreshProducts();
    } catch (err) {
      console.error(
        "Product creation error:",
        err
      );

      setError(
        err?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT

  const handleDeleteProduct = async (
    product
  ) => {
    const documentId =
      product?.documentId;

    if (!documentId) {
      setError(
        "Product documentId not found."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product?.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await deleteProduct(
        documentId
      );

      alert(
        "Product deleted successfully."
      );

      await fetchProducts();
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete product."
      );
    } finally {
      setLoading(false);
    }
  };

  // EFFECTIVE DISCOUNT

  const getEffectiveDiscount = (
    product
  ) => {
    // Global offer has priority
    if (
      offer?.isActive &&
      Number(
        offer?.discountValue
      ) > 0
    ) {
      return {
        active: true,
        type:
          offer?.discountType ||
          "percentage",
        value: Number(
          offer.discountValue
        ),
        name:
          offer?.name ||
          "Festival offer",
        source: "global",
      };
    }

    // Product discount
    if (
      product?.isDiscountActive &&
      Number(
        product?.discountValue
      ) > 0
    ) {
      return {
        active: true,
        type:
          product?.discountType ||
          "percentage",
        value: Number(
          product.discountValue
        ),
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

  // DISCOUNT PRICE

  const getDiscountPrice = (
    product
  ) => {
    const discount =
      getEffectiveDiscount(
        product
      );

    const price =
      Number(product?.price) || 0;

    if (!discount.active) {
      return price;
    }

    if (
      discount.type ===
      "percentage"
    ) {
      return Math.max(
        0,
        price -
          (price *
            discount.value) /
            100
      );
    }

    if (
      discount.type === "fixed"
    ) {
      return Math.max(
        0,
        price -
          discount.value
      );
    }

    return price;
  };

  // GROUP PRODUCTS BY CATEGORY

  const getProductsByCategory = () => {
    const grouped = {};

    products.forEach(
      (product) => {
        const category =
          product?.category;

        const categoryName =
          category?.name ||
          category?.data?.name ||
          "Uncategorized";

        if (
          !grouped[categoryName]
        ) {
          grouped[categoryName] =
            [];
        }

        grouped[
          categoryName
        ].push(product);
      }
    );

    return grouped;
  };

  const groupedProducts =
    getProductsByCategory();

  // CONTEXT VALUE

  return (
    <AdminProductsContext.Provider
      value={{
        // Offer
        offer,
        offerLoading,

        // Form
        formData,
        setFormData,
        images,
        setImages,

        // Data
        categories,
        products,
        totalProducts,
        groupedProducts,

        // Loading
        loading,
        fetching,
        error,

        // Functions
        fetchProducts,
        fetchCategories:
          fetchCategoriesData,
        refreshProducts,

        handleChange,
        handleDiscountChange,
        handleImageChange,

        handleSubmit,
        handleDeleteProduct,

        resetForm,

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