const mongoose = require("mongoose");

const temporaryTransactionSchema = new mongoose.Schema({
 
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Documento será eliminado después de 1 hora (3600 segundos)
  },
  billingInfo: {
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
  },

  deliveryInfo: {
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
  },
  itemsInfo: [
    {
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
    },
  ],
});

temporaryTransactionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

 const TemporaryTransaction = mongoose.model(
  "TemporaryTransaction",
  temporaryTransactionSchema
);


module.exports = TemporaryTransaction;
