require("dotenv").config();

const envs = {
  PORT: process.env.PORT,
  DOMAIN_URL: process.env.DOMAIN_URL,
  FRONT_URL: process.env.FRONT_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_URL_TESTING: process.env.MONGODB_URL_TESTING,
  SECRET: process.env.SECRET,
  SECRET_CONFIRM_ACOUNT: process.env.SECRET_CONFIRM_ACOUNT,
  USER_MAILER: process.env.USER_MAILER,
  PASSWORD_MAILER: process.env.PASSWORD_MAILER,
  ASTRO_API_URL: process.env.ASTRO_API_URL,
  ASTRO_API_USER: process.env.ASTRO_API_USER,
  ASTRO_API_PASSWORD: process.env.ASTRO_API_PASSWORD,
  ID_CLIENT_GOOGLE: process.env.ID_CLIENT_GOOGLE,
  SECRET_GOOGLE: process.env.SECRET_GOOGLE,
  CALLBACK_URL_GOOGLE: process.env.CALLBACK_URL_GOOGLE,
  ID_CLIENT_FACEBOOK: process.env.ID_CLIENT_FACEBOOK,
  SECRET_FACEBOOK: process.env.SECRET_FACEBOOK,
  CALLBACK_URL_FACEBOOK: process.env.CALLBACK_URL_FACEBOOK,
  MERCADO_PAGO_TOKEN: process.env.MERCADO_PAGO_TOKEN,
  PAYPAL_API_URL: process.env.PAYPAL_API_URL,
  PAYPAL_SECRET_KEY: process.env.PAYPAL_SECRET_KEY,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_SECRET_KEY: process.env.PAYPAL_SECRET_KEY,
  GOOGLE_GEOCODING_URL: process.env.GOOGLE_GEOCODING_URL,
  GOOGLE_TIMEZONE: process.env.GOOGLE_TIMEZONE,
  GOOGLE_GEOCODING_KEY: process.env.GOOGLE_GEOCODING_KEY,
  MERCADO_PAGO_SUBSCRIPTION_PLAN_ID:
    process.env.MERCADO_PAGO_SUBSCRIPTION_PLAN_ID,

  GOOGLE_CLOUD_TYPE: process.env.GOOGLE_CLOUD_TYPE,
  GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_PRIVATE_KEY_ID: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
  GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_CLIENT_ID: process.env.GOOGLE_CLOUD_CLIENT_ID,
  GOOGLE_CLOUD_AUTH_URI: process.env.GOOGLE_CLOUD_AUTH_URI,
  GOOGLE_CLOUD_TOKEN_URI: process.env.GOOGLE_CLOUD_TOKEN_URI,
  GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL:
    process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
  GOOGLE_CLOUD_CLIENT_X509_CERT_URL:
    process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
  GOOGLE_CLOUD_UNIVERSE_DOMAIN: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN,
};

module.exports = { envs };
