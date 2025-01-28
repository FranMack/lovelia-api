const express =require("express");
const soldProductRouter= express.Router();
const { validateAuth } = require("../midlewares/auth");
const SoldProductControllers=require("../controllers/soldProduct.controllers")



soldProductRouter.post("/add",SoldProductControllers.addProduct)
soldProductRouter.get("/list/:email",validateAuth,SoldProductControllers.productList)


module.exports=soldProductRouter