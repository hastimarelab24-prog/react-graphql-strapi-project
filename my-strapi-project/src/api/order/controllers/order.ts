import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const PRODUCT_UID = "api::product.product";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    // CREATE STRIPE PAYMENT INTENT
    async createPaymentIntent(ctx) {
      try {
        const { amount } = ctx.request.body;

        if (!amount || Number(amount) <= 0) {
          return ctx.badRequest("Invalid amount");
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(amount) * 100),

          currency: "inr",

          automatic_payment_methods: {
            enabled: true,
          },
        });

        return {
          success: true,

          clientSecret: paymentIntent.client_secret,

          paymentIntentId: paymentIntent.id,
        };
      } catch (error: any) {
        console.error("Stripe Payment Intent Error:", error);

        return ctx.internalServerError(
          error.message || "Payment intent creation failed",
        );
      }
    },

    // CREATE ORDER AFTER SUCCESSFUL PAYMENT

    async createOrder(ctx) {
      try {
        const data = ctx.request.body?.data;

        if (!data) {
          return ctx.badRequest("Order data is required");
        }

        // GET DATA

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

        // VALIDATION
        if (!orderId) {
          return ctx.badRequest("Order ID is required");
        }

        if (!shippingAddress?.trim()) {
          return ctx.badRequest("Shipping address is required");
        }

        if (!city?.trim()) {
          return ctx.badRequest("City is required");
        }

        if (!amount || Number(amount) <= 0) {
          return ctx.badRequest("Invalid order amount");
        }

        if (!Array.isArray(items) || items.length === 0) {
          return ctx.badRequest("Order items are required");
        }

        if (!user) {
          return ctx.badRequest("User is required");
        }

        if (!email) {
          return ctx.badRequest("Email is required");
        }

        if (!paymentId) {
          return ctx.badRequest("Payment ID is required");
        }
        // CHECK STRIPE PAYMENT

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

        // console.log(
        //   "Stripe Payment Status:",
        //   paymentIntent.status
        // );

        if (paymentIntent.status !== "succeeded") {
          return ctx.badRequest("Payment is not successful");
        }

        // check stock for all products

        // CHECK STOCK FOR ALL PRODUCTS

        const stockUpdates: any[] = [];

        for (const item of items) {
          const documentId = item.documentId;
          const quantity = Number(item.qty) || 1;

          if (!documentId) {
            return ctx.badRequest("Product documentId is missing");
          }

          if (quantity <= 0) {
            return ctx.badRequest("Invalid product quantity");
          }

          // FIND PRODUCT

          const product = await strapi.db.query(PRODUCT_UID).findOne({
            where: {
              documentId: String(documentId),
            },
          });

          if (!product) {
            return ctx.badRequest(`Product not found: ${documentId}`);
          }

          // CHECK STOCK

          const currentStock = Number(product.stock) || 0;

          if (currentStock < quantity) {
            return ctx.badRequest(`${product.name} has insufficient stock`);
          }

          // PREPARE STOCK UPDATE

          stockUpdates.push({
            productId: product.id,
            productName: product.name,
            currentStock,
            quantity,
            newStock: currentStock - quantity,
          });
        }
        // CREATE ORDER DATA
        const orderData: any = {
          orderId: String(orderId),

          shippingAddress: String(shippingAddress),

          city: String(city),

          amount: Math.round(Number(amount)),

          items: items,

          user: String(user),

          email: String(email),

          paymentId: String(paymentId),

          paymentStatus: "paid",
        };

        // State is optional

        if (state !== undefined && state !== null && state !== "") {
          orderData.state = String(state);
        }

        // Pin is optional

        if (pin !== undefined && pin !== null && pin !== "") {
          orderData.pin = Number(pin);
        }

        // SAVE ORDER IN STRAPI

        const order = await strapi.entityService.create("api::order.order", {
          data: orderData,
        });

        console.log("Order Created:", order);

        // decrease product stock
        for (const stock of stockUpdates) {
          await strapi.db.query(PRODUCT_UID).update({
            where: {
              id: stock.productId,
            },
            data: {
              stock: stock.newStock,
            },
          });
          console.log(
            `Stock updates:${stock.productName} |` +
              `${stock.currentStock}->${stock.newStock}`,
          );
        }
        // SUCCESS

        return {
          success: true,

          message: "Payment successful and order created",

          order,
        };
      } catch (error: any) {
        console.error("Create Order Error:", error);

        return ctx.internalServerError(
          error.message || "Order creation failed",
        );
      }
    },
  }),
);
