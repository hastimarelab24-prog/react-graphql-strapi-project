"use strict";

module.exports = {
  routes: [
    // =====================================================
    // GET ALL ORDERS
    // =====================================================
    {
      method: "GET",
      path: "/orders",
      handler: "order.findOrders",
      config: {
        auth: true,
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // GET SINGLE ORDER
    // =====================================================
    {
      method: "GET",
      path: "/orders/:documentId",
      handler: "order.findOrder",
      config: {
        auth: true,
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // CREATE PAYMENT INTENT
    // =====================================================
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "order.createPaymentIntent",
      config: {
        auth: true,
        policies: [],
        middlewares: [],
      },
    },

    // =====================================================
    // CREATE ORDER
    // =====================================================
    {
      method: "POST",
      path: "/orders/create-order",
      handler: "order.createOrder",
      config: {
        auth: true,
        policies: [],
        middlewares: [],
      },
    },
  ],
};