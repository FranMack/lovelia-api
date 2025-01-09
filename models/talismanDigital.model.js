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



// Middleware de Mongoose para modificar los campos antes de guardarlos
talismanDigitalSchema.pre("save", async function (next) {
  // Convertir el email a minúsculas si es necesario
  if (this.isModified("email") || this.isNew) {
    this.email = this.email.toLowerCase();
  }

  // Si no se modifica la contraseña, simplemente pasamos al siguiente middleware
  next();
});







const TalismanDigital = mongoose.model("TalismanDigital", talismanDigitalSchema);

module.exports = TalismanDigital;
