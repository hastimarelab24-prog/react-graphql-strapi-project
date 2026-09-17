export default {
  routes: [
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "api::order.order.createPaymentIntent",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/create-order",
      handler: "api::order.order.createOrder",
      config: {
        auth: false,
      },
    },
  ],
};