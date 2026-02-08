const express = require("express");
const app = express();
const authRoutes = require("./server/routes/auth");

app.use("/api/auth", authRoutes);

authRoutes.stack.forEach((middleware) => {
    if (middleware.route) {
        // routes registered directly on the router
        const methods = Object.keys(middleware.route.methods).join(", ").toUpperCase();
        console.log(`[${methods}] ${middleware.route.path}`);
    }
});
