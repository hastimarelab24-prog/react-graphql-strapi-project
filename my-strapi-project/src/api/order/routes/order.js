// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.default = {
//     routes: [
//         {
//             method: "POST",
//             path: "/orders/create-payment-intent",
//             handler: "order.createPaymentIntent",
//             config: {
//                 auth: false,
//                 policies: [],
//                 middlewares: [],
//             },
//         },
//         {
//             method: "POST",
//             path: "/orders/create-order",
//             handler: "order.createOrder",
//             config: {
//                 auth: false,
//                 policies: [],
//                 middlewares: [],
//             },
//         },
//     ],
// };

"use strict";


export default {
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