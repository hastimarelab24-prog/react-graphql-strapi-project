export default {
  routes: [
    {
      method: "POST",
      path: "/auth/update-login-status",
      handler: "auth.updateLoginStatus",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/auth/update-logout-status",
      handler: "auth.updateLogoutStatus",
      config: {
        policies: [],
      },
    },
  ],
};