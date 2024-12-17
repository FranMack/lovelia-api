const { envs } = require("../config/env.config");
const {
  User,
  TalismanDigital,
  TemporaryTransaction,
  Delivery,
  Billing,
} = require("../models/index.models");
const axios = require("axios");
const SoldProductServices = require("../services/soldProduct.services");
const { getDate } = require("../helpers/getDate");
const {
  sendTalismanDigitalActivation,
  shopingDetailsEmail2,
} = require("../helpers/mailer");

class PaypalServices {
  static async createOrder(data) {
    const {
      buyerInfo,
      items,
      productDetails,
      deliveryDetails,
      billingDetails,
      talismanDigitalOwners,
    } = data;
    try {
      const { email, name, lastname } = buyerInfo;

      const temporaryInfoObject = {
        billingInfo: billingDetails,
      };

      if (productDetails.length > 0) {
        if (deliveryDetails) {
          temporaryInfoObject.deliveryInfo = deliveryDetails;
        }
        temporaryInfoObject.itemsInfo = productDetails;
      }

      if (talismanDigitalOwners) {
        temporaryInfoObject.talismanDigitalInfo = talismanDigitalOwners;
      }

      const temporaryInfo = await TemporaryTransaction.create(
        temporaryInfoObject
      );
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
              return_url: `${envs.DOMAIN_URL}/api/v1/payment-paypal/capture-order?email=${email}&name=${name}&lastname=${lastname}&temporary_info_id=${temporaryInfoId}`,
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

  static async captureOrder({
    token,
    email,
    name,
    lastname,
    temporary_info_id,
  }) {
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
      const date = getDate();

      //VER COMO GENERAR NUMERO DE ORDEN
      const order_id = Math.round(Math.random() * 100000);

      const existingTransaction = await Billing.findOne({
        payment_id,
      });

      if (existingTransaction) {
        console.log("Payment already processed. Skipping duplicate handling.");
        return; // Evita procesar el pago y enviar el correo de nuevo.
      }

      if (status === "COMPLETED") {
        const temporaryInfo = await TemporaryTransaction.findById(
          temporary_info_id
        );
        const { billingInfo } = temporaryInfo;

        const productDetails = temporaryInfo?.itemsInfo;
        const deliveryDetails = temporaryInfo?.deliveryInfo;
        const billingDetails = {
          ...billingInfo,
          email,
          date,
          order_id,
          payment_id,
          payment_method: "PayPal",
        };

        const billingInfoDB = await Billing.create(billingDetails);

        if (temporaryInfo.itemsInfo.length > 0) {
          const deliveryInfo = deliveryDetails.address
            ? await Delivery.create(deliveryDetails)
            : undefined;

          const productListDB = productDetails
            ? await SoldProductServices.addProduct(
                productDetails,
                deliveryInfo ? deliveryInfo._id : undefined,
                billingInfoDB._id
              )
            : null;
        }

        if (temporaryInfo.talismanDigitalInfo.length > 0) {
          const promises = temporaryInfo.talismanDigitalInfo.map(
            async (item) => {
              // Crear un registro en TalismanDigital
              await TalismanDigital.create({
                email: item.email,
                billing_id: billingInfoDB._id,
              });

              await sendTalismanDigitalActivation(item.email);

              // Buscar el usuario y actualizar su estado de pago si existe
              const user = await User.findOneAndUpdate(
                { email: item.email },
                { payment: true },
                { new: true } // Devuelve el usuario actualizado
              );
            }
          );

          // Ejecutar todas las promesas al mismo tiempo
          const result = await Promise.all(promises);
        }
        //enviar mail con detalle de compra

        shopingDetailsEmail2(
          email,
          productDetails,
          deliveryDetails,
          order_id,
          name,
          lastname
        );

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
