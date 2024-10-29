const mongoose = require("mongoose");

const billingtSchema = new mongoose.Schema({
    name: {
        type: String,
      },
      lastname: {
        type: String,
      },
      rfc: {
        type: String,
      },
      legalName: {
        type: String,
      },
      taxRegime: {
        type: String,
      },
      order_id: {
        type: String,
        required: true,
      },
      payment_method: {
        type: String,
        required: true,
      },
      payment_id : {
        type: String,
      },
      date: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
 
});

billingtSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

const Billing = mongoose.model("Billing", billingtSchema);

module.exports = Billing;
