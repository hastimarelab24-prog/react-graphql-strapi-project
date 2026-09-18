export default {
  routes: [
    {
      method: "POST",
      path: "/orders/create-order",
     handler: "api::order.order.createPaymentIntent",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};