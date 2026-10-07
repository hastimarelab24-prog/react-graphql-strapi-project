const API_URL = "http://localhost:1337";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getResponseData = async (response) => {
  let result = {};

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response received from Strapi.");
  }

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Failed to fetch orders."
    );
  }

  return result;
};

export const getOrders = async () => {
  const response = await fetch(
    `${API_URL}/api/orders?sort=createdAt:desc&pagination[pageSize]=100`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return getResponseData(response);
};

export { API_URL };