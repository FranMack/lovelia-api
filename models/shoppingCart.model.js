const mongoose = require("mongoose");

const ShoppingCartSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  metal: {
    type: String,
    required: true,
  },
  rock: {
    type: String,
  },
  chain: {
    type: String,
  },

  quantity: {
    type: Number,
    required: true,
  },
  intention: {
    type: String,
  },

   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
});

ShoppingCartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);

module.exports = ShoppingCart;
