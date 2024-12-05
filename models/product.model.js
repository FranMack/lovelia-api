const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
 
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
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  images: { type: [String], required: true }, 


});

ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
