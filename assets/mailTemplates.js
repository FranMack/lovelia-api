

const loveliaLogo ="https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872237/lovelia_logo.png";
const twitterLogo="https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872236/instagram_logo.png";
const facebookLogo="https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872237/twitter_logo.png";
const instagramLogo="https://res.cloudinary.com/di9ikwaxu/image/upload/v1727872236/facebook_logo.png"

function MailTemplate1(name,title,content,link,buttonText) {
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
            font-size: 30px;
            font-weight: 400;
            color: #6f3289;
            margin-top: 2%;
            margin-bottom: 2%;
        }
        .mail-container .text-container p {
            font-size: 20px;
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
            font-size: 17px;
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
             padding-top:6vh;
        }
       
        table {
            width: 100%;
            border-collapse: collapse;
             background-color: #ffefee;
             padding-top:6vh;
             padding-bottom:6vh;
        }
        td {
            text-align: center;
            vertical-align: middle;
        }
        .footer-img {
            width: auto;
            height: 30px;
            margin: 0 10px;
        }
        .left-img {
            text-align: left;
        }
        .right-img {
            text-align: right;
        }
        .bottom-container {
            width: 100%;
            text-align: center;
            font-size: 15px;
            padding-top: 1%;
            padding-bottom: 1%;
            background-color: #ffefee;
        }
    </style>
</head>
<body>
    <div class="mail-container">
        <div class="logo-container">
            <img src="${loveliaLogo}" alt="logo" />
        </div>
        <div class="text-container">
            <p>Hola ${name},</p>
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
                        <img src="${instagramLogo}" alt="logo" class="footer-img" style="margin-right: 60px; height: 30px;" />
                        <img src="${facebookLogo}" alt="logo" class="footer-img" style="margin-right: 60px; height: 30px;" />
                        <img src="${twitterLogo}" alt="logo" class="footer-img" style="margin-right: 30px; height: 30px;" />
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

module.exports = { MailTemplate1 };
