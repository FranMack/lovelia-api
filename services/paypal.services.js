const { envs } = require("../config/env.config");
const { TemporaryTransaction, Billing } = require("../models/index.models");
const axios = require("axios");
const ProductServices = require("../services/product.services");
const { getDate, timeConverter } = require("../helpers/getDate");
const { shopingDetailsEmail } = require("../helpers/mailer");

class PaypalServices {
  static async createOrder(data) {
    const { email, items, productDetails, billingDetails, deliveryDetails } =
      data;
    try {
      const temporaryInfo = await TemporaryTransaction.create({
        billingInfo: billingDetails,
        deliveryInfo: deliveryDetails,
        itemsInfo: productDetails,
      });
      const temporaryInfoId = temporaryInfo.id;

      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: items
                .reduce((a, b) => {
                  return a + b.unit_amount.value;
                }, 0)
                .toFixed(2),
            },
          },
        ],
        items: items,

        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "Talisman App",
              locale: "en-US",
              landing_page: "NO_PREFERENCE",
              user_action: "PAY_NOW",
              return_url: `${envs.DOMAIN_URL}/api/v1/payment-paypal/capture-order?email=${email}&temporary_info_id=${temporaryInfoId}`,
              cancel_url: `${envs.DOMAIN_URL}/api/v1/payment-paypal/cancel-order`,
            },
          },
        },
      };

      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");

      const authenticate = await axios.post(
        `${envs.PAYPAL_API_URL}/v1/oauth2/token`,
        params,
        {
          auth: {
            username: envs.PAYPAL_CLIENT_ID,
            password: envs.PAYPAL_SECRET_KEY,
          },
        }
      );
      const access_token = authenticate.data.access_token;

      const generateOrder = await axios.post(
        `${envs.PAYPAL_API_URL}/v2/checkout/orders`,
        order,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return generateOrder;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async captureOrder(email, token, temporary_info_id) {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      const authenticate = await axios.post(
        `${envs.PAYPAL_API_URL}/v1/oauth2/token`,
        params,
        {
          auth: {
            username: envs.PAYPAL_CLIENT_ID,
            password: envs.PAYPAL_SECRET_KEY,
          },
        }
      );
      const access_token = authenticate.data.access_token;
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

      const paymentData = response.data;
      const payment_id = paymentData.purchase_units[0].payments.captures[0].id;
      const status = paymentData.purchase_units[0].payments.captures[0].status;

      const existingTransaction = await Billing.findOne({
        payment_id,
      });

      if (existingTransaction) {
        console.log("Payment already processed. Skipping duplicate handling.");
        return; // Evita procesar el pago y enviar el correo de nuevo.
      }

      if (status === "COMPLETED") {
        const date = getDate();

        //VER COMO GENERAR NUMERO DE ORDEN
        const order_id = Math.round(Math.random() * 100000);

        const temporaryInfo = await TemporaryTransaction.findById(
          temporary_info_id
        );
        const { billingInfo, deliveryInfo, itemsInfo } = temporaryInfo;

        const productDetails = itemsInfo;
        const deliveryDetails = deliveryInfo;
        const billingDetails = {
          ...billingInfo,
          email,
          date,
          order_id,
          payment_id,
          payment_method: "Paypal",
        };

        const productListDB = productDetails
          ? await ProductServices.addProduct(
              productDetails,
              deliveryDetails,
              billingDetails
            )
          : null;

        shopingDetailsEmail(email, productDetails, deliveryDetails, order_id);

        return;
      } else {
        throw new Error(`Payment went wrong: payment status: ${status}`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = PaypalServices;
