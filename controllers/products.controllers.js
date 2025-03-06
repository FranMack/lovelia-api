const ProductServices = require("../services/product.services");
class ProductControllers {


  static async newOrUpdatedProduct(req, res) {
    try {
      const newProduct = await ProductServices.newOrUpdatedProduct(req.body);

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

  static async addListOfProducts(req, res) {
    try {
      const newListOfProducts = await ProductServices.addListOfProducts();

      res.status(200).json("Producs added");
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getProducts(req, res) {
    try {
      const products = await ProductServices.getProducts();

      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async productInStock (req,res){

    try{

      const productHasStock= await ProductServices.productInStock(req.body);
      res.status(200).json(productHasStock)

    }


  catch (error) {
    console.log(error);
    if (error.response) {
      res.status(error.response.status).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }

}
}

module.exports = ProductControllers;
