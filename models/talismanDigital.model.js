const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const talismanDigitalSchema = new mongoose.Schema({
 
  email: {
    type: String,
    unique:true,
    required: true,
  },
  activated: {
    type: Boolean,
    default:false
  },
  billing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Billing",
  },


});

talismanDigitalSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const TalismanDigital = mongoose.model("TalismanDigital", talismanDigitalSchema);

module.exports = TalismanDigital;
