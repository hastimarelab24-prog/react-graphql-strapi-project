import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({

    // ============================================
    // CREATE STRIPE PAYMENT INTENT
    // ============================================

    async createPaymentIntent(ctx) {
      try {
        const { amount } = ctx.request.body;

        if (!amount || Number(amount) <= 0) {
          return ctx.badRequest("Invalid amount");
        }

        const paymentIntent =
          await stripe.paymentIntents.create({
            amount: Math.round(
              Number(amount) * 100
            ),

            currency: "inr",

            automatic_payment_methods: {
              enabled: true,
            },
          });

        return {
          success: true,

          clientSecret:
            paymentIntent.client_secret,

          paymentIntentId:
            paymentIntent.id,
        };

      } catch (error: any) {

        console.error(
          "Stripe Payment Intent Error:",
          error
        );

        return ctx.internalServerError(
          error.message ||
            "Payment intent creation failed"
        );
      }
    },


    // ============================================
    // CREATE ORDER AFTER SUCCESSFUL PAYMENT
    // ============================================

    async createOrder(ctx) {

      try {

        const body = ctx.request.body;

        const data = body?.data;

        if (!data) {
          return ctx.badRequest(
            "Order data is required"
          );
        }


        // ========================================
        // GET DATA
        // ========================================

        const {
          orderId,
          shippingAddress,
          city,
          state,
          pin,
          amount,
          items,
          user,
          email,
          paymentId,
        } = data;


        // ========================================
        // VALIDATION
        // ========================================

        if (!orderId) {
          return ctx.badRequest(
            "Order ID is required"
          );
        }

        if (!shippingAddress) {
          return ctx.badRequest(
            "Shipping address is required"
          );
        }

        if (!city) {
          return ctx.badRequest(
            "City is required"
          );
        }

        if (!amount || Number(amount) <= 0) {
          return ctx.badRequest(
            "Invalid order amount"
          );
        }

        if (!items || !Array.isArray(items)) {
          return ctx.badRequest(
            "Order items are required"
          );
        }

        if (!user) {
          return ctx.badRequest(
            "User is required"
          );
        }

        if (!email) {
          return ctx.badRequest(
            "Email is required"
          );
        }

        if (!paymentId) {
          return ctx.badRequest(
            "Payment ID is required"
          );
        }


        // ========================================
        // CHECK STRIPE PAYMENT
        // ========================================

        const paymentIntent =
          await stripe.paymentIntents.retrieve(
            paymentId
          );


        console.log(
          "Stripe Payment Status:",
          paymentIntent.status
        );


        if (
          paymentIntent.status !==
          "succeeded"
        ) {

          return ctx.badRequest(
            "Payment is not successful"
          );
        }


        // ========================================
        // CREATE ORDER DATA
        // ========================================

        const orderData: any = {

          orderId:
            String(orderId),

          shippingAddress:
            String(shippingAddress),

          city:
            String(city),

          amount:
            Math.round(
              Number(amount)
            ),

          items:
            items,

          user:
            String(user),

          email:
            String(email),

          paymentId:
            String(paymentId),

          paymentStatus:
            "paid",
        };


        // State is optional

        if (
          state !== undefined &&
          state !== null &&
          state !== ""
        ) {

          orderData.state =
            String(state);
        }


        // Pin is optional

        if (
          pin !== undefined &&
          pin !== null &&
          pin !== ""
        ) {

          orderData.pin =
            Number(pin);
        }


        // ========================================
        // SAVE ORDER IN STRAPI
        // ========================================

        const order =
          await strapi.entityService.create(
            "api::order.order",
            {
              data: orderData,
            }
          );


        console.log(
          "Order Created:",
          order
        );


        // ========================================
        // SUCCESS
        // ========================================

        return {

          success: true,

          message:
            "Payment successful and order created",

          order,
        };


      } catch (error: any) {

        console.error(
          "Create Order Error:",
          error
        );

        return ctx.internalServerError(
          error.message ||
            "Order creation failed"
        );
      }
    },

  })
);