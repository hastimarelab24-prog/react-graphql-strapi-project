const API_URL = "http://localhost:1337";

// GET TOKEN

const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Please login before managing categories."
    );
  }

  return token;
};

// JSON HEADERS

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

// RESPONSE HANDLER

const getResponseData = async (response) => {
  const text = await response.text();

  let result = {};

  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Strapi returned an invalid response. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        result?.message ||
        "Something went wrong"
    );
  }

  return result;
};

// GET ALL CATEGORIES

export const getCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/categories?populate=products&pagination[pageSize]=100&sort=name:asc`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

// CREATE CATEGORY

export const createCategory = async (name) => {
  const response = await fetch(
    `${API_URL}/api/categories`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          name,
        },
      }),
    }
  );

  return getResponseData(response);
};

// DELETE CATEGORY

export const deleteCategory = async (
  documentId
) => {
  const response = await fetch(
    `${API_URL}/api/categories/${encodeURIComponent(
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