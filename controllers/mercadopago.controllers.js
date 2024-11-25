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





}

module.exports = MercadopagoControllers;
