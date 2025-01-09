const { envs } = require("./config/env.config");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.routes");
const passport = require("passport");
const { swaggerDocs } = require("./swagger");
const path = require("path");

const PORT = envs.PORT;

const app = express();

// Force SSL for all requests
app.use(forceSSL);

// Enable trust proxy for Heroku
app.set("trust proxy", 1); // Necessary for Heroku to recognize SSL

// Middleware to enforce HTTPS
app.use((req, res, next) => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
});

// Configure CORS
app.use(
  cors({
    origin: `${envs.FRONT_URL}`, // URL del frontend
    credentials: true, // Habilita el envio de cookies
  })
);

// Other middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Configure session
app.use(
  session({
    secret: "tu-secreto-aqui", // Debes establecer tu propia clave secreta
    resave: false,
    saveUninitialized: false,
  })
);

// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/v1", routes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  swaggerDocs(app, PORT);
});

// Connect to MongoDB
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
