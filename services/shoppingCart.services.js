const { ShoppingCart, Product } = require("../models/index.models");
const mongoose = require("mongoose");

class ShoppingCartServices {
  static async addProduct(product) {
    try {
      // Buscar la información del producto
      const productInfo = await Product.findOne({
        model: product.model,
        metal: product.metal,
        rock: product.rock,
        chain: product.chain,
      });

      if (!productInfo) {
        throw new Error("Product not found");
      }

      // Buscar si el producto ya está en el carrito
      const productAlreadyInCart = await ShoppingCart.findOne({
        product_id: productInfo.id,
        intention: product.intention,
      });



      if (!productAlreadyInCart) {
        // Crear un nuevo producto en el carrito
        const createdProduct = await ShoppingCart.create({
          ...product,
          product_id: productInfo.id,
        });

        const newProduct = {
          product_id: productInfo.id,
          model: createdProduct.model,
          metal: createdProduct.metal,
          rock: createdProduct.rock,
          chain: createdProduct.chain,
          intention: createdProduct.intention,
          user_id: createdProduct.user_id,
          quantity: createdProduct.quantity,
          shoppingCartItem_id: createdProduct.id,
          price_AR: productInfo.price_AR,
          price_MX: productInfo.price_MX,
          price_RM: productInfo.price_RM,
        };

        return newProduct;
      }

      // Actualizar la cantidad si el producto ya está en el carrito
      const updatedProduct = await ShoppingCart.findOneAndUpdate(
        {
          product_id: productAlreadyInCart.product_id,
          user_id: productAlreadyInCart.user_id,
        },
        { $inc: { quantity: 1 } },
        { new: true } // Retorna el documento actualizado
      );

      const updatedProductInfo = {
        product_id: productInfo.id,
        model: updatedProduct.model,
        metal: updatedProduct.metal,
        rock: updatedProduct.rock,
        chain: updatedProduct.chain,
        intention: updatedProduct.intention,
        user_id: updatedProduct.user_id,
        quantity: updatedProduct.quantity,
        shoppingCartItem_id: updatedProduct.id,
        price: productInfo.price,
      };

      return updatedProductInfo;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async addProductToCartUserNotLogged(product) {
    try {
      const { model, metal, rock, chain, intention, quantity } = product;
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
        product_id: productInfo.id,
        model,
        metal,
        rock,
        chain,
        intention,
        quantity,
        price_AR: productInfo.price_AR,
          price_MX: productInfo.price_MX,
          price_RM: productInfo.price_RM,
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
        return [];
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
          price_AR: obj2.price_AR,
          price_MX: obj2.price_MX,
          price_RM: obj2.price_RM,
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
      if (
        !user_id ||
        user_id === "null" ||
        !mongoose.Types.ObjectId.isValid(user_id)
      ) {
        console.warn("user_id no es válido:", user_id);
        return;
      }
      await ShoppingCart.deleteMany({ user_id });

      return;
    } catch (error) {
      console.error("Error en el shopping cart:", error.message);
      throw error;
    }
  }

  static async updateProductQuantity(shoppingCartItem_id, quantity,product_id) {
    try {
    

      const product = await Product.findById(product_id);

      if (product.stock < quantity) {
        throw new Error("No hay stock disponible");
      }


      if(shoppingCartItem_id){
        const productInCart = await ShoppingCart.findById(shoppingCartItem_id);

        if (!productInCart) {
          throw new Error("Producto no encontrado en el carrito");
        }

        productInCart.quantity = quantity;

        await productInCart.save();
  
        return productInCart;

      }


    
      return "todo"
    





    
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad el producto",
        error.message
      );
      throw error;
    }
  }
}

module.exports = ShoppingCartServices;
