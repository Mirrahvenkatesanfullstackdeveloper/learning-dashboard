// Minimal email utility to prevent errors
const sendEmail = async (options) => {
  console.log('Email would be sent:', options);
  // In development, just log instead of actually sending
  return true;
};

module.exports = { sendEmail };