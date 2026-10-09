
const API_URL = "http://localhost:1337";

// GET TOKEN
const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login before managing products.");
  }

  return token;
};

// AUTH HEADERS
const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
});

// PARSE STRAPI RESPONSE
const getResponseData = async (response) => {
  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Strapi returned invalid JSON. Status: ${response.status}`
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

  const result = await getResponseData(response);

  return {
    data: Array.isArray(result?.data) ? result.data : [],
    meta: result?.meta || {},
  };
};

export const getCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/categories?pagination[pageSize]=100&sort=name:asc`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const result = await getResponseData(response);

  return {
    data: Array.isArray(result?.data) ? result.data : [],
    meta: result?.meta || {},
  };
};

// UPLOAD IMAGES FROM PC
export const uploadImages = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const formData = new FormData();

  files.forEach((file) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  if (formData.getAll("files").length === 0) {
    return [];
  }

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const result = await getResponseData(response);

  return Array.isArray(result) ? result : [];
};

// UPLOAD IMAGE FROM URL
export const uploadImageFromUrl = async (imageUrl) => {
  if (!imageUrl?.trim()) {
    throw new Error("Please enter an image URL.");
  }

  const response = await fetch(
    `${API_URL}/api/products/upload-from-url`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl.trim() }),
    }
  );

  return getResponseData(response);
};

// GET SINGLE PRODUCT
export const getProductsByDocumentId = async (documentId) => {
  if (!documentId) {
    throw new Error("Product documentId is required.");
  }

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(documentId)}?populate=*`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const result = await getResponseData(response);

  return result?.data || null;
};

// CREATE PRODUCT
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: productData }),
  });

  return getResponseData(response);
};

// UPDATE PRODUCT
export const updateProduct = async (documentId, productData) => {
  if (!documentId) {
    throw new Error("Product documentId is required.");
  }

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(documentId)}`,
    {
      method: "PUT",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: productData }),
    }
  );

  return getResponseData(response);
};

// DELETE PRODUCT
export const deleteProduct = async (documentId) => {
  if (!documentId) {
    throw new Error("Product documentId is required.");
  }

  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(documentId)}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

export { API_URL };



// const API_URL = "http://localhost:1337";

// // Get authentication headers
// const getHeaders = () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Please login before managing products.");
//   }

//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// // Parse API response safely
// const parseResponse = async (response) => {
//   const text = await response.text();

//   let result = {};

//   try {
//     result = text ? JSON.parse(text) : {};
//   } catch {
//     result = { message: text || "Invalid server response." };
//   }

//   if (!response.ok) {
//     throw new Error(
//       result?.error?.message ||
//       result?.message ||
//       `Request failed: ${response.status}`
//     );
//   }

//   return result;
// };

// // GET PRODUCTS
// export const getProducts = async () => {
//   const url =
//     `${API_URL}/api/products?populate=*&pagination[pageSize]=100`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       ...getHeaders(),
//     },
//   });

//   return parseResponse(response);
// };

// // GET CATEGORIES
// export const getCategories = async () => {
//   const url =
//     `${API_URL}/api/categories?populate=*&pagination[pageSize]=100`;

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       ...getHeaders(),
//     },
//   });

//   return parseResponse(response);
// };

// // UPLOAD LOCAL IMAGES
// export const uploadImages = async (files) => {
//   if (!files || !Array.isArray(files) || files.length === 0) {
//     throw new Error("Please select at least one image.");
//   }

//   const formData = new FormData();

//   files.forEach((file) => {
//     if (file instanceof File && file.size > 0) {
//       formData.append("files", file, file.name);
//     }
//   });

//   if (!formData.has("files")) {
//     throw new Error("Files are empty. Please select valid image files.");
//   }

//   const response = await fetch(`${API_URL}/api/upload`, {
//     method: "POST",
//     headers: getHeaders(),
//     body: formData,
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       result?.error?.message || "Image upload failed."
//     );
//   }

//   return Array.isArray(result) ? result : [];
// };

// // UPLOAD IMAGE FROM URL
// export const uploadImageFromUrl = async (imageUrl) => {
//   if (
//     typeof imageUrl !== "string" ||
//     !/^https?:\/\/\S+$/i.test(imageUrl)
//   ) {
//     throw new Error("Please provide a valid image URL.");
//   }

//   const response = await fetch(
//     `${API_URL}/api/upload`,
//     {
//       method: "POST",
//       headers: getHeaders(),
//       body: (() => {
//         const formData = new FormData();
//         formData.append("url", imageUrl);
//         return formData;
//       })(),
//     }
//   );

//   const result = await parseResponse(response);

//   const file = Array.isArray(result) ? result[0] : result;

//   if (!file?.id) {
//     throw new Error("Strapi did not return the uploaded image.");
//   }

//   return { file };
// };

// // CREATE PRODUCT
// export const createProduct = async (productData) => {
//   const response = await fetch(`${API_URL}/api/products`, {
//     method: "POST",
//     headers: {
//       ...getHeaders(),
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       data: productData,
//     }),
//   });

//   return parseResponse(response);
// };

// // UPDATE PRODUCT
// export const updateProduct = async (documentId, productData) => {
//   if (!documentId) {
//     throw new Error("Product documentId is required.");
//   }

//   const response = await fetch(
//     `${API_URL}/api/products/${encodeURIComponent(documentId)}`,
//     {
//       method: "PUT",
//       headers: {
//         ...getHeaders(),
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         data: productData,
//       }),
//     }
//   );

//   return parseResponse(response);
// };

// // DELETE PRODUCT
// export const deleteProduct = async (documentId) => {
//   if (!documentId) {
//     throw new Error("Product documentId is required.");
//   }

//   const response = await fetch(
//     `${API_URL}/api/products/${encodeURIComponent(documentId)}`,
//     {
//       method: "DELETE",
//       headers: getHeaders(),
//     }
//   );

//   return parseResponse(response);
// };