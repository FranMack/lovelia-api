const express = require("express");
const shoppingCartRouter = express.Router();
const {
  ShoppingCartControllers,
} = require("../controllers/shoppingCart.controllers");

const {validateAuth}=require("../midlewares/auth")
//logged user
shoppingCartRouter.post("/add",validateAuth, ShoppingCartControllers.addProductToCart);
shoppingCartRouter.get("/list",validateAuth, ShoppingCartControllers.getShoppingCart);
shoppingCartRouter.delete("/delete/:productId",validateAuth, ShoppingCartControllers.deleteProduct);
shoppingCartRouter.delete("/clean",validateAuth, ShoppingCartControllers.cleanShopingCart);
//not logged
shoppingCartRouter.post("/userNotLogged/add", ShoppingCartControllers.addProductToCartUserNotLogged);
module.exports = shoppingCartRouter ;
