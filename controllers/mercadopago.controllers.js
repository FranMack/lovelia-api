const { MercadoPagoConfig, Preference, Payment,CardToken } = require("mercadopago");
const MercadopagoServices = require("../services/mercadopago.services");
class MercadopagoControllers {
  static async createOrder(req, res) {
    try {
     

      const newPreference = await MercadopagoServices.createOrder(req.body);

      res.status(200).json({ link_de_pago: newPreference.init_point });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async reciveWebhook(req, res) {
    const paymentQuery = req.query;

    try {
      const payment_id = await MercadopagoServices.reciveWebhook(paymentQuery);

      res.status(200).json({
        message: `Your payment has been credited correctly your payment id is ${payment_id}`,
        subscription: true,
      });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }


  static async createSubscriptionPlan(req,res){
    try{
      const subscriptionPlan= await MercadopagoServices.createSubscriptionPlan()
      res.status(200).json(subscriptionPlan);
    }
    catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getSubscriptionPlan(req,res){
    const{preApprovalPlanId}=req.params;
    try{
      const subscriptionPlan= await MercadopagoServices.getSubscriptionPlan(preApprovalPlanId)
      res.status(200).json(subscriptionPlan);
    }
    catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async paySubscription(req,res){
    
    try{
      const authToken = req.cookies.token;
      const subscriptionPlan= await MercadopagoServices.paySubscription(req.body,authToken)
      res.status(200).json(subscriptionPlan);
    }
    catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }


  

  static async subscriptorsStatus(req,res){
    try{
      const subscriptors=await MercadopagoServices.subscriptorsStatus()
      res.status(200).json(subscriptors)

    }

    catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }


  static async cancelSubscription(req,res){
    const {email}=req.body
    try{

      const updateSubscription= await MercadopagoServices.cancelSubscription(email)

      res.status(200).json("Subscription inactive")
    }
    catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }



}

module.exports = MercadopagoControllers;
