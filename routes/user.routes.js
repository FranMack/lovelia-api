const express = require("express");
const userRouter = express.Router();
const UserControllers = require("../controllers/user.controllers");
const {
  registerValidations,
  changePasswordValidator,
  loginValidations,
} = require("../midlewares/userValidator");
const { validateAuth } = require("../midlewares/auth");


//Swagger 
/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Registro de usuario
 *     description: Permite a los usuarios registrarse en la plataforma proporcionando información básica como nombre de usuario, correo electrónico y contraseña. Una vez registrado con éxito, el usuario recibira un correo electronico donde debera confirmar la cuenta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario.
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: Apellido del usuario.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: doe@mail.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "!JhonDoe77"
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account has been created successfully, you will then receive an email that   will allow you to confirm your account
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
 *               usuario ya registrado:
 *                 value: User already exist
 *               cuenta no habilitada:
 *                 value: Your acount is not confirmed
 *               email invalido:
 *                 value: invalid email
 *               email requerido:
 *                 value: email is required
 *               password requerido:
 *                 value: password is required
 *               longitud de password requerida:
 *                 value: password minimum 8 character
 *               password debe contener al menos un numero:
 *                 value: password must contain at least one number
 *               password debe contener al menos una minúscula:
 *                 value: password must contain at least one lowercase letter
 *               password debe contener al menos una mayuscula:
 *                 value: password must contain at least one capital letter
 *               password debe contener al menos una caracter especial:
 *                 value: password must contain at least one special character
 *               nombre requerido:
 *                 value: name is required
 *               nombre debe contener letras:
 *                 value: name can only contain letters and spaces
 *               apellido requerido:
 *                 value: lastname is required
 *               apellido debe contener letras:
 *                 value: lastname can only contain letters and spaces
 */

/**
 * @openapi
 * /user/confirmAcount/{token}:
 *   get:
 *     tags:
 *       - User
 *     summary: Confirmación de cuenta de usuario.
 *     description: Envía un correo electrónico de confirmación a la dirección proporcionada por el usuario durante el proceso de registro. El correo electrónico contiene un enlace único que el usuario debe hacer clic para confirmar la creación de la cuenta. Una vez confirmada, la cuenta del usuario será activada y estará lista para su uso en la plataforma.
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Token de confirmación del usuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account is now activated.
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
 *               credenciales invalidas: 
 *                 value: Wrong Credentials
 *               cuenta ya activada:
 *                 value: The account is already activated
 *               token invalido:
 *                 value: Invalid Token 
 */

/**
 *
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Inicio de sesión de usuario
 *     description: Permite a los usuarios iniciar sesión en la plataforma utilizando sus credenciales de registro, como el nombre de usuario y la contraseña. Después de una verificación exitosa, se generará un token de acceso que se utilizará para autenticar las solicitudes a otros endpoints protegidos.
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
 *                 example: example@gmail.com
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 example: aaa!123AD
 *                 description: Contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                payload:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      example: 65ef7c7db7cda0e176267016
 *                    email:
 *                      type: string
 *                      format: email
 *                      example: example@gmail.com
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
 *               credenciales invalidas:
 *                 value: Wrong Credentials
 *               cuenta no habilitada:
 *                 value: Your acount is not confirmed
 *               email invalido:
 *                 value: invalid email
 *               email requerido:
 *                 value: email is required
 *               password requerido:
 *                 value: password is required
 */

/**
 * @openapi
 * /user/logout:
 *   get:
 *     summary: Cierre de sesión de usuario
 *     description: Permite a los usuarios cerrar sesión en la plataforma, invalidando el token de acceso asociado con la sesión actual. Esto asegura que el usuario ya no tenga acceso a recursos protegidos una vez que haya cerrado sesión correctamente.
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You have logged out.
 *       '401':
 *         description: Servicio no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */

/**
 * @openapi
 * /user/forgetPassword:
 *   post:
 *     tags:
 *       - User
 *     summary: Solicitud de restablecimiento de contraseña.
 *     description: Permite a los usuarios solicitar un restablecimiento de contraseña enviando un correo electrónico a la dirección asociada con su cuenta. El correo electrónico contiene un enlace único que permite al usuario restablecer su contraseña. Una vez que se completa el restablecimiento, el usuario puede acceder nuevamente a su cuenta utilizando la nueva contraseña.

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
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You will recive an email to reset your password
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
 *               credenciales invalidas: 
 *                 value: Wrong Credentials
 *               cuenta no habilitada:
 *                 value: Your acount is not confirmed
 */

/**
 * @openapi
 * /user/changePassword:
 *   patch:
 *     tags:
 *       - User
 *     summary: Cambio de contraseña de usuario
 *     description: Permite a los usuarios cambiar su contraseña utilizando un token proporcionado por el endpoint de olvido de contraseña junto con la nueva contraseña deseada. El token garantiza la autenticidad y la validez de la solicitud de cambio de contraseña. Una vez que se completa el proceso, la contraseña del usuario se actualiza y puede utilizarla para acceder a la plataforma con sus credenciales actualizadas.

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 format: email
 *                 description: Token de de recuperación de contraseña.
 *               password:
 *                 type: string
 *                 description: Nueva contraseña.
 *     responses:
 *       '201':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your password has benn reset
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
 *               token invalido: 
 *                 value: Invalid Token
 *               cuenta no habilitada:
 *                 value: Your acount is not confirmed
 *               password requerido:
 *                 value: password is required
 *               longitud de password requerida:
 *                 value: password minimum 8 character
 *               password debe contener al menos un numero:
 *                 value: password must contain at least one number
 *               password debe contener al menos una minúscula:
 *                 value: password must contain at least one lowercase letter
 *               password debe contener al menos una mayuscula:
 *                 value: password must contain at least one capital letter
 *               password debe contener al menos una caracter especial:
 *                 value: password must contain at least one special character
 */

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener detalles del usuario actual
 *     description: Este endpoint devuelve información detallada sobre el usuario actualmente autenticado en la plataforma. Proporciona datos como el nombre de usuario, dirección de correo electrónico, id y cualquier otra información relevante asociada con la cuenta del usuario. El acceso a este endpoint está protegido y requiere autenticación mediante un token válido.

 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: FDafa3R3FAfdfgSFS.
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: example@mail.com.
 *                 name:
 *                   type: string
 *                   example: Jhon . 
 *       '401':
 *         description: Servicio no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *
 * */

/**
 * @openapi
 * /user/birthPlace:
 *   post:
 *     tags:
 *       - User
 *     summary: Obtener detalles del lugar de nacimiento del usuario.
 *     description: Este endpoint permite a los usuarios enviar su lugar de nacimiento en el cuerpo de la solicitud y obtener como respuesta información detallada sobre el mismo. El objeto devuelto incluye detalles como la ciudad, el estado/provincia, el país, las coordenadas geográficas y la zona horaria del lugar de nacimiento proporcionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               birthPlace:
 *                 type: string
 *                 description: Lugar de nacimiento.
 *                 example: Villaguay, Argentina
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: Departamento Villaguay
 *                 state:
 *                   type: string
 *                   example: Provincia de Entre Ríos
 *                 country:
 *                   type: string
 *                   example: Argentina
 *                 coordinates:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: -31.8677008
 *                     lng:
 *                       type: number
 *                       example: -59.0269219
 *                 timeZone:
 *                   type: number
 *                   example: -3
 *       '401':
 *         description: Servicio no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
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
 *               subscription not paid:
 *                 value: The subscription has not been paid
 *               birth place is required:
 *                 value: The birth place is required
 *               astrological information has been already save:
 *                 value: You have already used succesfully this end point, your astrological information has been already save in the db.
 */

/**
 * @openapi
 * /natalHoroscope:
 *   post:
 *     tags:
 *       - User
 *     summary: Obtener información del horóscopo natal
 *     description: Permite a los usuarios obtener su carta natal una vez que han realizado el pago
 *       y están autenticados en el sistema. La solicitud incluye la información necesaria para calcular
 *       la carta natal del usuario, como la fecha y hora de nacimiento, las coordenadas geográficas del
 *       lugar de nacimiento y la zona horaria correspondiente. Se espera que el usuario haya iniciado sesión
 *       previamente y haya completado el proceso de pago. Una vez que se recibe la solicitud y se confirma
 *       el pago, se consulta a una API externa de astrología para obtener los detalles de la carta natal
 *       del usuario. La respuesta obtenida se guarda en la base de datos del sistema, asociada al correo
 *       electrónico del usuario para futuras consultas y análisis.
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
 *                 example: franmack99@hotmail.com
 *               day:
 *                 type: integer
 *                 description: Día de nacimiento.
 *                 example: 15
 *               month:
 *                 type: integer
 *                 description: Mes de nacimiento.
 *                 example: 5
 *               year:
 *                 type: integer
 *                 description: Año de nacimiento.
 *                 example: 1989
 *               hour:
 *                 type: integer
 *                 description: Hora de nacimiento.
 *                 example: 19
 *               min:
 *                 type: integer
 *                 description: Minuto de nacimiento.
 *                 example: 19
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitud del lugar de nacimiento.
 *                 example: -34.6036844
 *               lon:
 *                 type: number
 *                 format: float
 *                 description: Longitud del lugar de nacimiento.
 *                 example: -58.3815591
 *               tzone:
 *                 type: integer
 *                 description: Zona horaria del lugar de nacimiento.
 *                 example: -3
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userHoroscopeInfo:
 *                   type: object
 *                   properties:
 *                     planets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           planetName:
 *                             type: string
 *                             example: Sun
 *                           housePosition:
 *                             type: integer
 *                             example: 6
 *                           signName:
 *                             type: string
 *                             example: Taurus
 *                           element:
 *                             type: string
 *                             example: Earth
 *                       example:
 *                         - planetName: Sun
 *                           housePosition: 6
 *                           signName: Taurus
 *                           element: Earth
 *                         - planetName: Moon
 *                           housePosition: 11
 *                           signName: Libra
 *                           element: Air
 *                     houseCups:
 *                       type: object
 *                       properties:
 *                         houseName:
 *                           type: integer
 *                           example: 1
 *                         signName:
 *                           type: string
 *                           example: Sagittarius
 *                         element:
 *                           type: string
 *                           example: Fire
 *                     aspects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           aspectingPlanet:
 *                             type: string
 *                             example: Sun
 *                           aspectType:
 *                             type: string
 *                             example: Square
 *                           aspectedPlanet:
 *                             type: string
 *                             example: Midheaven
 *                       example:
 *                         - aspectingPlanet: Sun
 *                           aspectType: Square
 *                           aspectedPlanet: Midheaven
 *                         - aspectingPlanet: Moon
 *                           aspectType: Square
 *                           aspectedPlanet: Uranus
 *                 chineseInfo:
 *                   type: object
 *                   properties:
 *                     animal:
 *                       type: string
 *                       example: Snake
 *                     number:
 *                       type: integer
 *                       example: 2
 *                     element:
 *                       type: string
 *                       example: Earth
 *                 kinMayaInfo:
 *                   type: object
 *                   properties:
 *                     kin:
 *                       type: integer
 *                       example: 172
 *                     solarSail:
 *                       type: string
 *                       example: human
 *                     cosmicTone:
 *                       type: integer
 *                       example: 3
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
 *               user not found:
 *                 value: Wrong Credentials 
 *               subscription not paid:
 *                 value: The subscription has not been paid
 *               astrological information has been already save:
 *                 value: Your astrological information has been already save in the db, please use /astrological-info end point to get it
 *       '401':
 *         description: Servicio no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       '405':
 *         description: Método no permitido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Request failed with status code 405
 */

/**
 * @openapi
 * /astrological-info:
 *   get:
 *     tags:
 *       - User
 *     summary: Consulta de información astrológica del usuario guardada en la base de datos.
 *     description: Este endpoint permite consultar información astrológica basada en el correo electrónico del usuario. Se debe proporcionar el correo electrónico como un parámetro de consulta en la URL. La respuesta contiene detalles sobre la carta natal del usuario, incluyendo los signos astrológicos, elementos y aspectos relacionados con su fecha de nacimiento.
 *     parameters:
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
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     houseCups:
 *                       type: object
 *                       properties:
 *                         houseName:
 *                           type: integer
 *                           example: 1
 *                         signName:
 *                           type: string
 *                           example: Sagittarius
 *                         element:
 *                           type: string
 *                           example: Fire
 *                     chineseInfo:
 *                       type: object
 *                       properties:
 *                         animal:
 *                           type: string
 *                           example: Snake
 *                         number:
 *                           type: integer
 *                           example: 2
 *                         element:
 *                           type: string
 *                           example: Earth
 *                     kinMaya:
 *                       type: object
 *                       properties:
 *                         kin:
 *                           type: integer
 *                           example: 172
 *                         solarSail:
 *                           type: string
 *                           example: human
 *                         cosmicTone:
 *                           type: integer
 *                           example: 3
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     planets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           planetName:
 *                             type: string
 *                             example: Sun
 *                           housePosition:
 *                             type: integer
 *                             example: 6
 *                           signName:
 *                             type: string
 *                             example: Taurus
 *                           element:
 *                             type: string
 *                             example: Earth
 *                     aspects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           aspectingPlanet:
 *                             type: string
 *                             example: Sun
 *                           aspectType:
 *                             type: string
 *                             example: Square
 *                           aspectedPlanet:
 *                             type: string
 *                             example: Midheaven
 *                 chineseInfo:
 *                   type: object
 *                   properties:
 *                     animal:
 *                       type: string
 *                       example: Snake
 *                     number:
 *                       type: integer
 *                       example: 2
 *                     element:
 *                       type: string
 *                       example: Earth
 *                 kinMayaInfo:
 *                   type: object
 *                   properties:
 *                     kin:
 *                       type: integer
 *                       example: 172
 *                     solarSail:
 *                       type: string
 *                       example: human
 *                     cosmicTone:
 *                       type: integer
 *                       example: 3
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
 *               imformación de usuaio no encontrada:
 *                 value: User info can not be found
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

userRouter.post("/register", registerValidations, UserControllers.register);
userRouter.post("/login", loginValidations, UserControllers.login);
userRouter.get("/confirmAcount/:token", UserControllers.confirmAcount);
userRouter.post(
  "/forgetPassword",
  loginValidations,
  UserControllers.forgetPassword
);


userRouter.get("/new-password/:token",UserControllers.newPassword)


userRouter.patch(
  "/changePassword",
  changePasswordValidator,
  UserControllers.changePassword
);
userRouter.get("/logout", validateAuth, UserControllers.logout);
userRouter.post("/birthPlace",validateAuth, UserControllers.birthPlace);
userRouter.post(
  "/natalHoroscope",validateAuth,
  UserControllers.natalHoroscope
);
userRouter.get(
  "/astrological-info",
  validateAuth,
  UserControllers.getUserAstroInfo
);

userRouter.patch(
  "/add-intention",
  validateAuth,
  UserControllers.addIntention
);
userRouter.get(
  "/my-intention/:email",
  validateAuth,
  UserControllers.userIntention
);

userRouter.get(
  "/meditations",validateAuth,
  UserControllers.meditations
);

userRouter.get(
  "/sounds",validateAuth,
  UserControllers.sounds
);





userRouter.get("/me/:fcmToken", validateAuth, UserControllers.sessionFmcToken);

userRouter.post("/consult",UserControllers.formConsult)

userRouter.post("/cleanUserJSON",validateAuth,UserControllers.cleanUserJSON)

module.exports = userRouter;
