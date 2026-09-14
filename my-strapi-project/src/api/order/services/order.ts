export default {
  routes: [

    {
      method: "POST",

      path: "/orders/create-payment-intent",

      handler:
        "order.createPaymentIntent",

      config: {
        auth: false,
      },
    },


    {
      method: "POST",

      path: "/orders/create-order",

      handler:
        "order.createOrder",

      config: {
        auth: false,
      },
    },

  ],
};