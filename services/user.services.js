const { envs } = require("../config/env.config");
const {
  kingMayaInfo,
  chineseHoroscopeInfo,
  tonesInfo,
  sunHouseInfo,
  moonHouseInfo,
  sunInfo,
  moonInfo,
  planetsAndAspectsInfo,
  ascendantInfo,
  numberInfo,
} = require("../utils");
const {
  User,
  UserAstroData,
  TalismanDigital,
} = require("../models/index.models");
const {
  generateTokenConfirmAcount,
  validateTokenConfirmAcoubt,
} = require("../config/token");
const axios = require("axios");
const { filterNatalHoroscope } = require("../helpers/filterNatalHoroscope");
const { chineseInformation } = require("../helpers/filterChineseInfo");
const { calcKinMaya } = require("../helpers/filterKinMaya");
const { transformSolarSail } = require("../helpers/filterKinMaya");
const path = require("path");
const { timeConverter } = require("../helpers/getDate");
const { Storage } = require("@google-cloud/storage");

const {googleCloudCredentials}=require("../googleCloudCredentials")
class UserServices {
  static async register(data) {
    try {
      const [existingUser, hasTalismanDigital] = await Promise.all([
        User.findOne({ email: data.email }),
        TalismanDigital.findOne({ email: data.email }),
      ]);

      if (existingUser) {
        // Si el usuario ya está registrado y confirmado
        if (existingUser.confirm) {
          throw new Error("Usuario ya registrado");
        }
        // Si el usuario está registrado pero no confirmado
        return existingUser;
      }

      // Si el usuario no existe, lo creamos
      const newUser = await User.create(data);
      newUser.token = generateTokenConfirmAcount({
        email: newUser.email,
        id: newUser.id,
      });

      // Si tiene un TalismanDigital, se marca como pagado

      if (hasTalismanDigital) {
        newUser.payment = true;
        newUser.confirm = true;
      }

      await newUser.save();

      return newUser;
    } catch (error) {
      console.error("Error en el registro:", error.message);
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

      const talismanDigital = await TalismanDigital.findOne({
        email: data.email,
      });

      const talismanActivated =
        talismanDigital && talismanDigital.activated ? true : false;

      return { ...user._doc, talismanActivated };
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
        id: user.id,
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

      //evito que se guarde info en la db si la respuesta de ASTRO API no fue exitosa
      if (
        userHoroscope.status !== 200 ||
        userHoroscope.statusText.toLocaleLowerCase() !== "ok"
      ) {
        return {
          success: false,
          message: "ASTRO API returned an unsuccessful status",
          details: userHoroscope.data,
        };
      }

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
      return {
        success: false,
        message: "ASTRO API returned an unsuccessful status",
      };
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
      projectId: googleCloudCredentials.project_id,
      credentials: googleCloudCredentials, // Use the dynamic object
    });

    const bucketName = "threejs-api"; // Reemplaza con el nombre de tu bucket

    try {
      const [buckets] = await storage.getBuckets();

      const [files] = await storage.bucket(bucketName).getFiles();
      /* console.log("Archivos en el bucket:");
      files.forEach((file) => {
        console.log(file.name);
      });*/

      const userInfo = await UserAstroData.findOne({ email });
      if (!userInfo) {
        throw new Error("User info can not be found");
      }

      //return userInfo

      const {
        houseCups,
        chineseInfo,
        planets,
        aspects,
        soundPath,
        kinMaya,
        intention,
      } = userInfo;
      const { solarSail, cosmicTone } = kinMaya;
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

      const sky = "skyPlane2";
      const rocks = "rocks2";
      const plants =
        sun === "aries" || sun === "leo" || sun === "sagittarius"
          ? "plants1"
          : sun === "gemini" || sun === "libra" || sun === "aquarius"
          ? "plants2"
          : sun === "cancer" || sun === "scorpio" || sun === "pisces"
          ? "plants3"
          : "plants4";
      const waterEnvironmentMap = "sky3";
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
        numerology: chineseInfo.number,
        sky: sky,
        waterEnvironmentMap: waterEnvironmentMap,
        horoscope: horoscope,
        constellation: constellation,
        kinMaya: transformSolarSail(solarSail),
        tones: cosmicTone,
        phrase: intention ? intention : "Activa tu talísman",
        reloadSceneryDelay: 60,
      };

      // Convertir el objeto a formato JSON
      const jsonData = JSON.stringify(info); // null y 2 son para pretty printing

      // Nombre del archivo JSON
      const fileName = `public/api/${email}.json`;

      // Crear un buffer a partir del JSON string
      const buffer = Buffer.from(jsonData);

      // Subir el archivo al bucket
      const file = storage.bucket(bucketName).file(fileName);
      await file.save(buffer);

      console.log(
        `El archivo ${fileName} ha sido guardado correctamente en el bucket ${bucketName}`
      );

      //INFO PARA ADN ENERGETICO
      const numberUserInfo = numberInfo[chineseInfo.number];
      const kingMayaUserInfo = kingMayaInfo[solarSail];
      const tonesUserInfo = tonesInfo[cosmicTone];
      const chineseUserInfo = {
        commonInfo: chineseHoroscopeInfo[chineseInfo.animal].commonInfo,
        particularInfo:
          chineseHoroscopeInfo[chineseInfo.animal][chineseInfo.element],
      };

      const ascendantUserInfo = ascendantInfo[houseCups.signName];
      const sunHouseUserInfo = sunHouseInfo[sunHouse];
      const moonHouseUserInfo = moonHouseInfo[moonHouse];
      const sunUserInfo = sunInfo[planets[0].signName];
      const moonUserInfo = moonInfo[planets[1].signName];
      const aspectsUserInfo = aspects.map((aspect) => {
        return {
          planet: planetsAndAspectsInfo.planets[aspect.aspectedPlanet],
          aspect:
            planetsAndAspectsInfo.aspects[aspect.aspectType].title.split(
              "-"
            )[0],
          aspectingPlanet:
            planetsAndAspectsInfo.aspectingPlanet[aspect.aspectingPlanet],
        };
      });

      const filterAspects = () => {
        const aspectsDB = aspects.map((aspect) => {
          return aspect.aspectType;
        });
        const borroDuplicados = Array.from(new Set(aspectsDB));
        const finalArray = borroDuplicados.map((aspect) => {
          return planetsAndAspectsInfo.aspects[aspect];
        });

        return finalArray;
      };

      const aspectsAndPlanetsUserInfo = {
        generalInfo: planetsAndAspectsInfo.generalInfo,
        userAspects: aspectsUserInfo,
        filterAspects: filterAspects(),
      };

      //estas propiedads debería dejar de pasarlas para la creación del json del usuario en google cloud cuando actualicen el talismán

      return {
        soundPath,
        numerologySymbol: info.numerology,
        chinseseSymbol: horoscope,
        solarSailSymbol: solarSail,
        toneSymbol: info.tones,
        constellation,
        phrase: info.phrase,
        kingMayaUserInfo,
        tonesUserInfo,
        chineseUserInfo,
        ascendantUserInfo,
        sunHouseUserInfo,
        moonHouseUserInfo,
        sunUserInfo,
        moonUserInfo,
        aspectsAndPlanetsUserInfo:
          aspectsUserInfo.length > 0 ? aspectsAndPlanetsUserInfo : null,
        numberUserInfo,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async cleanUserJSON(email) {
   

    const storage = new Storage({
      projectId: googleCloudCredentials.project_id,
      credentials: googleCloudCredentials, // Use the dynamic object
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

  static async activateTalisman(userInfo, authToken) {
    const { location, day, month, year, hour, min, meridiam, email } = userInfo;

    try {
      //obtengo coordenadas y zona horaria de API google
      
      const { data } = await axios.post(
        `${envs.DOMAIN_URL}/api/v1/user/birthPlace`,
        { birthPlace: location, email: email },
        {
          withCredentials: true,
          headers: {
            Cookie: `token=${authToken}`,
          },
        }
      );
      const { coordinates, timeZone } = data;

      //servicio que se comunica con ASTRO API y procesa la respuesta con la info atrológica necesaria del usuario
      const astroApiEndpoint = await this.natalHoroscope({
        email: email,
        lat: coordinates.lat,
        lon: coordinates.lng,
        tzone: timeZone,
        year,
        month,
        day,
        hour: timeConverter(hour, meridiam),
        min,
      });

      if (astroApiEndpoint.success === false) {
        throw new Error("Something was wrong with astro api");
      }

      //finalmente cambia el estado del talismán a activado
      await TalismanDigital.findOneAndUpdate(
        { email },
        { activated: true },
        { new: true }
      );

      return;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async checkTalismanAcounts(talismanAcounts) {
    try {
      if (talismanAcounts.length < 1) {
        throw new Error("No acounts cehcked");
      }

      const promises = talismanAcounts.map((email) => {
        return TalismanDigital.findOne({ email });
      });
      const acounts = await Promise.all(promises);

      const acountsProcessed = acounts.map((items) => {
        if (items) {
          return items.email;
        } else {
          return null;
        }
      });

      return acountsProcessed;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // services admin

  static async getUserInfo() {
    try {
      const users = await User.find({ role: { $ne: "admin" } }).select(
        "id name lastname email confirm payment fcmToken"
      );

      if (!users) {
        throw new Errror("Usuarios no encontrados");
      }
      return users;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = UserServices;
