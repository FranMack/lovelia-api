const mongoose = require("mongoose");

const temporaryTransactionSchema = new mongoose.Schema({
 
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // Documento será eliminado después de 1 semana
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
  },
  itemsInfo: [
    {
        model: {
            type: String,
  
          },
          metal: {
            type: String,
   
          },
          rock: {
            type: String,

          },
          chain: {
            type: String,
  
          },
          intention: {
            type: String,
     
          },
        
          price: {
            type: Number,
         
          },
          quantity: {
            type: Number,
    
          },
    },
  ],

  talismanDigitalInfo:[
    {
      email:{type:String}
    }
  ]

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
