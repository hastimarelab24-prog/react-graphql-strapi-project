"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.default = strapi_1.factories.createCoreController("api::order.order", ({ strapi }) => ({
    async createPaymentIntent(ctx) {
        try {
            const body = ctx.request.body || {};
            const rawAmount = body.amount ?? body.data?.amount;
            const amount = Number(rawAmount);
            console.log("Payment Intent Body:", body);
            console.log("Received Amount:", rawAmount);
            console.log("Converted Amount:", amount);
            if (!Number.isFinite(amount) ||
                amount <= 0 ||
                !Number.isInteger(amount)) {
                return ctx.badRequest("Valid amount is required");
            }
            // MINIMUM ORDERS AMOUNT
            const MINIMUM_AMOUNT = 5000;
            if (amount < MINIMUM_AMOUNT) {
                return ctx.badRequest(`Minimum order amount is ₹50}`);
            }
            // CREATE STRAPI PAYMEN INTENT
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "inr",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            console.log("Payment Intent Created:", paymentIntent.id);
            return ctx.send({
                success: true,
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: amount,
                currency: "inr",
            });
        }
        catch (error) {
            console.error("Create Payment Intent Error:", error);
            return ctx.internalServerError(error instanceof Error
                ? error.message
                : "Payment intent creation failed");
        }
    },
    // create order
    async createOrder(ctx) {
        try {
            const body = ctx.request.body || {};
            const data = body.data || body;
            console.log("Create Order Body:", body);
            if (!data.orderId) {
                return ctx.badRequest("Order ID is required");
            }
            if (data.amount === undefined || data.amount === null || data.amount === "") {
                return ctx.badRequest("Order amount is required");
            }
            const order = await strapi.entityService.create("api::order.order", {
                data: {
                    orderId: data.orderId,
                    shippingAddress: data.shippingAddress,
                    city: data.city,
                    state: data.state,
                    pin: data.pin,
                    amount: data.amount,
                    items: data.items,
                    user: data.user,
                    email: data.email,
                    paymentId: data.paymentId,
                    paymentStatus: data.paymentStatus || "paid",
                    orderStatus: data.orderStatus || "pending"
                },
            });
            return ctx.send({
                success: true,
                message: "Order created successfully",
                order,
            });
        }
        catch (error) {
            console.error("Create Order Error:", error);
            return ctx.internalServerError(error instanceof Error ? error.message : "Order creation failed");
        }
    },
}));
