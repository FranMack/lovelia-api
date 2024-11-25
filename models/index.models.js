const User = require("./user.models");
const UserAstroData = require("./userAstroData.models");
const Product = require("./product.model");
const Billing = require("./billing.model");
const Delivery = require("./delivery.model");
const TemporaryTransaction = require("./transactionAuxiliar.model");
const Alarm = require("./alarm.model");
const TalismanDigital=require("./talismanDigital.model")

module.exports = {
  User,
  UserAstroData,
  Product,
  Billing,
  Delivery,
  TalismanDigital,
  TemporaryTransaction,
  Alarm,
};
