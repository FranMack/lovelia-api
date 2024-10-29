const mongoose = require("mongoose");

const alarmSchema = new mongoose.Schema({
  alarm1: {
    type: String,
  },
  alarm2: {
    type: String,
  },
  alarm3: {
    type: String,
  },
  alarm4: {
    type: String,
  },
  alarm_active: {
    type: Boolean,
  },
  sound: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

alarmSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Alarm = mongoose.model("Alarm", alarmSchema);

module.exports = Alarm;
