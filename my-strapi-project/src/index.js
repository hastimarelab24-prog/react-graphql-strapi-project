"use strict";

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query {
          adminOrders: [Order]
        }
      `,
      resolvers: {
        Query: {
          adminOrders: {
            resolve: async () => {
              // Strapi Entity Service વડે સીધો ડેટા મેળવો (આમાં Permission check નહિ લાગે)
              const orders = await strapi.documents('api::order.order').findMany();
              return orders;
            },
            auth: false, // Permission check ડીઝેબલ કરવા માટે
          },
        },
      },
    }));
  },

  bootstrap() {
    console.log('GraphQL extension for adminOrders is registered.');
  },
};