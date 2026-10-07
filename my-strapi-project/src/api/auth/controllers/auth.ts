import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async updateLoginStatus(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("You must be logged in.");
        }

        const updatedUser =
          await strapi
            .plugin("users-permissions")
            .service("user")
            .edit(user.id, {
              isOnline: true,
              lastLoginAt: new Date(),
            });

        return ctx.send({
          success: true,
          message: "Login status updated successfully.",
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            isOnline: updatedUser.isOnline,
            lastLoginAt: updatedUser.lastLoginAt,
          },
        });
      } catch (error) {
        console.error(
          "UPDATE LOGIN STATUS ERROR:",
          error
        );

        return ctx.internalServerError(
          "Unable to update login status."
        );
      }
    },

    async updateLogoutStatus(ctx) {
      try {
        const user = ctx.state.user;

        if (!user) {
          return ctx.unauthorized("You must be logged in.");
        }

        const updatedUser =
          await strapi
            .plugin("users-permissions")
            .service("user")
            .edit(user.id, {
              isOnline: false,
            });

        return ctx.send({
          success: true,
          message: "Logout status updated successfully.",
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            isOnline: updatedUser.isOnline,
            lastLoginAt: updatedUser.lastLoginAt,
          },
        });
      } catch (error) {
        console.error(
          "UPDATE LOGOUT STATUS ERROR:",
          error
        );

        return ctx.internalServerError(
          "Unable to update logout status."
        );
      }
    },
  })
);