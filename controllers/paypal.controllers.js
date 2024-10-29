const PaypalServices = require("../services/paypal.services");
const {envs}=require("../config/env.config")
class PaypalControllers {
  static async createOrder(req, res) {
  

    try {
      const generateOrder = await PaypalServices.createOrder(req.body);

     
      res.send({ link_de_pago: generateOrder.data.links[1].href });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });f
      }
    }
  }

  static async captureOrder(req, res) {
    const { token, email,temporary_info_id } = req.query;
    try {
     
        const payment_id = await PaypalServices.captureOrder(email,token,temporary_info_id);

    
          res.redirect( `${envs.FRONT_URL}`);
      
       

      
      
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static  cancelOrder= async(req,res)=>{
    res.redirect(`${envs.FRONT_URL}`);
  }

 
}

module.exports = PaypalControllers;
