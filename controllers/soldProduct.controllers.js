const SoldProductServices = require("../services/soldProduct.services");


class SoldProductControllers {
  static addProduct = async (req, res) => {
    try {
      const products = await SoldProductServices.addProduct(req.body);

      res.status(200).json("Products added");
    } catch (error) {
      console.log(error);
    }
  };

  static productList = async (req, res) => {
    try {
      const { email } = req.params;
      const user=req.user;

      if(email !==req.user.email && user.role!=="admin"){
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const products = await SoldProductServices.productList(email);

      res.status(200).json(products);
    } catch (error) {
      console.log(error);
    }
  };

  //admin controllers

  static async getListOfOrders(req,res){
    try{
      const listOfOrders=await SoldProductServices.getListOfOrders()
      res.status(200).json(listOfOrders);
    }
    catch (error) {
      console.log(error);
    }
  }
}

module.exports = SoldProductControllers;
