const { envs } = require("../config/env.config");
const {
  User,
  Product,
  TemporaryTransaction,
  UserAstroData,
  Billing,
} = require("../models/index.models");
const {
  MercadoPagoConfig,
  Preference,
  Payment,
  PreApprovalPlan,
  PreApproval,
  CardToken,
} = require("mercadopago");
const ProductServices = require("../services/product.services");
const { getDate, timeConverter } = require("../helpers/getDate");
const {
  shopingDetailsEmail,
  sendSubscriptionEmail,
} = require("../helpers/mailer");
const axios = require("axios");

const client = new MercadoPagoConfig({
  accessToken: envs.MERCADO_PAGO_TOKEN,
});

class MercadopagoServices {
  static async createOrder(data) {
    const { email, items, productDetails, deliveryDetails, billingDetails } =
      data;
    try {
      const temporaryInfo = await TemporaryTransaction.create({
        billingInfo: billingDetails,
        deliveryInfo: deliveryDetails,
        itemsInfo: productDetails,
      });
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
          notification_url: `${envs.DOMAIN_URL}/api/v1/payment-mercadopago/webhook/?email_acount=${email}&temporary_info_id=${temporaryInfoId}`,
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
          const { billingInfo, deliveryInfo, itemsInfo } = temporaryInfo;

          const productDetails = itemsInfo;
          const deliveryDetails = deliveryInfo;
          const billingDetails = {
            ...billingInfo,
            email,
            date,
            order_id,
            payment_id,
            payment_method: "Mercado Pago",
          };

          const productListDB = productDetails
            ? await ProductServices.addProduct(
                productDetails,
                deliveryDetails,
                billingDetails
              )
            : null;

          //enviar mail con detalle de compra
          shopingDetailsEmail(email, productDetails, deliveryDetails, order_id);

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

  static async createSubscriptionPlan() {
    try {
      const preapproval_plan = new PreApprovalPlan(client);

      const newPlan = await preapproval_plan.create({
        body: {
          reason: "Lovelia talismán",
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            repetitions: 12,
            billing_day: 10,
            billing_day_proportional: true,
            free_trial: {
              frequency: 1,
              frequency_type: "months",
            },

            transaction_amount: 15,
            currency_id: "ARS",
          },
          payment_methods_allowed: {
            payment_types: [
              // Especificar tipos de pago permitidos
              { id: "credit_card" },
              { id: "debit_card" },
            ],
            payment_methods: [
              // Especificar métodos de pago permitidos
              { id: "visa" },
              { id: "master" },
              { id: "amex" },
              { id: "cabal" },
              { id: "naranja" },
              { id: "maestro" },
              { id: "cabal_debito" },
            ],
          },
          back_url: "https://022e-190-228-241-76.ngrok-free.app",
        },
      });

      return newPlan;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getSubscriptionPlan(preApprovalPlanId) {
    try {
      const preApprovalPlan = new PreApprovalPlan(client);

      const plan = await preApprovalPlan.get({
        preApprovalPlanId: preApprovalPlanId,
      });

      return plan;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async paySubscription(data, authToken) {
    const { payer, token, user_email, userInfo } = data;

    try {
      const user = await User.findOne({ email: user_email });

      if (!user) {
        throw new Error("Wrong Credentials");
      }
      if (!user.confirm) {
        throw new Error("Your account is not confirmed");
      }
      if (user.payment && user.payer_id) {
        throw new Error(
          "The subscription for this account has already been paid"
        );
      }

      const preApproval = new PreApproval(client);

      const plan = await preApproval.create({
        body: {
          preapproval_plan_id: envs.MERCADO_PAGO_SUBSCRIPTION_PLAN_ID,
          reason: "Lovelia talisman",
          payer_email: payer.email,
          card_token_id: token,
          auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            transaction_amount: 15,
            currency_id: "ARS",
          },
          back_url: `${envs.FRONT_URL}/profile`,
          status: "authorized",
        },
      });

      if (plan.status === "authorized") {
        user.payment = true;
        user.payer_id = plan.payer_id;
        user.subscription_id = plan.id;
        await user.save();

        const { location, day, month, year, hour, min, meridiam } = userInfo;

        const { data } = await axios.post(
          `${envs.DOMAIN_URL}/api/v1/user/birthPlace`,
          { birthPlace: location, email: user_email },
          {
            withCredentials: true,
            headers: {
              Cookie: `token=${authToken}`,
            },
          }
        );
        const { coordinates, timeZone } = data;

        const natalHoroscope = await axios.post(
          `${envs.DOMAIN_URL}/api/v1/user/natalHoroscope`,
          {
            email: user_email,
            lat: coordinates.lat,
            lon: coordinates.lng,
            tzone: timeZone,
            year,
            month,
            day,
            hour: timeConverter(hour, meridiam),
            min,
          },
          {
            withCredentials: true,
            headers: {
              Cookie: `token=${authToken}`,
            },
          }
        );

        sendSubscriptionEmail(user_email, user.name);

        return plan;
      } else {
        throw new Error("Error al procesar el pago (back)");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async subscriptorsStatus() {
    try {
      const preApproval = new PreApproval(client);
      const options = {
        status: "authorized",
      };

      const subscriptors = await preApproval.search({ options });

      return subscriptors;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async cancelSubscription(email) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }
      if (!user.payment || !user.subscription_id) {
        throw new Error("The subscription was already inactive");
      }

      const subscriptionId = user.subscription_id;

      const client = new MercadoPagoConfig({
        accessToken: envs.MERCADO_PAGO_TOKEN,
      });

      const preApproval = new PreApproval(client);

      const updateSubscription = await preApproval.update({
        id: subscriptionId,
        body: {
          status: "cancelled",
        },
      });

      const userAstroData = await UserAstroData.findOne({ email });
      if (userAstroData) {
        await UserAstroData.deleteMany({ email });
      }

      user.payment = false;
      user.subscription_id = "";
      user.payer_id = "";

      await user.save();

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = MercadopagoServices;
