const API_URL = "http://localhost:1337";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

/* =====================================================
   USERS
===================================================== */

export const getDashboardUsers =
  async () => {
    const response = await fetch(
      `${API_URL}/api/users?pagination[pageSize]=100`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const text =
        await response.text();

      throw new Error(
        `Users request failed: ${response.status} ${text}`
      );
    }

    return response.json();
  };

/* =====================================================
   ORDERS
===================================================== */

export const getDashboardOrders =
  async () => {
    const response = await fetch(
      `${API_URL}/api/orders?pagination[pageSize]=100`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const text =
        await response.text();

      throw new Error(
        `Orders request failed: ${response.status} ${text}`
      );
    }

    return response.json();
  };

/* =====================================================
   PRODUCTS
===================================================== */

export const getDashboardProducts =
  async () => {
    const response = await fetch(
      `${API_URL}/api/products?populate=*&pagination[pageSize]=100`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const text =
        await response.text();

      throw new Error(
        `Products request failed: ${response.status} ${text}`
      );
    }

    return response.json();
  };