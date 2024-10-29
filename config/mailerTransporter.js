const {envs}=require("../config/env.config")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: envs.USER_MAILER,
    pass: envs.PASSWORD_MAILER,
  },
});

module.exports = transporter;
