const express = require("express");
const productRouter = express.Router();
const { validateAuth } = require("../midlewares/auth");
const ProductControllers = require("../controllers/products.controllers");

productRouter.post("/add", ProductControllers.newOrUpdatedProduct);
productRouter.post(
  "/add-list-of-products",
  ProductControllers.addListOfProducts
);
productRouter.get("/get-list-of-products", ProductControllers.getProducts);
productRouter.post("/has-stock", ProductControllers.productInStock);

module.exports = productRouter;
