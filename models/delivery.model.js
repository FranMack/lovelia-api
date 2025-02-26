const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  phone: {
    type: String,
   
  },
  address: {
    type: String,
  
  },
  postal_code: {
    type: String,
   
  },
  receiver: {
    type: String,

  },
  price: {
    type: Number,
  
  },
  currency: {
    type: String,
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
