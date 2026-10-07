const API_URL = "http://localhost:1337";

// TOKEN

const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return token;
};

// HEADERS

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// RESPONSE HANDLER

const handleResponse = async (response) => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        result?.message ||
        "Something went wrong"
    );
  }

  return result;
};

// GET USERS

export const getDashboardUsers = async () => {
  const response = await fetch(
    `${API_URL}/api/users?pagination[pageSize]=100`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

// GET ORDERS COUNT

export const getDashboardOrders = async () => {
  const response = await fetch(
    `${API_URL}/api/orders?pagination[pageSize]=1`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

// GET PRODUCTS

export const getDashboardProducts = async () => {
  const response = await fetch(
    `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return handleResponse(response);
};

export { API_URL };