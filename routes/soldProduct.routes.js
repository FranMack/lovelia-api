const express =require("express");
const soldProductRouter= express.Router();
const { validateAuth } = require("../midlewares/auth");
const { validateAdminAuth } = require("../midlewares/adminAuth");
const SoldProductControllers=require("../controllers/soldProduct.controllers")



soldProductRouter.post("/add",SoldProductControllers.addProduct)
soldProductRouter.get("/list/:email",validateAuth,SoldProductControllers.productList)
soldProductRouter.get("/history",validateAdminAuth,SoldProductControllers.getListOfOrders)



module.exports=soldProductRouter