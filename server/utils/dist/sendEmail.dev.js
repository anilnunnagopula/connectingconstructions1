"use strict";

var nodemailer = require("nodemailer");
/**
 * Create email transporter based on environment
 */


var createTransporter = function createTransporter() {
  if (process.env.NODE_ENV === "production") {
    // 🚀 PRODUCTION: Use a real email service
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // 🧪 DEVELOPMENT: Use Ethereal or log to console
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
        pass: process.env.ETHEREAL_PASS || "ethereal_password"
      }
    });
  }
};
/**
 * Generic send email function
 */


var sendEmail = function sendEmail(options) {
  var transporter, mailOptions, info;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transporter = createTransporter();
          mailOptions = {
            from: "".concat(process.env.EMAIL_FROM_NAME || "Connecting Constructions", " <").concat(process.env.EMAIL_FROM || "noreply@connectingconstructions.com", ">"),
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          info = _context.sent;

          // Log preview URL in development
          if (process.env.NODE_ENV !== "production") {
            console.log("📧 Email Preview URL:", nodemailer.getTestMessageUrl(info));
          }

          console.log("✅ Email sent successfully to:", options.email);
          return _context.abrupt("return", info);

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error("❌ Email sending error:", _context.t0);
          throw new Error("Failed to send email");

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
/**
 * Send password reset email
 */


var sendPasswordResetEmail = function sendPasswordResetEmail(user, resetToken) {
  var resetURL, message, html;
  return regeneratorRuntime.async(function sendPasswordResetEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          resetURL = "".concat(process.env.FRONTEND_URL, "/reset-password/").concat(resetToken);
          message = "\nHi ".concat(user.name, ",\n\nYou requested to reset your password for your Connecting Constructions  account.\n\nClick the link below to reset your password:\n").concat(resetURL, "\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nConnecting Constructions Team\n  ");
          html = "\n<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      line-height: 1.6;\n      color: #333;\n      max-width: 600px;\n      margin: 0 auto;\n      padding: 20px;\n    }\n    .container {\n      background-color: #f9f9f9;\n      border-radius: 10px;\n      padding: 30px;\n      border: 1px solid #e0e0e0;\n    }\n    .header {\n      text-align: center;\n      margin-bottom: 30px;\n    }\n    .header h1 {\n      color: #4f46e5;\n      margin: 0;\n    }\n    .button {\n      display: inline-block;\n      padding: 14px 28px;\n      background-color: #4f46e5;\n      color: white;\n      text-decoration: none;\n      border-radius: 6px;\n      margin: 20px 0;\n      font-weight: bold;\n    }\n    .warning {\n      background-color: #fef3c7;\n      border-left: 4px solid #f59e0b;\n      padding: 12px;\n      margin: 20px 0;\n      border-radius: 4px;\n    }\n    .footer {\n      margin-top: 30px;\n      padding-top: 20px;\n      border-top: 1px solid #e0e0e0;\n      font-size: 12px;\n      color: #666;\n      text-align: center;\n    }\n    .link-text {\n      word-break: break-all;\n      color: #4f46e5;\n      font-size: 12px;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <div class=\"header\">\n      <h1>\uD83D\uDD10 Password Reset Request</h1>\n    </div>\n    \n    <p>Hi <strong>".concat(user.name, "</strong>,</p>\n    \n    <p>You requested to reset your password for your Connecting Constructions account.</p>\n    \n    <p>Click the button below to reset your password:</p>\n    \n    <div style=\"text-align: center;\">\n      <a href=\"").concat(resetURL, "\" class=\"button\">Reset Password</a>\n    </div>\n    \n    <p>Or copy and paste this link into your browser:</p>\n    <p class=\"link-text\">").concat(resetURL, "</p>\n    \n    <div class=\"warning\">\n      <strong>\u23F0 Important:</strong> This link will expire in <strong>10 minutes</strong>.\n    </div>\n    \n    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>\n    \n    <div class=\"footer\">\n      <p>Best regards,<br><strong>Connecting Constructions Team</strong></p>\n      <p style=\"margin-top: 10px;\">\n        This is an automated email. Please do not reply to this message.\n      </p>\n    </div>\n  </div>\n</body>\n</html>\n  ");
          _context2.next = 5;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Password Reset Request (Valid for 10 minutes)",
            message: message,
            html: html
          }));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/**
 * Send password changed confirmation email (optional)
 */


var sendPasswordChangedEmail = function sendPasswordChangedEmail(user) {
  var message, html;
  return regeneratorRuntime.async(function sendPasswordChangedEmail$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          message = "\nHi ".concat(user.name, ",\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nConnecting Constructions Team\n  ");
          html = "\n<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      line-height: 1.6;\n      color: #333;\n      max-width: 600px;\n      margin: 0 auto;\n      padding: 20px;\n    }\n    .container {\n      background-color: #f9f9f9;\n      border-radius: 10px;\n      padding: 30px;\n      border: 1px solid #e0e0e0;\n    }\n    .success {\n      background-color: #d1fae5;\n      border-left: 4px solid #10b981;\n      padding: 12px;\n      margin: 20px 0;\n      border-radius: 4px;\n    }\n    .warning {\n      background-color: #fee2e2;\n      border-left: 4px solid #ef4444;\n      padding: 12px;\n      margin: 20px 0;\n      border-radius: 4px;\n    }\n    .footer {\n      margin-top: 30px;\n      padding-top: 20px;\n      border-top: 1px solid #e0e0e0;\n      font-size: 12px;\n      color: #666;\n      text-align: center;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <h2 style=\"color: #10b981;\">\u2705 Password Changed Successfully</h2>\n    \n    <p>Hi <strong>".concat(user.name, "</strong>,</p>\n    \n    <div class=\"success\">\n      Your password has been successfully changed.\n    </div>\n    \n    <p>You can now log in to your account using your new password.</p>\n    \n    <div class=\"warning\">\n      <strong>\u26A0\uFE0F Didn't make this change?</strong><br>\n      If you did not change your password, please contact our support team immediately.\n    </div>\n    \n    <div class=\"footer\">\n      <p>Best regards,<br><strong>Connecting Constructions Team</strong></p>\n      <p style=\"margin-top: 10px;\">\n        This is an automated email. Please do not reply to this message.\n      </p>\n    </div>\n  </div>\n</body>\n</html>\n  ");
          _context3.next = 4;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Password Changed Successfully",
            message: message,
            html: html
          }));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  sendEmail: sendEmail,
  sendPasswordResetEmail: sendPasswordResetEmail,
  sendPasswordChangedEmail: sendPasswordChangedEmail
};