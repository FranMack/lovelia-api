const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
