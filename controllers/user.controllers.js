const { validationResult } = require("express-validator");
const { cookiesSettings } = require("../config/cookies.settings");
const UserServices = require("../services/user.services");
const {
  generateToken,
  generateTokenConfirmAcount,
} = require("../config/token");
const {
  sendRegistrationEmail,
  forgetPasswordEmail,
  consultEmail,
} = require("../helpers/mailer");
const { filterPlacesInfo } = require("../helpers/filterPlacesInfo");
const path = require("path");
const { envs } = require("../config/env.config");

const { Storage } = require("@google-cloud/storage");

class UserControllers {
  static async register(req, res) {
    const data = req.body;
    const refererUrl = req.headers.referer;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const newUser = await UserServices.register(data);

      const payload = {
        email: newUser.email,
        id: newUser.id,
      };

      if (!newUser.confirm) {
        const token = generateTokenConfirmAcount(payload);

        await sendRegistrationEmail(newUser.email, newUser.name, token);

        return res.status(200).json({
          message:
            "Your account has been created successfully, you will then receive an email that will allow you to confirm your account",
        });
      }

      res.status(200).json({ acountCreated: "ok", acountConfirmed: true });
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async login(req, res) {
    const data = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      const user = await UserServices.login(data);

      const payload = {
        email: user.email,
        name: user.name,
        id: user.id,
        lastname: user.lastname,
        role:user?.role || "user",
      };

      

      const token = generateToken(payload);

      // Set the cookie and log error if it fails
      try {
        res.cookie("token", token, cookiesSettings);
      } catch (error) {
        console.log("Error when trying to save cookies", error);
      }

      res.status(200).json({
        ...payload,
        token,
        lastname: user.lastname,
        subscription: user.payment,
        talismanActivated: user.talismanActivated,
      });
    } catch (error) {
      console.log(error);
      if (error.message === "Wrong Credentials") {
        res.status(401).json({ error: error.message });
      } else if (error.message === "Your account is not confirmed") {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async confirmAcount(req, res) {
    const { token } = req.params;
    try {
      const userConfirmAcount = await UserServices.confirmAcount(token);
      res.redirect(`${envs.FRONT_URL}/correo-validado`);
    } catch (error) {
      if (error.message === "jwt expired") {
        res.redirect(`${envs.FRONT_URL}/tiempo-validacion-expiro`);
      } else if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;
    const refererUrl = req.headers.referer;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      const user = await UserServices.forgetPassword(email);

      forgetPasswordEmail(user.email, user.name, user.token, refererUrl);

      res
        .status(200)
        .json({ message: "You will recive an email to reset your password" });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async newPassword(req, res) {
    const { token } = req.params;

    try {
      res.status(200).json({ token });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async changePassword(req, res) {
    const { password, token } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = await UserServices.changePassword(token, password);
      res.status(201).json({ message: "Your password has benn reset" });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async logout(req, res) {
    res.clearCookie("token", {
      secure: true, // Only send the cookie over HTTPS
      sameSite: "Lax", // Treat the cookie as first-party for navigation requests
      domain: ".lovelia.me", // Share the cookie across subdomains
      path: "/", // Allow the cookie on all routes
    });

    res.status(200).json({ message: "You have logged out" });
  }

  static async natalHoroscope(req, res) {
    const data = req.body;

    try {
      const userTalisman = await UserServices.natalHoroscope(data);
      res.status(200).json(userTalisman);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async birthPlace(req, res) {
    const data = req.body;

    try {
      const { places, timeZone } = await UserServices.birthPlace(data);

      const placesRelevantInfo = filterPlacesInfo(places);
      res.status(200).json({ ...placesRelevantInfo, timeZone });
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getUserAstroInfo(req, res) {
    const { email } = req.query;
    try {
      const userInfo = await UserServices.getUserAstroInfo(email);

      res.json(userInfo);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async cleanUserJSON(req, res) {
    const { email } = req.body;
    try {
      const userJSON = await UserServices.cleanUserJSON(email);
      res.status(200).json("json file deleted");
    } catch (error) {
      console.log(error);
    }
  }

  static async addIntention(req, res) {
    const { intention, email } = req.body;
    try {
      const userIntention = await UserServices.addIntention(intention, email);
      res.status(200).json(userIntention);
    } catch (error) {
      console.log(error);
    }
  }

  static async userIntention(req, res) {
    const { email } = req.params;
    try {
      const userIntention = await UserServices.userIntention(email);
      res.status(200).json(userIntention);
    } catch (error) {
      console.log(error);
    }
  }

  static async meditations(req, res) {
    const storage = new Storage({
      projectId: "leafy-bond-427721-f6", // Reemplaza con tu Project ID
      keyFilename: path.join(__dirname, "../googleCloudCredentials.json"), // Ruta al archivo de credenciales
    });

    const bucketName = "threejs-api"; // Nombre del bucket

    try {
      // Filtrar archivos solo en la "carpeta" meditations
      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: "public/meditations/", // Ruta a la carpeta en el bucket
      });

      // Construir el listado de archivos con sus URLs
      const audioFiles = files.map((file) => ({
        name: file.name.split("/").pop().split(".")[0], // Nombre del archivo sin el prefijo
        url: `https://storage.googleapis.com/${bucketName}/${file.name}`, // URL pública del archivo
      }));

      res.json(audioFiles);
    } catch (error) {
      console.error("Error al obtener las meditaciones:", error);
      res.status(500).send("Error al obtener las meditaciones.");
    }
  }

  static async sounds(req, res) {
    const storage = new Storage({
      projectId: "leafy-bond-427721-f6", // Reemplaza con tu Project ID
      keyFilename: path.join(__dirname, "../googleCloudCredentials.json"), // Ruta al archivo de credenciales
    });

    const bucketName = "threejs-api"; // Nombre del bucket

    try {
      // Filtrar archivos solo en la "carpeta" meditations
      const [files] = await storage.bucket(bucketName).getFiles({
        prefix: "public/sounds/", // Ruta a la carpeta en el bucket
      });

      // Construir el listado de archivos con sus URLs
      const audioFiles = files.map((file) => ({
        name: file.name.split("/").pop().split(".")[0], // Nombre del archivo sin el prefijo
        url: `https://storage.googleapis.com/${bucketName}/${file.name}`, // URL pública del archivo
      }));

      res.json(audioFiles);
    } catch (error) {
      console.error("Error al obtener las meditaciones:", error);
      res.status(500).send("Error al obtener las meditaciones.");
    }
  }

  static async formConsult(req, res) {
    const { name, subject, email, message } = req.body;
    try {
      await consultEmail(name, message, email, subject);
      res.status(200).json("Message send");
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async sessionFmcToken(req, res) {
    try {
      const { fcmToken } = req.params;
      const { email } = req.user;

      const saveToken = await UserServices.sessionFmcToken(email, fcmToken);

      res.send(req.user);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async activateTalisman(req, res) {
    const authToken = req.cookies.token;
    try {
      const activation = await UserServices.activateTalisman(
        req.body,
        authToken
      );

      res.status(200).json("Digital talisman activated");
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async checkTalismanAcounts(req, res) {
    const { talismanAcounts } = req.body;
    try {
      const acounts = await UserServices.checkTalismanAcounts(talismanAcounts);

      res.status(200).json(acounts);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  // controllers admin

  static async getUserInfo(req,res){

    try {
      const users = await UserServices.getUserInfo();

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }

  }
}

module.exports = UserControllers;
