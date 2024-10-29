const { envs } = require("../config/env.config");
const transporter = require("../config/mailerTransporter");

const {MailTemplate1}=require("../assets/mailTemplates")

async function sendRegistrationEmail(destinatario, nombreUsuario, token) {
  const link = `${envs.DOMAIN_URL}/api/v1/user/confirmAcount/${token}`;
  const title="Te damos la bienvenida a"
  const content="Por favor, confirma tu correo para ingresar a tu cuenta. Solo tenemos que verificar tu dirección de correo electrónico para finalizar la configuración de tu cuenta."
  const buttonText="CONFIRMAR CUENTA"

  const html =MailTemplate1(nombreUsuario,title,content,link,buttonText);

  const mailOptions = {
    from: `Lovelia <${envs.USER_MAILER}>`,
    to: destinatario,
    subject: "Por favor confirmar cuenta",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}

async function forgetPasswordEmail(destinatario, nombreUsuario, token) {
  const link = `${envs.FRONT_URL}/reset-password/?token=${token}`;
  const content="Si no hiciste este pedido, por favor ignora este mail.Para hacerlo, haz clic en el siguiente botón:"
 const title="Recibimos una solicitud para cambiar tu contraseña."
  const buttonText="RESTABLECER CONTRASEÑA"
  const html =MailTemplate1(nombreUsuario,title,content,link,buttonText);

  const mailOptions = {
    from: `Lovelia <${envs.USER_MAILER}>`,
    to: destinatario,
    subject: "Recuperar contraseña",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}

async function consultEmail(name, message, email, subject) {
  const mailOptions = {
    from: `Lovelia <${envs.USER_MAILER}>`,
    to: envs.USER_MAILER,
    subject: `Consulta: ${subject}`,
    text: `${message} \n name:${name} \n ${email} `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}

async function shopingDetailsEmail(destinatario,products,deliveryInfo,orderId) {

  const productList = products.map((item) => {
    return `<p>${item.model} (${item.material}-${item.rock}-${item.chain}-${item.intention})</p> \n`;
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Confirmación de Compra</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1, h3, h4 {
        color: #6f3289;
      }
      .product-list {
        margin-top: 20px;
      }
      .product-item {
        background-color: #f9f9f9;
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .product-item p {
        margin: 5px 0;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Gracias por tu compra</h1>
      <h3>Tu pedido está en camino</h3>
      <h4>Orden de compra: ${orderId}</h4>
      <br/>
      <h4>Productos</h4>
      <div class="product-list">
        ${productList}
      </div>
      <h4>Datos de envío</h4>
      <p><span>Dirección: </span> ${deliveryInfo.address}</p>
      <p><span>Telefono: </span> ${deliveryInfo.phone}</p>
      <p><span>Recive: </span> ${deliveryInfo.receiver}</p>

      <div class="footer">
        <p>Si tienes alguna pregunta, responde a este correo o contáctanos en <a href="mailto:support@example.com">info@lovelia.com</a></p>
        <p>&copy; 2024 Lovelia. Todos los derechos reservados.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `Lovelia <${envs.USER_MAILER}>`,
    to: destinatario,
    subject: "shoping details",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}


async function sendSubscriptionEmail(destinatario, nombreUsuario) {
  const link = "";
  const title="Tu subscripción ha sido activada."
  const content="Conectate con tu esencia y tu proposito con ayuda de tu talismán digital."
  const buttonText=""

  const html =MailTemplate1(nombreUsuario,title,content,link,buttonText);

  const mailOptions = {
    from: `Lovelia <${envs.USER_MAILER}>`,
    to: destinatario,
    subject: "Subscripción Lovelia",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  sendRegistrationEmail,
  forgetPasswordEmail,
  consultEmail,
  shopingDetailsEmail,
  sendSubscriptionEmail
};
