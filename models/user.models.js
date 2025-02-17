const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], 
    default: "user",       
    required: true,
  },
  provider: {
    type: String,
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
    required: false,
  },
  confirm: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  payment_platform: {
    type: String,
  },
  payer_id: {
    type: String,
  },
  subscription_id: {
    type: String,
  },
  fcmToken : {
    type: String,
  },
  
});



userSchema.set("toJSON", {
  virtuals: true, // 🔹 Activa los virtuals
  versionKey: false, // 🔹 Elimina __v
  transform: function (doc, ret) {
    ret.id = ret._id; // 🔹 Copia `_id` en `id`
    delete ret._id; // 🔹 Elimina `_id`
    return ret;
  },
});

//metodo de instancia
userSchema.methods.validPassword = async function (password) {
  return bcrypt
    .hash(password, this.salt)
    .then((hash) => hash === this.password);
};

// Middleware de Mongoose para modificar los campos antes de guardarlos
userSchema.pre("save", async function (next) {
  // Convertir el email a minúsculas si es necesario
  if (this.isModified("email") || this.isNew) {
    this.email = this.email.toLowerCase();
  }

  // Solo hasheamos la contraseña si es nueva o ha sido modificada
  if (this.isModified("password") || this.isNew) {
    try {
      // Generamos una nueva sal
      const salt = await bcrypt.genSalt(8);
      this.salt = salt;
      // Hasheamos la contraseña con la sal generada
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      return next();
    } catch (error) {
      return next(error);
    }
  }

  // Si no se modifica la contraseña, simplemente pasamos al siguiente middleware
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
