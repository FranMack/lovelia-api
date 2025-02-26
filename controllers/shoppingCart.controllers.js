const ShoppingCartServices = require("../services/shoppingCart.services");

class ShoppingCartControllers {
  static async addProductToCart(req, res) {
    try {
      const { id } = req.user;

      const product = { user_id: id, ...req.body };

      const newProduct = await ShoppingCartServices.addProduct(product);

      res.status(200).json(newProduct);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async addProductToCartUserNotLogged(req, res) {
    try {
      const product = { ...req.body };

      const newProduct =
        await ShoppingCartServices.addProductToCartUserNotLogged(product);

      res.status(200).json(newProduct);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getShoppingCart(req, res) {
    const { id } = req.user;

    try {
      const shoppingCart = await ShoppingCartServices.getShoppingCart(id);

      res.status(200).json(shoppingCart);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async deleteProduct(req, res) {
    const { productId } = req.params;

    try {
      const productDeleted = await ShoppingCartServices.deleteProduct(
        productId
      );

      res.status(200).json(productDeleted);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async cleanShopingCart(req, res) {
    const { id } = req.user;

    try {
      const shoppingCart = await ShoppingCartServices.cleanShopingCart(id);

      res.status(200).json("Cart empty");
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async updateProductQuantity(req, res) {
    try {
      const { shoppingCartItem_id, quantity, product_id } = req.body;

      const updatedProduct = await ShoppingCartServices.updateProductQuantity(
        shoppingCartItem_id,
        quantity,
        product_id
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

module.exports = { ShoppingCartControllers };
