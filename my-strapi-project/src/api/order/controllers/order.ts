
import { factories } from "@strapi/strapi";
import Stripe from "stripe";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({

    // 1. Create Stripe Payment Intent
    async createPaymentIntent(ctx) {
      try {
        const { amount } = ctx.request.body;

        if (!amount || amount <= 0) {
          return ctx.badRequest("Valid amount is required");
        }

        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey) {
          return ctx.internalServerError(
            "Stripe secret key is missing"
          );
        }

        const stripe = new Stripe(stripeSecretKey);

        const paymentIntent =
          await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "inr",
            automatic_payment_methods: {
              enabled: true,
            },
          });

        return ctx.send({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });

      } catch (error) {
        strapi.log.error(error);

        return ctx.internalServerError(
          "Failed to create payment intent"
        );
      }
    },


    // 2. Create Order
    async createOrder(ctx) {
      try {
        const { data } = ctx.request.body;

        if (!data) {
          return ctx.badRequest("Order data is required");
        }

        const order = await strapi.entityService.create(
          "api::order.order",
          {
            data,
          }
        );

        return ctx.send({
          message: "Order created successfully",
          order,
        });

      } catch (error) {
        strapi.log.error(error);

        return ctx.internalServerError(
          "Failed to create order"
        );
      }
    },

  })
);