const { admin } = require("../config/firebase");

// Sent push notificaction
const sendPushNotification = async (fcmToken, notification, data) => {
  // Use Firebase messaging API here to send the notification
  await admin
    .messaging()
    .send({
      notification,
      token: fcmToken,
      data,
    })
    .then(async (response) => {
      console.log("Successfully sent (alarm) message:", response);
    })
    .catch((error) => {
      console.error("Error sending (alarm) message:", error);
    });
};

module.exports = { sendPushNotification };
