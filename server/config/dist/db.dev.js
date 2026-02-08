"use strict";

// server/config/db.js
var mongoose = require("mongoose");

var connectDB = function connectDB() {
  var conn;
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGO_URI, {
            // Remove deprecated options
            serverSelectionTimeoutMS: 30000
          }));

        case 3:
          conn = _context.sent;
          console.log("\u2705 MongoDB connected: ".concat(conn.connection.host)); // Handle connection errors after initial connection

          mongoose.connection.on("error", function (err) {
            console.error("\u274C MongoDB connection error: ".concat(err));
          });
          mongoose.connection.on("disconnected", function () {
            console.warn("⚠️  MongoDB disconnected");
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("\u274C MongoDB connection error: ".concat(_context.t0.message));
          process.exit(1); // Exit process with failure

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = connectDB;