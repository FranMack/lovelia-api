const express = require("express");
const paypalRouter = express.Router();
const PaypalControllers=require("../controllers/paypal.controllers")




/**
 * @openapixxx
 * /payment-paypal/create-order:
 *   post:
 *     tags:
 *       - PayPal
 *     summary: Crear una orden de pago en PayPal.
 *     description: Este endpoint permite crear una orden de pago en PayPal para el usuario proporcionado. La respuesta contiene un enlace que redirige al usuario a la página de pago en PayPal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: example@mail.com
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link_de_pago:
 *                   type: string
 *                   description: Enlace de pago en PayPal.
 *                   example: "https://www.sandbox.paypal.com/checkoutnow?token=8UL18704DS1230154"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               usuario no encontrado:
 *                 value: Wrong Credentials
 *               cuenta no confirmada:
 *                 value: Your account is not confirmed
 *               la subscripción ya ha sido abonada:
 *                 value: The subscription for this account has already been paid
 *       '401':
 *         description: Servicio no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorize
 */

/**
 * @openapixxx
 * /payment-paypal/capture-order:
 *   get:
 *     tags:
 *       - PayPal
 *     summary: Capturar una orden de pago en PayPal.
 *     description: Este endpoint permite capturar una orden de pago en PayPal, guardando en la base de datos el ID de pago. Se debe proporcionar el token y el correo electrónico del usuario como parámetros de consulta en la URL. La respuesta indica si el pago se ha completado correctamente.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de la orden de pago en PayPal.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *         description: Correo electrónico del usuario.
 *         example: franmack99@hotmail.com
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                    type: string
 *                    example: "The payment was successful, payment id: XYZ123"
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               usuario no encontrado:
 *                 value: Wrong Credentials
 *               error en el pago:
 *                 value: "Payment went wrong: payment status: Failed"
 */



paypalRouter.post("/create-order",PaypalControllers.createOrder);
paypalRouter.get("/capture-order", PaypalControllers.captureOrder);
  paypalRouter.get("/cancel-order", PaypalControllers.cancelOrder);

module.exports = paypalRouter;
