const { Product } = require("../models/index.models");
const { productList } = require("../utils/productsInfo");

class ProductServices {
  static async newOrUpdatedProduct(data) {
    try {
      const { productId, ...restData } = data;
  
      if (!productId) {
        const newProduct = await Product.create(restData);
        if (!newProduct) {
          throw new Error("Something went wrong, try again");
        }
        return newProduct;
      }
  
    
  
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: restData },
        { new: true } // Devuelve el producto actualizado
      );

      if (!updatedProduct) {
        throw new Error("Product not found");
      }
  
      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  static async addListOfProducts() {
    try {

      console.log("list",productList)
      const newListOfProducts = await Product.insertMany(productList);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getProducts() {
    try {
      const products = await Product.find();

      if (!products) {
        throw new Error("Something was wrong, try again");
      }
      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async productInStock(data) {
    try {
      const { product_id } = data;

      const product = await Product.findById(product_id);

      if (!product) {
        throw new Error("Product not found");
      }

      const productHasStock = product.stock > 0 ? true : false;

     return productHasStock
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = ProductServices;
