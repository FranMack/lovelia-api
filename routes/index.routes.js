const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const universalLoginRoutes = require("./universalLogin.routes");
const mercadopagoRoutes = require("./mercadopago.routes");
const paypalRoutes = require("./paypal.routes");
const soldProductRoutes = require("./soldProduct.routes");
const alarmRoutes = require("./alarm.routes");
const productRoutes=require("./product.routes")
const chatRoutes=require("./chat.routes")
const shoppingCartRouter=require("./shoppingCart.routes")
const AutoCompleteControllers = require("../controllers/autocomplete.controllers");
require("../config/auth.facebooks");
const { validateAuth } = require("../midlewares/auth");

router.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<a href="/api/v1/universalLogin/auth/google">Authenticate with Google</a> </br> <a href="/api/v1/universalLogin/auth/facebook">Authenticate with Facebook</a>'
    );
});

router.get(
  "/autocomplete",
  validateAuth,
  AutoCompleteControllers.getListOfPlaces
);

router.post(
  "/shipping-cost",
  validateAuth,
  AutoCompleteControllers.getListOfPlaces
);

router.post(
  "/shipping-cost",
  validateAuth,
  AutoCompleteControllers.getListOfPlaces
);

router.use("/user", userRoutes);
router.use("/universalLogin", universalLoginRoutes);
router.use("/payment-mercadopago", mercadopagoRoutes);
router.use("/payment-paypal", paypalRoutes);
router.use("/sold-product", soldProductRoutes);
router.use("/product", productRoutes);
router.use("/chat", chatRoutes);

router.use("/alarm", alarmRoutes);
router.use("/shopping-cart", shoppingCartRouter);

module.exports = router;
