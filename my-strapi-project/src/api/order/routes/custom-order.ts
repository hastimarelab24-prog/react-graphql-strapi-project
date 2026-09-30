export default {
  routes: [
    {
      method: "POST",
      path: "/orders/create-payment-intent",
      handler: "order.createPaymentIntent",
      config: {
        auth: false, // Disables default Strapi route guard so custom JWT logic works
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/orders/create-order",
      handler: "order.createOrder",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};