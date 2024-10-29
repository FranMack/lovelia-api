const { admin } = require("../config/firebase");

// Sent push notificaction
const sendPushNotification = async (fcmToken, notification) => {
  console.log("Sending push notification");

  /* const message = {
    notification: {
      title: notificationTitle,
      body: notificationBody,
    },    
    token: recipientFcmToken, 
    // optional
    data: {
      soundUrl: string
    },
  }; */

  // Use Firebase messaging API here to send the notification
  await admin
    .messaging()
    .send({
      notification,
      token: fcmToken,
    })
    .then(async (response) => {
      console.log("Successfully sent (alarm) message:", response);
    })
    .catch((error) => {
      console.error("Error sending (alarm) message:", error);
    });
};

module.exports = { sendPushNotification };
