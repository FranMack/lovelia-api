const cron = require("node-cron");
const moment = require("moment-timezone");
const { sendPushNotification } = require("../helpers/sendPushNotification");
const { Alarm } = require("../models/index.models");

const getAlarmAndSendPushNotifications = async () => {
  try {
    const alarms = await Alarm.find().populate("user_id");

    if (alarms && alarms.length > 0) {
      alarms.forEach((alarm) => {
        // Fallback to a default time zone
        const userTimeZone = alarm.timezone || "America/Cordoba";

        // Convert current UTC time to user's local time
        const currentTime = moment().tz(userTimeZone);

        // Array of all possible alarm times
        const alarmTimes = [
          alarm.alarm1,
          alarm.alarm2,
          alarm.alarm3,
          alarm.alarm4,
        ];

        // Iterate over each alarm time
        alarmTimes.forEach((timeString, index) => {
          if (timeString) {
            // Combine with current date to make a complete datetime in user's time zone
            const alarmTime = moment.tz(
              `${currentTime.format("YYYY-MM-DD")} ${timeString}`,
              "YYYY-MM-DD HH:mm",
              userTimeZone
            );

            const timeDifference = alarmTime.diff(currentTime);

            if (timeDifference > 0 && timeDifference <= 5 * 60 * 1000) {
              // Less than or equal to 5 minutes
              console.log(
                `Scheduling notification for user: ${
                  alarm.user_id.fcmToken
                } - ${alarm.user_id.name}, email: ${
                  alarm.user_id.email
                } for alarm${index + 1} in ${timeDifference / 1000} seconds`
              );

              // Schedule push notification
              setTimeout(async () => {
                try {
                  await sendPushNotification(
                    alarm.user_id.fcmToken,
                    {
                      title: "Hora de meditar",
                      body: `Este es tu momento de paz interior. Tómate un tiempo para relajarte y conectar contigo mismo.`,
                    },
                    {
                      soundUrl: alarm.sound,
                    }
                  );
                  console.log(
                    `Notification sent to ${alarm.user_id.email} for alarm${
                      index + 1
                    }`
                  );
                } catch (error) {
                  console.error(
                    `Failed to send notification to ${
                      alarm.user_id.email
                    } for alarm${index + 1}:`,
                    error
                  );
                }
              }, timeDifference);
            }
          }
        });
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
