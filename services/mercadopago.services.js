const { envs } = require("../config/env.config");
const {
  TemporaryTransaction,
  Delivery,
  Billing,
  Product,
} = require("../models/index.models");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const { getDate } = require("../helpers/getDate");
const {
  shopingDetailsEmail2,
} = require("../helpers/mailer");

const { CaptureOrderMethods } = require("../helpers/captureOrderMethods");
const ShoppingCartServices = require("./shoppingCart.services");
const client = new MercadoPagoConfig({
  accessToken: envs.MERCADO_PAGO_TOKEN,
});

class MercadopagoServices {
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
          unit_price: item.price,
          currency_id: "USD",
        };
      });
      if (deliveryDetails) {
        items.push({
          title: "Envío",
          quantity: 1,
          unit_price: deliveryPrice,
          currency_id: "USD",
        });
      }

      const successUrl = `${envs.FRONT_URL}/thanks-for-buying`;

      const preference = new Preference(client);

      const newPreference = await preference.create({
        body: {
          items: items,
          payer: {
            email: email,
          },

          back_urls: {
            success: successUrl,
            failure: `${envs.DOMAIN_URL}/api/v1/payment-mercadopago/failure`,
            pending: `${envs.DOMAIN_URL}/api/v1/payment-mercadopago/pending`,
          },
          //se vence al par de dias/ dia, hay que generarlo con ngrok, hasta que tengamos el dominio
          notification_url: `${envs.DOMAIN_URL}/api/v1/payment-mercadopago/webhook/?email_acount=${email}&name=${name}&lastname${lastname}&temporary_info_id=${temporaryInfoId}&user_id=${user_id}`,
        },
      });

      return newPreference;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async reciveWebhook(paymentQuery) {
    try {
      if (paymentQuery.type === "payment") {
        const payment = new Payment(client);

        const paymentData = await payment.get({
          id: paymentQuery["data.id"],
        });

        const email = paymentQuery.email_acount;
        const name = paymentQuery.name;
        const lastname = paymentQuery.lastname;
        const temporaryInfoId = paymentQuery.temporary_info_id;
        const payment_id = paymentData.id;
        const status = paymentData.status;
        const user_id = paymentQuery.user_id;

        //el status detail nos dice si el pago fue acreditado, ver si es necesario incluirlo en la validación, por ahora no lo puse porque aveces aunque un pago este aprobado demora en acreditarse
        //const status_detail = paymentData.status_detail;

        if (status !== "approved") {
          throw new Error(`Payment went wrong: payment status: ${status}`);
        }
        //VER COMO GENERAR NUMERO DE ORDEN
        const order_id = Math.round(Math.random() * 100000);
        const date = getDate();

        const existingTransaction = await Billing.findOne({
          payment_id,
        });

        if (existingTransaction) {
          console.log(
            "Payment already processed. Skipping duplicate handling."
          );
          return; // Evita procesar el pago y enviar el correo de nuevo.
        }

        // Procesar información temporal
        const temporaryInfo = await TemporaryTransaction.findById(
          temporaryInfoId
        );
        const {
          billingInfo = {},
          itemsInfo = [],
          deliveryInfo = {},
          talismanDigitalInfo = [],
        } = temporaryInfo;

        const billingDetails = {
          ...billingInfo,
          email,
          date,
          order_id,
          payment_id,
          payment_method: "Mercado Pago",
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
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = MercadopagoServices;
