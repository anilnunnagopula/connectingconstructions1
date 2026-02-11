const SystemSetting = require("../models/SystemSetting");

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = await SystemSetting.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { general, features, security } = req.body;

    let settings = await SystemSetting.findOne();

    if (!settings) {
      settings = new SystemSetting();
    }

    if (general) settings.general = { ...settings.general, ...general };
    if (features) settings.features = { ...settings.features, ...features };
    if (security) settings.security = { ...settings.security, ...security };
    
    settings.updatedBy = req.user._id;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
