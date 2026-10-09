
export default {
  routes: [
    {
      method: "POST",
      path: "/products/upload-from-url",
      handler: "api::product.product.uploadFromUrl",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};