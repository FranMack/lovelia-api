const mongoose = require("mongoose");


const soldProductSchema = new mongoose.Schema({
 
  model: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  rock: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },
  intention: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
 
  delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
  },
 
  billing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Billing",
  },


});

soldProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Sold_Product = mongoose.model("Sold_Product", soldProductSchema);

module.exports = Sold_Product;
