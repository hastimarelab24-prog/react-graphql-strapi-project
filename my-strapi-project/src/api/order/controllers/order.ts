import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface AuthenticatedUser {
  id: number | string;
  email: string;
  username?: string;
}

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => {
    // JWT Authentication helper function
    async function authenticateUser(ctx: any): Promise<AuthenticatedUser | null> {
      let authHeader =
        ctx.request.header.authorization || ctx.request.header.Authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
      }

      let token = authHeader.split(" ")[1];
      if (!token) return null;

      token = token.replace(/^"(.*)"$/, "$1").trim();

      try {
        const decoded = await strapi.plugins[
          "users-permissions"
        ].services.jwt.verify(token);

        if (!decoded || !decoded.id) return null;

        const user = (await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          decoded.id
        )) as unknown as AuthenticatedUser | null;

        return user;
      } catch (err) {
        return null;
      }
    }

    return {
      // 1. CREATE PAYMENT INTENT
      async createPaymentIntent(ctx: any) {
        try {
          const user = await authenticateUser(ctx);
          if (!user) {
            return ctx.unauthorized("Missing or invalid credentials");
          }

          const body = ctx.request.body || {};
          
          // Check root amount or nested data.amount
          const rawAmount = body.amount !== undefined ? body.amount : body.data?.amount;
          const amount = Math.round(Number(rawAmount));

          // Strict checking for invalid amounts
          if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
            return ctx.badRequest("Valid amount is required");
          }

          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "inr",
            automatic_payment_methods: { enabled: true },
          });

          return ctx.send({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            currency: "inr",
          });
        } catch (error) {
          console.error("Create Payment Intent Error:", error);
          return ctx.internalServerError(
            error instanceof Error
              ? error.message
              : "Payment intent creation failed"
          );
        }
      },

      // 2. CREATE ORDER IN STRAPI DB
      async createOrder(ctx: any) {
        try {
          const user = await authenticateUser(ctx);
          if (!user) {
            return ctx.unauthorized("Missing or invalid credentials");
          }

          const body = ctx.request.body || {};
          const data = body.data || body;

          const order = await strapi.entityService.create("api::order.order", {
            data: {
              orderId: data.orderId || `ORD-${Date.now()}`,
              shippingAddress: data.shippingAddress || "",
              city: data.city || "",
              state: data.state || "",
              pin: data.pin || "",
              amount: data.amount,
              items: data.items || [],
              user: user.id,
              email: user.email,
              paymentId: data.paymentId,
              paymentStatus: data.paymentStatus || "paid",
              orderStatus: data.orderStatus || "pending",
            },
          });

          return ctx.send({
            success: true,
            message: "Order created successfully",
            order,
          });
        } catch (error) {
          console.error("CREATE ORDER ERROR:", error);
          return ctx.internalServerError(
            error instanceof Error ? error.message : "Order creation failed"
          );
        }
      },
    };
  }
);