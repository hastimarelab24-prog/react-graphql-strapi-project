"use strict";

const { factories } = require("@strapi/strapi");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({

    // =====================================================
    // GET ALL ORDERS
    // =====================================================
    async findOrders(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "Missing or invalid credentials"
          );
        }

        const orders = await strapi
          .documents("api::order.order")
          .findMany({
            sort: ["createdAt:desc"],
            limit: 100,
            populate: {
              user: true,
            },
          });

        return ctx.send({
          data: orders,
          meta: {
            total: orders.length,
          },
        });
      } catch (error) {
        console.error(
          "FIND ORDERS ERROR:",
          error
        );

        return ctx.internalServerError(
          error?.message ||
            "Failed to fetch orders"
        );
      }
    },

    // =====================================================
    // GET SINGLE ORDER
    // =====================================================
    async findOrder(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "Missing or invalid credentials"
          );
        }

        const { documentId } = ctx.params;

        if (!documentId) {
          return ctx.badRequest(
            "Document ID is required"
          );
        }

        const order = await strapi
          .documents("api::order.order")
          .findOne({
            documentId,
            populate: {
              user: true,
            },
          });

        if (!order) {
          return ctx.notFound(
            "Order not found"
          );
        }

        return ctx.send({
          data: order,
        });
      } catch (error) {
        console.error(
          "FIND ORDER ERROR:",
          error
        );

        return ctx.internalServerError(
          error?.message ||
            "Failed to fetch order"
        );
      }
    },

    // =====================================================
    // CREATE PAYMENT INTENT
    // =====================================================
    async createPaymentIntent(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "Missing or invalid credentials"
          );
        }

        const body =
          ctx.request.body || {};

        const amount =
          body.amount ??
          body.data?.amount;

        if (
          amount === undefined ||
          amount === null ||
          amount === ""
        ) {
          return ctx.badRequest(
            "Amount is required"
          );
        }

        const numericAmount =
          Number(amount);

        if (
          !Number.isFinite(
            numericAmount
          )
        ) {
          return ctx.badRequest(
            "Valid amount is required"
          );
        }

        if (
          !Number.isInteger(
            numericAmount
          )
        ) {
          return ctx.badRequest(
            "Amount must be an integer in paise"
          );
        }

        // ₹50 minimum
        if (numericAmount < 5000) {
          return ctx.badRequest(
            "Minimum order amount is ₹50"
          );
        }

        const paymentIntent =
          await stripe.paymentIntents.create({
            amount: numericAmount,
            currency: "inr",
            automatic_payment_methods: {
              enabled: true,
            },
          });

        return ctx.send({
          success: true,
          clientSecret:
            paymentIntent.client_secret,
          paymentIntentId:
            paymentIntent.id,
          amount: numericAmount,
          currency: "inr",
        });
      } catch (error) {
        console.error(
          "CREATE PAYMENT INTENT ERROR:",
          error
        );

        return ctx.internalServerError(
          error?.message ||
            "Payment intent creation failed"
        );
      }
    },

    // =====================================================
    // CREATE ORDER
    // =====================================================
    async createOrder(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized(
            "Missing or invalid credentials"
          );
        }

        const body =
          ctx.request.body || {};

        const data =
          body.data || body;

        if (!data.orderId) {
          return ctx.badRequest(
            "Order ID is required"
          );
        }

        if (!data.shippingAddress) {
          return ctx.badRequest(
            "Shipping address is required"
          );
        }

        if (!data.city) {
          return ctx.badRequest(
            "City is required"
          );
        }

        if (!data.state) {
          return ctx.badRequest(
            "State is required"
          );
        }

        if (
          data.amount === undefined ||
          data.amount === null ||
          data.amount === ""
        ) {
          return ctx.badRequest(
            "Order amount is required"
          );
        }

        if (!data.items) {
          return ctx.badRequest(
            "Order items are required"
          );
        }

        const order =
          await strapi
            .documents("api::order.order")
            .create({
              data: {
                orderId:
                  data.orderId,

                shippingAddress:
                  data.shippingAddress,

                city:
                  data.city,

                state:
                  data.state,

                pin: data.pin
                  ? Number(data.pin)
                  : null,

                amount:
                  Number(data.amount),

                items:
                  data.items,

                email:
                  data.email ||
                  user.email,

                paymentId:
                  data.paymentId ||
                  null,

                paymentStatus:
                  data.paymentStatus ||
                  "paid",

                orderStatus:
                  data.orderStatus ||
                  "pending",

                user:
                  user.id,
              },
            });

        return ctx.send({
          success: true,
          message:
            "Order created successfully",
          order,
        });
      } catch (error) {
        console.error(
          "CREATE ORDER ERROR:",
          error
        );

        return ctx.internalServerError(
          error?.message ||
            "Order creation failed"
        );
      }
    },
  })
);