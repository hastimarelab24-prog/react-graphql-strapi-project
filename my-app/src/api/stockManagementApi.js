
const API_URL = "http://localhost:1337";

const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login before managing stock.");
  }

  return token;
};

const getHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
};

const parseResponse = async (response) => {
  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Invalid response from Strapi. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return result;
};

/* 
   GET PRODUCTS
 */

export const getProducts = async () => {
  const response = await fetch(
    `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return parseResponse(response);
};

/* 
   GET CATEGORIES
 */

export const getCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/categories?pagination[pageSize]=100&sort=name:asc`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return parseResponse(response);
};

/* 
   UPDATE STOCK
 */

export const updateProductStock = async (
  documentId,
  newStock
) => {
  if (!documentId) {
    throw new Error("Product documentId is missing.");
  }

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(documentId)}`,
    {
      method: "PUT",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          stock: Number(newStock),
        },
      }),
    }
  );

  return parseResponse(response);
};

/* 
   UPLOAD PRODUCT IMAGE
 */

export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error("Product image is required.");
  }

  const formData = new FormData();

  formData.append("files", file);

  const response = await fetch(
    `${API_URL}/api/upload`,
    {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    }
  );

  const result = await parseResponse(response);

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("Image upload failed.");
  }

  return result[0];
};

/* 
   CREATE PRODUCT
 */

export const createProduct = async (productData) => {
  const response = await fetch(
    `${API_URL}/api/products`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: productData,
      }),
    }
  );

  return parseResponse(response);
};

export { API_URL };