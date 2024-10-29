const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

//metodo de instancia
userSchema.methods.validPassword = async function (password) {
  return bcrypt
    .hash(password, this.salt)
    .then((hash) => hash === this.password);
};

//metodo de clase
userSchema.pre("save", async function (next) {
  // Solo hasheamos la contraseña si es nueva o ha sido modificada
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generamos una nueva sal
    const salt = await bcrypt.genSalt(8);
    this.salt = salt;
    // Hasheamos la contraseña con la sal generada
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
