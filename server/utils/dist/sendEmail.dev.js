"use strict";

var nodemailer = require("nodemailer");

var sendEmail = function sendEmail(to, subject, text) {
  var transporter, mailOptions;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.EMAIL_USER,
              // 🔐 set this in .env
              pass: process.env.EMAIL_PASS // 🔐 set this too

            }
          });
          mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          console.log("✅ Email sent to:", to);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("❌ Failed to send email:", _context.t0.message);
          throw _context.t0;

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = sendEmail;