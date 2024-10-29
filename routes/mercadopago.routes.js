const express=require("express");
const mercadopagoRouter=express.Router();
const MercadopagoControllers=require("../controllers/mercadopago.controllers")
const { validateAuth } = require("../midlewares/auth");


/**
 * @openapixxx
 * /payment-mercadopago/create-order:
 *   post:
 *     tags:
 *       - Mercado Pago
 *     summary: Crear una nueva orden de pago en Mercado Pago
 *     description: Este endpoint permite crear una orden de pago en Mercado Pago para el usuario proporcionado. La respuesta contiene un enlace que redirige al usuario a la página de pago en Mercado Pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@mail.com
 *     responses:
 *       '200':
 *         description: Link de pago generado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 link_de_pago:
 *                   type: string
 *                   example: https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1701685532-e9beecfc-349f-42fc-afdb-ef6b4c7e81aa
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
 * /payment-mercadopago/webhook:
 *   post:
 *     tags:
 *       - Mercado Pago
 *     summary: Capturar una orden de pago en Mercado Pago.
 *     description: Este endpoint permite capturar una orden de pago en Mercado Pago, guardando en la base de datos el ID de pago. Se debe proporcionar el token y el correo electrónico del usuario como parámetros de consulta en la URL. La respuesta indica si el pago se ha completado correctamente.
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         description: Tipo de notificación.
 *         example: payment
 *         schema:
 *           type: string
 *       - in: query
 *         name: data.id
 *         required: true
 *         description: ID del pago.
 *         example: 16620851721
 *         schema:
 *           type: string
 *       - in: query
 *         name: email_account
 *         required: true
 *         description: Email de la cuenta asociada al pago.
 *         example: example@mail.com
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Notificación recibida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The payment was successful, payment id: XYZ123"
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



mercadopagoRouter.post("/create-order",MercadopagoControllers.createOrder)
mercadopagoRouter.post("/webhook",MercadopagoControllers.reciveWebhook)
mercadopagoRouter.get("/success",(req,res)=>{
    console.log("====>",req.query)
    res.send("success")
})
mercadopagoRouter.get("/failure",(req,res)=>{
    res.send("failure")
})
mercadopagoRouter.get("/pending",(req,res)=>{
    res.send("pending")
})
mercadopagoRouter.post("/create-subscription-plan",MercadopagoControllers.createSubscriptionPlan)
mercadopagoRouter.get("/plan/:preApprovalPlanId",MercadopagoControllers.getSubscriptionPlan)
mercadopagoRouter.get("/subscriptors",MercadopagoControllers.subscriptorsStatus)
mercadopagoRouter.post("/subscribe",validateAuth,MercadopagoControllers.paySubscription)
mercadopagoRouter.put("/cancel-subscription",validateAuth,MercadopagoControllers.cancelSubscription)




module.exports=mercadopagoRouter