"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "order.createPaymentIntent",
      config: {
        policies: [],
        middlewares: [],
      },
    },

    {
      method: "POST",
      path: "/orders/create-order",
      handler: "order.createOrder",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};