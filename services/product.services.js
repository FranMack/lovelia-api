const { Product } = require("../models/index.models");
const { productList } = require("../utils/productsInfo");

class ProductServices {
  static async addProduct(data) {
    try {
      const newProduct = await Product.create(data);
      if (!newProduct) {
        throw new Error("Something was wrong, try again");
      }

      return newProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async addListOfProducts() {
    try {
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
