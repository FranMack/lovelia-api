const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

deliverySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
