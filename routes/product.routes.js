const express =require("express");
const productRouter= express.Router();
const { validateAuth } = require("../midlewares/auth");
const ProductControllers=require("../controllers/products.controllers")



productRouter.post("/add",ProductControllers.addProduct)
productRouter.post("/add-list-of-products",ProductControllers.addListOfProducts)
productRouter.get("/get-list-of-products",ProductControllers.getProducts)
//productRouter.get("/list/:email",SoldProductControllers.productList)
productRouter.post("/has-stock",ProductControllers.productInStock)


module.exports=productRouter