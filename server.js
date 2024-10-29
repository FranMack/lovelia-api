const { envs } = require("./config/env.config");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const models = require("./models/index.models");
const routes = require("./routes/index.routes");
const passport = require("passport");
const { swaggerDocs } = require("./swagger");
const path = require("path");

const PORT = envs.PORT;

const app = express();

app.set("trust proxy", 1); // Confía en el proxy de Heroku

app.use(
  cors({
    origin: `${envs.FRONT_URL}`, // URL del frontend
    credentials: true, // Habilita el envio de cookies
  })
);

app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Configura express-session
app.use(
  session({
    secret: "tu-secreto-aqui", // Debes establecer tu propia clave secreta
    resave: false,
    saveUninitialized: false,
  })
);

// Luego, configura Passport y sus estrategias de autenticación
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", routes);

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  swaggerDocs(app, PORT);
});

mongoose
  .connect(envs.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");
    // Add cron job after successful connection
    require("./controllers/cron.controller"); // Import the cron controller
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = { app, server };
