"use strict";

import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async findOrders(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("Missing or invalid credentials");
        }

        const orders = await strapi.documents("api::order.order").findMany({
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
        console.error("FIND ORDERS ERROR:", error);

        return ctx.internalServerError(
          error instanceof Error ? error.message : "Failed to fetch orders",
        );
      }
    },

    async findOrder(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("Missing or invalid credentials");
        }

        const { documentId } = ctx.params;

        if (!documentId) {
          return ctx.badRequest("Document ID is required");
        }

        const order = await strapi.documents("api::order.order").findOne({
          documentId,
          populate: {
            user: true,
          },
        });

        if (!order) {
          return ctx.notFound("Order not found");
        }

        return ctx.send({
          data: order,
        });
      } catch (error) {
        console.error("FIND ORDER ERROR:", error);

        return ctx.internalServerError(
          error instanceof Error ? error.message : "Failed to fetch order",
        );
      }
    },

    async createPaymentIntent(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("Missing or invalid credentials");
        }

        const body = ctx.request.body || {};

        const amount = body.amount ?? body.data?.amount;

        // -----------------------------------------------------
        // Validate amount
        // -----------------------------------------------------
        if (amount === undefined || amount === null || amount === "") {
          return ctx.badRequest("Amount is required");
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount)) {
          return ctx.badRequest("Valid amount is required");
        }

        if (!Number.isInteger(numericAmount)) {
          return ctx.badRequest("Amount must be an integer in paise");
        }

        // Minimum ₹50 = 5000 paise
        if (numericAmount < 5000) {
          return ctx.badRequest("Minimum order amount is ₹50");
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: numericAmount,
          currency: "inr",

          automatic_payment_methods: {
            enabled: true,
          },
        });

        return ctx.send({
          success: true,

          clientSecret: paymentIntent.client_secret,

          paymentIntentId: paymentIntent.id,

          amount: numericAmount,

          currency: "inr",
        });
      } catch (error) {
        console.error("CREATE PAYMENT INTENT ERROR:", error);

        return ctx.internalServerError(
          error instanceof Error
            ? error.message
            : "Payment intent creation failed",
        );
      }
    },

    async createOrder(ctx) {
      try {
        const user = ctx.state.user;
        // Check login
        if (!user) {
          return ctx.unauthorized("Missing or invalid credentials");
        }

        const body = ctx.request.body || {};
        const data = body.data || body;

        // Validate required fields
        if (!data.orderId) {
          return ctx.badRequest("Order ID is required");
        }

        if (!data.shippingAddress) {
          return ctx.badRequest("Shipping address is required");
        }

        if (!data.city) {
          return ctx.badRequest("City is required");
        }

        if (!data.state) {
          return ctx.badRequest("State is required");
        }

        if (
          data.amount === undefined ||
          data.amount === null ||
          data.amount === ""
        ) {
          return ctx.badRequest("Order amount is required");
        }

        if (!data.items) {
          return ctx.badRequest("Order items are required");
        }

        // parse items
        let orderItems: any[] = [];
        if (Array.isArray(data.items)) {
          orderItems = data.items;
        } else if (typeof data.items === "string") {
          try {
            orderItems = JSON.parse(data.items);
          } catch {
            return ctx.badRequest("Invalid order items format");
          }
        }

        if (!Array.isArray(orderItems)) {
          return ctx.badRequest("orders items must be an array");
        }
        if (orderItems.length === 0) {
          return ctx.badRequest("orders must cotain at least one product");
        }

        // Convert amount
        const numericAmount = Number(data.amount);

        if (!Number.isFinite(numericAmount)) {
          return ctx.badRequest("Valid order amount is required");
        }

        // duplicate orders protection
        const existingOrders = await strapi
          .documents("api::order.order")
          .findMany({
            filters: { orderId: { $eq: data.orderId } },
            limit:1,
          });

          if(existingOrders && existingOrders.length >0){
            return ctx.badRequest("this order has already been created")
          }
          // stock validation
          const stockUpdates:Array < {documentId:string;
            name:string;currentStock:number;quantity:number;newStock:number;
          }>=[];
          for(const item of orderItems){
            // product id
            const productDocumentId=item?.documentId || item?.productDocumentId|| item?.productId;
            const productId=item?.id;
            if(!productDocumentId && !productId){
              return ctx.badRequest("product id is missing from order items")
            }
            // qty
            const quantity =Number(item?.qty?? item?.quantity ?? 1);
            if(!Number.isInteger(quantity) || quantity<=0){
              return ctx.badReqest("products qtu must be a positive whole number")
            }
            // find products
            let product:any=null;
            if(productDocumentId){
              product=await strapi.documents("api::product.product").findOne({documentId:productDocumentId,})
          }
          // if document did not find product
          if(!product && productId){
            const products=await strapi.documents("api::product.product").findMany({
              filters:{
                id:{
                  $eq:productId
                }
              }
            })
            product=product?.[0] || null;
          }

          if(!product){
            return ctx.badRequest(`product not found:${item?.name || productDocumentId || productId}`)
          }
          // current stock
          const currentStock=Number(product.stock ?? 0)
          // check stock
          if(currentStock < quantity){
            return ctx.badReques(`not enoght stock for"${product.name}".avalible :${currentStock},Requested:${quantity}`);
          }

          // new stock
        const newStock =
            currentStock - quantity;

          stockUpdates.push({
            documentId:
              product.documentId,
            name: product.name,
            currentStock,
            quantity,
            newStock,
          });
        }
        // Prepare order data
        const orderData: any = {
          orderId: data.orderId,

          shippingAddress: data.shippingAddress,

          city: data.city,

          state: data.state,

          amount: numericAmount,

          items: data.items,

          email: data.email || user.email,

          paymentId: data.paymentId || null,

          paymentStatus: data.paymentStatus || "paid",

          orderStatus: data.orderStatus || "pending",

          user: user.id,
        };

     
        // PIN FIX
        
        if (data.pin !== undefined && data.pin !== null && data.pin !== "") {
          const numericPin = Number(data.pin);

          if (!Number.isInteger(numericPin)) {
            return ctx.badRequest("PIN must be a valid number");
          }

          orderData.pin = numericPin;
        }

        // Create order in Strapi
        const order = await strapi.documents("api::order.order").create({
          data: orderData,
        });

        // decrease cproduct stock
             for (const update of stockUpdates) {
          await strapi
            .documents("api::product.product")
            .update({
              documentId:
                update.documentId,

              data: {
                stock:
                  update.newStock,
              },
            });

          console.log(
            `Stock updated: ${update.name} | ${update.currentStock} -> ${update.newStock}`,
          );
        }

        return ctx.send({
          success: true,

          message: "Order created successfully",

          order,
          stockUpdates,
        });
      } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return ctx.internalServerError(
          error instanceof Error ? error.message : "Order creation failed",
        );
      }
    },
  }),
);
