const { envs } = require("../config/env.config");
const { User, UserAstroData } = require("../models/index.models");
const {
  generateTokenConfirmAcount,
  validateTokenConfirmAcoubt,
} = require("../config/token");
const axios = require("axios");
const { filterNatalHoroscope } = require("../helpers/filterNatalHoroscope");
const { chineseInformation } = require("../helpers/filterChineseInfo");
const { calcKinMaya } = require("../helpers/filterKinMaya");
const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");

class UserServices {
  static async register(data) {
    try {
      const existingUser = await User.findOne({ email: data.email });

      if (existingUser) {
        if (
          existingUser.email === data.email &&
          existingUser.confirm === true
        ) {
          throw new Error("Usuario ya registrado");
        }

        if (
          existingUser.email === data.email &&
          existingUser.confirm === false
        ) {
          return existingUser;
        }
      }

      const newUser = await User.create(data);
      const payload = {
        email: newUser.email,
        id: newUser._id,
      };

      const token = generateTokenConfirmAcount(payload);
      newUser.token = token;
      await newUser.save();

      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async login(data) {
    try {
      const user = await User.findOne({ email: data.email });

      if (!user) {
        throw new Error("Credenciales erroneas");
      }

      let passwordOK = await user.validPassword(data.password);

      if (!passwordOK) {
        throw new Error("Credenciales erroneas");
      }
      if (!user.confirm) {
        throw new Error("Tu cuenta no ha sido activada");
      }

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async confirmAcount(token) {
    try {
      const payload = validateTokenConfirmAcoubt(token);
      if (!payload) {
        throw new Error("Token invalido");
      }

      const user = await User.findOne({ email: payload.email });

      if (!user) {
        throw new Error("Credenciales erroneas");
      }

      if (user.confirm) {
        throw new Error("La cuenta ya se encuentra activada");
      }

      user.confirm = true;

      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  static async forgetPassword(email) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Wrong Credentials");
      }
      if (!user.confirm) {
        throw new Error("Your account is not confirmed");
      }
      const payload = {
        email: user.email,
        id: user._id,
      };

      const token = generateTokenConfirmAcount(payload);
      user.token = token;
      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async changePassword(token, password) {
    try {
      const payload = validateTokenConfirmAcoubt(token);

      if (!payload) {
        throw new Error("Invalid Token");
      }

      const user = await User.findOne({ email: payload.email });
      if (!user) {
        throw new Error("Wrong Credentials");
      }
      if (!user.confirm) {
        throw new Error("Your account is not confirmed");
      }
      user.password = password;

      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async natalHoroscope(data) {
    try {
      // Definir las credenciales de autenticación
      const username = envs.ASTRO_API_USER;
      const password = envs.ASTRO_API_PASSWORD;
      const user = await User.findOne({ email: data.email });

      if (!user) {
        throw new Error("Wrong Credentials");
      }

      if (!user.payment) {
        throw new Error("The subscription has not been paid");
      }

      let userAstroData = await UserAstroData.findOne({ email: data.email });
      if (userAstroData) {
        throw new Error(
          "Your astrological information has been already save in the db, please use /astrological-info end point to get it"
        );
      }

      // Crear una cadena Base64 que contiene las credenciales codificadas
      const base64Credentials = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );

      const userHoroscope = await axios.post(
        `${envs.ASTRO_API_URL}/western_horoscope`,
        data,
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        }
      );

      const userHoroscopeInfo = filterNatalHoroscope(userHoroscope.data);

      const kinMayaInfo = calcKinMaya(data.year, data.month, data.day);

      const chineseInfo = { ...chineseInformation(data) };

      userAstroData = await UserAstroData.create({
        email: data.email,
        chineseInfo,
        kinMaya: kinMayaInfo,
        ...userHoroscopeInfo,
      });

      return { userHoroscopeInfo, chineseInfo, kinMayaInfo };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async birthPlace(data) {
    try {
      if (!data.birthPlace) {
        throw new Error("The birth place is required");
      }
      const user = await User.findOne({ email: data.email, payment: true });

      if (!user) {
        throw new Error("The subscription has not been paid");
      }
      let userAstroData = await UserAstroData.findOne({ email: data.email });
      if (userAstroData) {
        throw new Error(
          "You have already used succesfully this end point, your astrological information has been already save in the db"
        );
      }

      const placesInfo = await axios.get(`${envs.GOOGLE_GEOCODING_URL}`, {
        params: {
          address: data.birthPlace,
          key: envs.GOOGLE_GEOCODING_KEY,
        },
      });

      const { lat, lng } = placesInfo.data.results[0].geometry.location;

      const locationCoordenates = `${lat},${lng}`;

      const time = new Date().getTime() / 1000;

      const timeZoneInfo = await axios.get(`${envs.GOOGLE_TIMEZONE}`, {
        params: {
          location: locationCoordenates,
          timestamp: time,
          key: envs.GOOGLE_GEOCODING_KEY,
        },
      });

      const places = placesInfo.data.results;
      const timeZone = timeZoneInfo.data.rawOffset / 3600;

      return { places, timeZone };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getUserAstroInfo(email) {
    const storage = new Storage({
      projectId: "leafy-bond-427721-f6", // Reemplaza con tu Project ID
      keyFilename: path.join(__dirname, "../googleCloudCredentials.json"), // Ruta al archivo de credenciales
    });

    const bucketName = "threejs-api"; // Reemplaza con el nombre de tu bucket

    try {
      const [buckets] = await storage.getBuckets();

      const [files] = await storage.bucket(bucketName).getFiles();
      console.log("Archivos en el bucket:");
      files.forEach((file) => {
        console.log(file.name);
      });

      const userInfo = await UserAstroData.findOne({ email });
      if (!userInfo) {
        throw new Error("User info can not be found");
      }

      //return userInfo

      const { houseCups, chineseInfo, planets, aspects, soundPath } = userInfo;

      const sun = planets[0].signName.toLocaleLowerCase();
      const moon = planets[1].signName.toLocaleLowerCase();
      const sunHouse = planets[0].housePosition;
      const moonHouse = planets[1].housePosition;
      const moonPlanets = aspects
        .filter((aspect) => {
          return aspect.aspectingPlanet === "Moon";
        })
        .map((aspect) => {
          return aspect.aspectedPlanet.toLocaleLowerCase();
        });
      const sunPlanets = aspects
        .filter((aspect) => {
          return aspect.aspectingPlanet === "Sun";
        })
        .map((aspect) => {
          return aspect.aspectedPlanet.toLocaleLowerCase();
        });
      const linker =
        sun === "aries" || sun === "leo" || sun === "sagittarius"
          ? "linker1"
          : sun === "gemini" || sun === "libra" || sun === "aquarius"
          ? "linker2"
          : sun === "cancer" || sun === "scorpio" || sun === "pisces"
          ? "linker3"
          : "linker4";
      const sky =
        sun === "aries" || sun === "leo" || sun === "sagittarius"
          ? "skyPlane1"
          : sun === "gemini" || sun === "libra" || sun === "aquarius"
          ? "skyPlane2"
          : sun === "cancer" || sun === "scorpio" || sun === "pisces"
          ? "skyPlane3"
          : "skyPlane4";
      const rocks =
        sun === "aries" || sun === "leo" || sun === "sagittarius"
          ? "rocks1"
          : sun === "gemini" || sun === "libra" || sun === "aquarius"
          ? "rocks2"
          : sun === "cancer" || sun === "scorpio" || sun === "pisces"
          ? "rocks3"
          : "rocks4";
      const plants =
        sun === "aries" || sun === "leo" || sun === "sagittarius"
          ? "plants1"
          : sun === "gemini" || sun === "libra" || sun === "aquarius"
          ? "plants2"
          : sun === "cancer" || sun === "scorpio" || sun === "pisces"
          ? "plants3"
          : "plants4";
      const waterEnvironmentMap =
        sun === "taurus" || sun === "virgo" || sun === "capricorn"
          ? "sky3"
          : "sky2";
      const constellation = houseCups.signName.toLocaleLowerCase();
      const horoscope = chineseInfo.animal.toLocaleLowerCase();
      const info = {
        sun: sun,
        moon: moon,
        moonPlanets: moonPlanets,
        sunPlanets: sunPlanets,
        linker: linker,
        sunHouse: sunHouse,
        moonHouse: moonHouse,
        rocks: rocks,
        plants: plants,
        numerology: chineseInfo.number,
        sky: sky,
        waterEnvironmentMap: waterEnvironmentMap,
        horoscope: horoscope,
        constellation: constellation,
      };

      // Convertir el objeto a formato JSON
      const jsonData = JSON.stringify(info); // null y 2 son para pretty printing

      // Nombre del archivo JSON
      const fileName = `public/api/${email}.json`;

      /* // Directorio donde deseamos guardar el archivo
      const directory = path.resolve(__dirname, "../public/api");

      // Nombre del archivo JSON
      const fileName = `${email}.json`;

      // Ruta completa del archivo
      const filePath = `${directory}/${fileName}`;

      // Escribir el archivo JSON en disco
      fs.writeFile(filePath, jsonData, (err) => {
        if (err) throw err;
        console.log(
          `El archivo ${fileName} ha sido guardado correctamente en ${directory}`
        );
      });

      return filePath;*/

      // Crear un buffer a partir del JSON string
      const buffer = Buffer.from(jsonData);

      // Subir el archivo al bucket
      const file = storage.bucket(bucketName).file(fileName);
      await file.save(buffer);

      console.log(
        `El archivo ${fileName} ha sido guardado correctamente en el bucket ${bucketName}`
      );

      return { soundPath };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async cleanUserJSON(email) {
    const storage = new Storage({
      projectId: "leafy-bond-427721-f6", // Reemplaza con tu Project ID
      keyFilename: path.join(__dirname, "../googleCloudCredentials.json"), // Ruta al archivo de credenciales
    });

    const bucketName = "threejs-api"; // Reemplaza con el nombre de tu bucket

    try {
      // Nombre del archivo JSON
      const fileName = `public/api/${email}.json`;

      // Obtén una referencia al archivo
      const file = storage.bucket(bucketName).file(fileName);

      // Elimina el archivo
      await file.delete();
      console.log(`El archivo ${fileName} ha sido eliminado correctamente.`);

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async addIntention(intention, email) {
    try {
      const userInfo = await UserAstroData.findOne({ email });
      if (!userInfo) {
        throw new Error("User info can not be found");
      }
      userInfo.intention = intention;
      await userInfo.save();

      return userInfo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async userIntention(email) {
    try {
      const userInfo = await UserAstroData.findOne({ email });
      if (!userInfo) {
        throw new Error("User info can not be found");
      }

      if (!userInfo.intention) {
        return;
      }
      return userInfo.intention;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async sessionFmcToken(email, fcmToken) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Credenciales erroneas");
      }

      if (user.fcmToken !== fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
      }

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UserServices;
