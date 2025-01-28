const { envs } = require("../config/env.config");
const {
  User,
  TalismanDigital,
  TemporaryTransaction,
  Delivery,
  Billing,
  Product,
} = require("../models/index.models");
const axios = require("axios");

const { getDate } = require("../helpers/getDate");
const { shopingDetailsEmail2 } = require("../helpers/mailer");
const ShoppingCartServices = require("./shoppingCart.services");

const { CaptureOrderMethods } = require("../helpers/captureOrderMethods");

class PaypalServices {
  static async createOrder(data) {
    const {
      buyerInfo,
      productDetails,
      deliveryDetails,
      billingDetails,
      talismanDigitalOwners,
      user_id,
      deliveryPrice,
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

        const productPromises = productDetails.map((item) => {
          return Product.findById(item.product_id);
        });

        const productsListInfo = await Promise.all(productPromises);

        const productsFinalInfo = productsListInfo.map((item, index) => ({
          product_id: item.id,
          model: item.model,
          metal: item.metal,
          rock: item.rock,
          chain: item.chain,
          price: item.price,
          intention: productDetails[index].intention,
          quantity: productDetails[index].quantity, // Propiedades del objeto en array1
        }));

        temporaryInfoObject.itemsInfo = productsFinalInfo;
      }

      if (talismanDigitalOwners) {
        temporaryInfoObject.talismanDigitalInfo = talismanDigitalOwners;
      }

      const temporaryInfo = await TemporaryTransaction.create(
        temporaryInfoObject
      );
      const temporaryInfoId = temporaryInfo.id;

      //calculo el precio total desde la api
      const items = temporaryInfo.itemsInfo.map((item) => {
        return {
          title: item.model,
          quantity: item.quantity,
          unit_amount: {
            currency_code: "USD",
            value: item.price,
          },
        };
      });

      if (deliveryDetails) {
        items.push({
          title: "Envío",
          quantity: 1,
          unit_amount: {
            currency_code: "USD",
            value: deliveryPrice,
          },
        });
      }

      const totalPrice = items
        .reduce((total, item) => {
          return total + item.unit_amount.value * item.quantity;
        }, 0)
        .toFixed(2);

      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalPrice,
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
              return_url: `${envs.DOMAIN_URL}/api/v1/payment-paypal/capture-order?email=${email}&name=${name}&lastname=${lastname}&temporary_info_id=${temporaryInfoId}&user_id=${user_id}`,
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
    user_id,
  }) {
    try {
      // Autenticación de PayPal
      const access_token = await CaptureOrderMethods.authenticatePayPal();
      // Captura de la orden
      const paymentData = await CaptureOrderMethods.capturePayPalOrder(
        token,
        access_token
      );

      const payment_id = paymentData.purchase_units[0].payments.captures[0].id;
      const status = paymentData.purchase_units[0].payments.captures[0].status;

      if (status !== "COMPLETED") {
        throw new Error(`Payment went wrong: payment status: ${status}`);
      }

      //VER COMO GENERAR NUMERO DE ORDEN
      const date = getDate();
      const order_id = Math.round(Math.random() * 100000);

      // Verificar si la transacción ya existe

      const existingTransaction = await Billing.findOne({
        payment_id,
      });

      if (existingTransaction) {
        console.log("Payment already processed. Skipping duplicate handling.");
        return; // Evita procesar el pago y enviar el correo de nuevo.
      }

      // Procesar información temporal
      const temporaryInfo = await TemporaryTransaction.findById(
        temporary_info_id
      );
      const {
        billingInfo = {},
        itemsInfo = [],
        deliveryInfo = {},
        talismanDigitalInfo = [],
      } = temporaryInfo;

      const billingDetails = {
        ...billingInfo,
        name,
        lastname,
        email,
        date,
        order_id,
        payment_id,
        payment_method: "PayPal",
      };

      const billingInfoDB = await Billing.create(billingDetails);

      const deliveryId = deliveryInfo?.address
        ? (await Delivery.create(deliveryInfo))._id
        : undefined;

      // Procesar productos vendidos
      if (itemsInfo.length > 0) {
        await CaptureOrderMethods.processSoldProducts(
          itemsInfo,
          deliveryId,
          billingInfoDB._id
        );
      }

      // Procesar talismanes digitales
      if (talismanDigitalInfo.length > 0) {
        await CaptureOrderMethods.processTalismanDigital(
          talismanDigitalInfo,
          billingInfoDB._id
        );
      }

      //enviar mail con detalle de compra

      shopingDetailsEmail2(
        email,
        itemsInfo,
        deliveryInfo,
        order_id,
        name,
        lastname
      );

      //usuario logueado ===> borrar su carrito de la db luego de la compra
      if (user_id) {
        await ShoppingCartServices.cleanShopingCart(user_id);
      }

      //descontar stock de productos vendidos

      await CaptureOrderMethods.updateProductStock(itemsInfo);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = PaypalServices;
