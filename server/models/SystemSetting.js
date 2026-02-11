const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    general: {
      siteName: { type: String, default: "Connect Constructions" },
      supportEmail: { type: String, default: "support@connectconstructions.com" },
      contactPhone: { type: String, default: "+91 0000000000" },
      address: { type: String, default: "Hyderabad, India" },
    },
    features: {
      maintenanceMode: { type: Boolean, default: false },
      allowRegistration: { type: Boolean, default: true },
      enableReviews: { type: Boolean, default: true },
    },
    security: {
      maxLoginAttempts: { type: Number, default: 5 },
      passwordMinLength: { type: Number, default: 6 },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
