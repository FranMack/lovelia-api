const cron = require("node-cron");
const moment = require("moment-timezone");
const { sendPushNotification } = require("../helpers/sendPushNotification");
const { Alarm } = require("../models/index.models");

const getAlarmAndSendPushNotifications = async () => {
  try {
    const alarms = await Alarm.find().populate("user_id");

    console.log("alarms ==========> ", alarms);

    if (alarms && alarms.length > 0) {
      // Convert current UTC time to Argentina's local time
      const argentinaTime = moment().tz("America/Argentina/Buenos_Aires");

      console.log("argentinaTime: ", argentinaTime);

      alarms.forEach((alarm) => {
        // Assuming alarm.alarm1 is only a time string (e.g., "11:03")
        const timeString = alarm.alarm1;

        // Combine with current date to make a complete datetime in Argentina time zone
        const alarmTime = moment.tz(
          `${argentinaTime.format("YYYY-MM-DD")} ${timeString}`,
          "YYYY-MM-DD HH:mm",
          "America/Argentina/Buenos_Aires"
        );

        console.log("alarmTime: ", alarmTime);

        const timeDifference = alarmTime.diff(argentinaTime);

        console.log("timeDifference: ", timeDifference);

        if (timeDifference > 0 && timeDifference <= 5 * 60 * 1000) {
          // Less than or equal to 5 minutes
          console.log(
            `Scheduling notification for user: ${alarm.user_id.fcmToken} - ${
              alarm.user_id.name
            }, email: ${alarm.user_id.email} in ${
              timeDifference / 1000
            } seconds`
          );

          // Schedule push notification
          setTimeout(async () => {
            try {
              await sendPushNotification(alarm.user_id.fcmToken, {
                title: "Hora de meditar",
                body: `Este es tu momento de paz interior. Tómate un tiempo para relajarte y conectar contigo mismo.`,
              });
              console.log(`Notification sent to ${alarm.user_id.email}`);
            } catch (error) {
              console.error(
                `Failed to send notification to ${alarm.user_id.email}:`,
                error
              );
            }
          }, timeDifference);
        }
      });
    } else {
      console.log("No alarms found");
    }
  } catch (error) {
    console.error("Error fetching alarms:", error);
  }
};

// For testing
cron.schedule("* * * * *", getAlarmAndSendPushNotifications); // Runs every 5 minutes

// For production
// Later, change the schedule to run every 12 hours
// cron.schedule("0 */12 * * *", getAlarmAndSendPushNotifications); // Runs every 12 hours

module.exports = {
  getAlarmAndSendPushNotifications,
};
