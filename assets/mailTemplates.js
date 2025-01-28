const loveliaLogo =
  "https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872237/lovelia_logo.png";
const twitterLogo =
  "https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872236/instagram_logo.png";
const facebookLogo =
  "https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872237/twitter_logo.png";
const instagramLogo =
  "https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872236/facebook_logo.png";

function MailTemplate1(name = "", title, content, link, buttonText) {
  return `
     <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Validación de cuenta</title>
      <style>
          .body-container {
              width: 100vw;
              min-height: 100vh;
          }
          .mail-container {
              margin: 0 auto;
              width: 70%;
              background-color: #f7f0f1;
          }
          .mail-container .logo-container {
              margin: 0 auto;
              padding-top: 10vh;
              width: 17%;
          }
          .mail-container .logo-container img {
              object-fit: cover;
              width: 100%;
          }
          .mail-container .text-container {
              width: 70%;
              margin: auto;
              margin-top: 2%;
          }
          .mail-container .text-container h2 {
          text-align: center;
              font-size: 25px;
              font-weight: 400;
              color: #6f3289;
              margin-top: 2%;
              margin-bottom: 2%;
          }
          .mail-container .text-container p {
          text-align: center;
              font-size: 16px;
              margin-bottom: 10px;
          }
          .mail-container .button-container {
              width: fit-content;
              margin: 0 auto;
              margin-top: 8%;
              margin-bottom: 10vh;
          }
          .mail-container .button-container a {
              background-color: #ECEA60;
              color: #662A80;
              font-size: 16px;
              font-weight: 600;
              padding: 2.5vh;
              border-radius: 30px;
              border: none;
              padding-inline: 3vw;
              width: 20vw;
              text-decoration: none;
          }
          .mailer-footer {
              width: 100%;
              background-color: #ffefee;
              padding-top: 6vh;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              background-color: #ffefee;
              padding-top: 6vh;
              padding-bottom: 6vh;
          }
          td {
              text-align: center;
              vertical-align: middle;
          }
          .footer-img {
              width: auto;
              height: 25px;
              margin: 0 10px;
          }
          .left-img {
              text-align: left;
          }
          .right-img {
              text-align: right;
              padding-right:10px
          }
          .bottom-container {
              width: 100%;
              text-align: center;
              font-size: 15px;
              padding-top: 1%;
              padding-bottom: 1%;
              background-color: #ffefee;
          }
  
          /* Media Query for Mobile Devices */
          @media only screen and (max-width: 768px) {
              .mail-container {
                  width: 100%;
                  padding: 10px;
              }
              .mail-container .logo-container {
                  width: 40%;
              }
              .mail-container .text-container {
                  width: 100%;
                  margin-top: 5%;
              }
              .mail-container .text-container h2 {
                  font-size: 24px;
              }
              .mail-container .text-container p {
                  font-size: 16px;
              }
              .mail-container .button-container a {
                  font-size: 14px;
                  padding: 15px;
                  padding-inline: 5vw;
              }
              .footer-img {
                  height: 15px;
                  margin: 5px;
              }
          }
      </style>
  </head>
  <body>
      <div class="mail-container">
          <div class="logo-container">
              <img src="${loveliaLogo}" alt="logo" />
          </div>
          <div class="text-container">
              ${name ? `<p>Hola ${name},</p>` : ""}
              <h2>${title}</h2>
              <p>${content}</p>
          </div>
          <div class="button-container">
              <a href="${link}" target="_blank" class="button">${buttonText}</a>
          </div>
          <div class="mailer-footer">
              <table>
                  <tr>
                      <td class="left-img">
                          <img src="${loveliaLogo}" alt="logo" class="footer-img" style="margin-left: 30px; height: 50px;" />
                      </td>
                      <td class="right-img">
                          <img src="${instagramLogo}" alt="logo" class="footer-img"  />
                          <img src="${facebookLogo}" alt="logo" class="footer-img" />
                          <img src="${twitterLogo}" alt="logo" class="footer-img" />
                      </td>
                  </tr>
              </table>
              <div class="bottom-container">
                  <p>© 2024 lovelia. Todos los derechos reservados</p>
              </div>
          </div>
      </div>
  </body>
  </html>
      `;
}

function MailTemplate2(products, deliveryInfo, orderId, name, lastname) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Confirmación de Pedido</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffff;
          }
  
          .mail-container {
              margin: 0 auto;
              width: 70%;
              background-color: #f7f0f1;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
  
          .logo-container {
              text-align: center;
              padding: 20px;
          }
  
          .logo-container img {
              width: 150px;
          }
  
          .text-container {
              padding: 20px;
              text-align: start;
          }
  
          .text-container h2 {
              font-size: 25px;
              color: #6f3289;
              margin-bottom: 10px;
               font-weight: 400;
          }
  
          .text-container h3 {
              font-size: 18px;
              color: #333;
              margin-bottom: 8px;
            font-weight: 400;
          }

          .text-container h4 {
              font-size: 16px;
              color: #333;
              margin-bottom: 8px;
          }
  
          .text-container p {
              font-size: 16px;
              color: #555;
              margin-bottom: 15px;
          }
  
          .text-container .product-list {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              border: 1px solid #ddd;
              font-size: 12px;
              text-align: left;
          }
  
          .product-list thead {
              background-color: #6f3289;
              color: #fff;
              font-weight: 600;
          }
  
          .product-list th, 
          .product-list td {
              padding: 12px;
              border: 1px solid #ddd;
          }
  
          .product-list th {
              text-transform: capitalize;
              text-align: center;
          }
  
          .product-list tbody tr:nth-child(even) {
       
          }
  
          .product-list tbody tr:hover {
              background-color: #f0e7f5;
          }
  
          .product-list td {
              color: #555;
              text-align: center;
          }
  
          .mailer-footer {
              width: 100%;
              background-color: #ffefee;
              padding-top: 6vh;
          }
  
          table {
              width: 100%;
              border-collapse: collapse;
              padding-top: 6vh;
              padding-bottom: 6vh;
          }
  
          td {
              text-align: center;
              vertical-align: middle;
          }
  
          .footer-img {
              width: auto;
              height: 25px;
              margin: 0 10px;
          }
  
          .left-img {
              text-align: left;
          }
  
          .right-img {
              text-align: right;
              padding-right: 10px;
          }
  
          .bottom-container {
              width: 100%;
              text-align: center;
              font-size: 15px;
              padding-top: 1%;
              padding-bottom: 1%;
              background-color: #ffefee;
          }
  
          @media only screen and (max-width: 768px) {
              .mail-container {
                  width: 90%;
              }
  
              .text-container h2 {
                  font-size: 22px;
              }
  
              .text-container h3,
              .text-container h4 {
                  font-size: 16px;
              }
  
              .text-container p {
                  font-size: 14px;
              }
  
              .footer-img {
                  height: 20px;
              }
  
              .product-list th, 
              .product-list td {
                  font-size: 14px;
                  padding: 8px;
              }
  
              .product-list {
                  font-size: 14px;
              }
          }
      </style>
  </head>
  <body>
      <div class="mail-container">
          <div class="logo-container">
              <img src="${loveliaLogo}" alt="logo">
          </div>
  
          <div class="text-container">
            <h3>Hola ${name} ${lastname}</h3>
              <h2>Gracias por tu compra</h2>
              <h3>Tu pedido se encuentra en preparación</h3>
              <h4>Orden de compra: ${orderId}</h4>
              <h4>Productos</h4>
              <table class="product-list">
                  <thead>
                      <tr>
                          <th>Unidades</th>
                          <th>Modelo</th>
                          <th>Metal</th>
                          <th>Piedra</th>
                          <th>Colgante</th>
                          <th>Intención</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${products}
                  </tbody>
              </table>
          </div>
  
       ${
         deliveryInfo.address ? 
           `<div class="text-container">
             <h4>Datos de envío</h4>
             <p>
               <strong>Dirección:</strong> ${deliveryInfo.address}
             </p>
             <p>
               <strong>Teléfono:</strong> ${deliveryInfo.phone}
             </p>
             <p>
               <strong>Recibe:</strong> ${deliveryInfo.receiver}
             </p>
        </div>`:""
         
       }
  
          <div class="mailer-footer">
              <table>
                  <tr>
                      <td class="left-img">
                          <img src="${loveliaLogo}" alt="logo" class="footer-img" style="margin-left: 30px; height: 50px;" />
                      </td>
                      <td class="right-img">
                          <img src="${instagramLogo}" alt="logo" class="footer-img" />
                          <img src="${facebookLogo}" alt="logo" class="footer-img" />
                          <img src="${twitterLogo}" alt="logo" class="footer-img" />
                      </td>
                  </tr>
              </table>
              <div class="bottom-container">
                  <p>© 2024 lovelia. Todos los derechos reservados</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  
        `;
}

module.exports = { MailTemplate1, MailTemplate2 };
