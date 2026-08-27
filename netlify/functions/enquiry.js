// This Netlify Function has been intentionally removed/disabled.
// The site now uses WhatsApp/phone/email for enquiries and bookings.
// Keeping this file as a stub to avoid accidental invocation. Remove permanently if desired.

exports.handler = async function(event) {
  return {
    statusCode: 410,
    body: JSON.stringify({ error: 'This function has been removed. Please contact the agent via WhatsApp/phone/email.' })
  };
};
