const API_URL = "http://localhost:1337";

// GET AUTH HEADERS

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before managing products."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// PARSE STRAPI RESPONSE

const getResponseData = async (response) => {
  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    console.error(
      "Strapi returned non-JSON response:",
      text
    );

    throw new Error(
      `Strapi returned an invalid response. Status: ${response.status}`
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

// GET PRODUCTS

export const getProducts = async () => {
  const response = await fetch(
    `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

// GET CATEGORIES

export const getCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/categories?pagination[pageSize]=100&sort=name:asc`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

// UPLOAD PRODUCT IMAGES

export const uploadImages = async (images) => {
  const uploadedImages = [];

  for (const image of images) {
    const imageFormData = new FormData();

    imageFormData.append("files", image);

    const response = await fetch(
      `${API_URL}/api/upload`,
      {
        method: "POST",
        headers: getHeaders(),
        body: imageFormData,
      }
    );

    const result = await getResponseData(response);

    if (Array.isArray(result)) {
      uploadedImages.push(...result);
    }
  }

  return uploadedImages;
};

// CREATE PRODUCT

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

  return getResponseData(response);
};

// DELETE PRODUCT

export const deleteProduct = async (documentId) => {
  if (!documentId) {
    throw new Error(
      "Product documentId not found."
    );
  }

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(
      documentId
    )}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

export { API_URL };