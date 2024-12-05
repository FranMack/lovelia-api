const User = require("./user.models");
const UserAstroData = require("./userAstroData.models");
const Sold_Product = require("./soldProduct.model");
const Billing = require("./billing.model");
const Delivery = require("./delivery.model");
const TemporaryTransaction = require("./transactionAuxiliar.model");
const Alarm = require("./alarm.model");
const TalismanDigital=require("./talismanDigital.model")
const Product =require("./product.model")
const Chat=require("./chat.model")

module.exports = {
  User,
  UserAstroData,
  Sold_Product,
  Billing,
  Delivery,
  TalismanDigital,
  TemporaryTransaction,
  Alarm,
  Product,
  Chat
};
