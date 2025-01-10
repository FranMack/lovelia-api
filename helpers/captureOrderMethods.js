const axios = require("axios");
const { envs } = require("../config/env.config");
const SoldProductServices = require("../services/soldProduct.services");

const { sendTalismanDigitalActivation } = require("./mailer");

const { User, TalismanDigital, Product } = require("../models/index.models");

class CaptureOrderMethods {
  static async authenticatePayPal() {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${envs.PAYPAL_API_URL}/v1/oauth2/token`,
      params,
      {
        auth: {
          username: envs.PAYPAL_CLIENT_ID,
          password: envs.PAYPAL_SECRET_KEY,
        },
      }
    );

    return response.data.access_token;
  }

  // Captura de la orden
  static async capturePayPalOrder(token, access_token) {
    const response = await axios.post(
      `${envs.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.data;
  }

  // Procesar productos vendidos
  static async processSoldProducts(productDetails, deliveryId, billingId) {
    return await SoldProductServices.addProduct(
      productDetails,
      deliveryId,
      billingId
    );
  }

  // Procesar talismanes digitales
  static async processTalismanDigital(talismanDigitalInfo, billingId) {
    return Promise.all(
      talismanDigitalInfo.map(async (item) => {
        await TalismanDigital.create({
          email: item.email,
          billing_id: billingId,
        });

        await sendTalismanDigitalActivation(item.email);

        await User.findOneAndUpdate(
          { email: item.email },
          { payment: true },
          { new: true }
        );
      })
    );
  }

  // Actualizar el stock de productos
  static async updateProductStock(productDetails) {
    return Promise.all(
      productDetails.map((item) =>
        Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: -item.quantity } },
          { new: true }
        )
      )
    );
  }
}

module.exports = { CaptureOrderMethods };
