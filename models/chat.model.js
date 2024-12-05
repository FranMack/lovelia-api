const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  sender: {
    type: String,
    enum: ["user", "assistant"], // Ensure only "user" or "chatGpt" is allowed
    required: true,
  },
});

chatSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
