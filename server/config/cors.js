// server/config/cors.js

const getCorsOptions = () => {
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [
          process.env.CLIENT_URL, // Primary production URL
          "https://connectingconstructions1.netlify.app",
          "https://connectingconstructions1.vercel.app",
        ].filter(Boolean) // Remove undefined values
      : ["http://localhost:3000", "http://localhost:3001"];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeadrers: ["Set-Cookie"],
  };
};

module.exports = getCorsOptions;
