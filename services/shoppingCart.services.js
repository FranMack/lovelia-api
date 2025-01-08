const { ShoppingCart, Product } = require("../models/index.models");
const mongoose = require("mongoose");

class ShoppingCartServices {
  static async addProduct(product) {
    try {
      const productInfo = await Product.findOne({
        model: product.model,
        metal: product.metal,
        rock: product.rock,
        chain: product.chain,
      });
      if (!productInfo) {
        throw new Error("Product not found");
      }
      const { model, metal, rock, chain, intention, user_id, id,quantity } =
        await ShoppingCart.create(product);

      const newProduct = {
        model,
        metal,
        rock,
        chain,
        intention,
        user_id,
        quantity,
        shoppingCartItem_id: id,
        price: productInfo.price,
       
      };
      return newProduct;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async addProductToCartUserNotLogged(product) {
    try {
      const { model, metal, rock, chain, intention } = product;
      const productInfo = await Product.findOne({
        model: product.model,
        metal: product.metal,
        rock: product.rock,
        chain: product.chain,
      });

      if (!productInfo) {
        throw new Error("Product not found");
      }

      const newProduct = {
        model,
        metal,
        rock,
        chain,
        intention,
        price: productInfo.price,
      };
      return newProduct;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async getShoppingCart(userId) {
    try {
      const shoppingCart = await ShoppingCart.find({ user_id: userId });

      if (!shoppingCart.length) {
        throw new Error("Shopping cart is empty");
      }

      const promises = shoppingCart.map((item) => {
        return Product.find({
          model: item.model,
          metal: item.metal,
          rock: item.rock,
          chain: item.chain,
        });
      });

      const productsFullInfo = (await Promise.all(promises)).flat();

      const shoppingCartRelevantInfo = shoppingCart.map((obj1, index) => {
        const obj2 = productsFullInfo[index];
        return {
          quantity: obj1.quantity,
          intention: obj1.intention,
          shoppingCartItem_id: obj1.id,
          model: obj2.model,
          metal: obj2.metal,
          rock: obj2.rock,
          chain: obj2.chain,
          image: obj2.images[0],
          price: obj2.price,
          product_id: obj2.id,
        };
      });

      return shoppingCartRelevantInfo;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async deleteProduct(shoppingCartProductId) {
    try {
      const product = await ShoppingCart.findById(shoppingCartProductId);

      const newProduct = await ShoppingCart.deleteOne({
        _id: shoppingCartProductId,
      });
      return newProduct;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async cleanShopingCart(user_id) {
    try {
      await ShoppingCart.deleteMany({ user_id });

      return;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }
}

module.exports = ShoppingCartServices;
