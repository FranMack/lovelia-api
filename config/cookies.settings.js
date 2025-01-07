export const cookiesSettings = {
  secure: true, // Only send the cookie over HTTPS
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  sameSite: "Lax", // Treat the cookie as first-party for navigation requests
  domain: ".lovelia.me", // Share the cookie across subdomains
  path: "/", // Allow the cookie on all routes
};
