const express =require("express");
const productRouter= express.Router();
const { validateAuth } = require("../midlewares/auth");
const ProductControllers=require("../controllers/product.controllers")



productRouter.post("/add",ProductControllers.addProduct)
productRouter.get("/list/:email",ProductControllers.productList)


module.exports=productRouter