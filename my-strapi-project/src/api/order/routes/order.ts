"use strict";

module.exports = {
  routes: [
    // =====================================================
    // GET ALL ORDERS
    // GET /api/orders
    // =====================================================
    {
      method: "GET",
      path: "/orders",
      handler: "order.findOrders",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // GET SINGLE ORDER
    // GET /api/orders/:documentId
    // =====================================================
    {
      method: "GET",
      path: "/orders/:documentId",
      handler: "order.findOrder",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // CREATE PAYMENT INTENT
    // POST /api/orders/create-payment-intent
    // =====================================================
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "order.createPaymentIntent",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // CREATE ORDER
    // POST /api/orders/create-order
    // =====================================================
    {
      method: "POST",
      path: "/orders/create-order",
      handler: "order.createOrder",
      config: {
        auth: {},
        policies: [],
        middlewares: [],
      },
    },
  ],
};

