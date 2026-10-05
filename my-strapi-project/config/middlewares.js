"use strict"
module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:3000", "http://localhost:5173"], // Add your React URL here
      headers: ["Content-Type", "Authorization", "origin", "Accept"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
