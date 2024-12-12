const { envs } = require("../config/env.config");
const {
  User,
  TalismanDigital,
  TemporaryTransaction,
  Delivery,
  Billing,
} = require("../models/index.models");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const SoldProductServices = require("../services/soldProduct.services");
const { getDate } = require("../helpers/getDate");
const { shopingDetailsEmail2 } = require("../helpers/mailer");

const client = new MercadoPagoConfig({
  accessToken: envs.MERCADO_PAGO_TOKEN,
});

class MercadopagoServices {
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

      const talismanAnalogicDetails = productDetails.filter((item) => {
        if (item.model !== "Digital") {
          return item;
        }
      });

      if (talismanAnalogicDetails.length > 0) {
        temporaryInfoObject.deliveryInfo = deliveryDetails;
        temporaryInfoObject.itemsInfo = talismanAnalogicDetails;
      }

      if (talismanDigitalOwners) {
        temporaryInfoObject.talismanDigitalInfo = talismanDigitalOwners;
      }

      const temporaryInfo = await TemporaryTransaction.create(
        temporaryInfoObject
      );
      const temporaryInfoId = temporaryInfo.id;

      const successUrl = envs.FRONT_URL;

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
          notification_url: `${envs.DOMAIN_URL}/api/v1/payment-mercadopago/webhook/?email_acount=${email}&name=${name}&lastname${lastname}&temporary_info_id=${temporaryInfoId}`,
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

        const date = getDate();
        const email = paymentQuery.email_acount;
        const name = paymentQuery.name;
        const lastname = paymentQuery.lastname;
        const temporaryInfoId = paymentQuery.temporary_info_id;
        const payment_id = paymentData.id;
        const status = paymentData.status;

        //VER COMO GENERAR NUMERO DE ORDEN
        const order_id = Math.round(Math.random() * 100000);

        const existingTransaction = await Billing.findOne({
          payment_id,
        });

        if (existingTransaction) {
          console.log(
            "Payment already processed. Skipping duplicate handling."
          );
          return; // Evita procesar el pago y enviar el correo de nuevo.
        }

        //el status detail nos dice si el pago fue acreditado, ver si es necesario incluirlo en la validación, por ahora no lo puse porque aveces aunque un pago este aprobado demora en acreditarse
        //const status_detail = paymentData.status_detail;
        if (status === "approved") {
          const temporaryInfo = await TemporaryTransaction.findById(
            temporaryInfoId
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
            payment_method: "Mercado Pago",
          };

          const billingInfoDB = await Billing.create(billingDetails);

          if (temporaryInfo.itemsInfo.length > 0) {
            const deliveryInfo = await Delivery.create(deliveryDetails);

            const productListDB = productDetails
              ? await SoldProductServices.addProduct(
                  productDetails,
                  deliveryInfo._id,
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

                // Buscar el usuario y actualizar su estado de pago si existe
                const user = await User.findOne({ email: item.email });
                if (user) {
                  user.payment = true;
                  await user.save();
                }
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
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = MercadopagoServices;
