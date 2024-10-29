const mongoose = require("mongoose");
const axios = require("axios");
const{envs}=require("../../config/env.config.js")
const { User, UserAstroData } = require("../../models/index.models.js");
const UserServices = require("../../services/user.services.js");
const register = async (data) => await UserServices.register(data);
const login = async (data) => await UserServices.login(data);
const confirmAcount = async (token, email) =>
  await UserServices.confirmAcount(token, email);
const forgetPassword = async (email) =>
  await UserServices.forgetPassword(email);
const changePassword = async (token, password) =>
  await UserServices.changePassword(token, password);
const natalHoroscope = async (data) => await UserServices.natalHoroscope(data);
const birthPlace = async (data) => await UserServices.birthPlace(data);
const getUserAstroInfo = async (email) =>
  await UserServices.getUserAstroInfo(email);



describe("Services", () => {
  const userData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await mongoose.connect(envs.MONGODB_URL_TESTING);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await User.deleteMany({});
    await UserAstroData.deleteMany({});
  });

  describe("User Registration Service", () => {
    test("should register a new user successfully", async () => {
      const newUser = await register(userData);

      expect(newUser.name).toBe(userData.name);
      expect(newUser.lastname).toBe(userData.lastname);
      expect(newUser.email).toBe(userData.email);
      expect(newUser.password).not.toBe(userData.password);
      expect(newUser.confirm).toBe(false);
      expect(newUser.salt).toBeTruthy();
      expect(newUser.token).toBeTruthy();
    });

    test("should throw an error if the user already exists", async () => {
      const existingUserData = userData;

      await register(existingUserData);

      try {
        await register(existingUserData);
      } catch (error) {
        expect(error.message).toBe("User already exist");
      }
    });
    test("should set password and salt correctly", async () => {
      const newUser = await User.create(userData);

      expect(newUser.password).not.toBe(userData.password); // Password should be hashed
      expect(newUser.salt).toBeTruthy(); // Salt should be set
    });
  });
  describe("User Login Service", () => {
    test("should throw an error if the user doesn´t exists", async () => {
      const data = { email: "wrongEmail@gmail.com", password: "wrong" };

      await expect(login(data)).rejects.toThrow("Wrong Credentials");
    });
    test("should throw an error if the password is not validated", async () => {
      const data = { email: userData.email, password: "wrong" };

      await expect(login(data)).rejects.toThrow("Wrong Credentials");
    });

    test("should throw an error if the acount is not confirmed", async () => {
      await User.create(userData);

      const data = { email: userData.email, password: userData.password };

      await expect(login(data)).rejects.toThrow(
        "Your account is not confirmed"
      );
    });
    test("should validate the correct password", async () => {
      const user = await User.create(userData);

      const isPasswordValid = await user.validPassword(userData.password);
      expect(isPasswordValid).toBe(true);
    });

    test("should validate an incorrect password", async () => {
      const user = await User.create(userData);

      const isPasswordValid = await user.validPassword("wrongpassword");
      expect(isPasswordValid).toBe(false);
    });
    test("should login if the credentials are correct and the acount is confirmed", async () => {
      const user = await User.create(userData);
      user.confirm = true;
      user.token = "";
      await user.save();

      const data = { email: userData.email, password: userData.password };

      const userLogged = await login(data);

      expect(userLogged.name).toBe(userData.name);
      expect(userLogged.lastname).toBe(userData.lastname);
      expect(userLogged.email).toBe(userData.email);
      expect(userLogged.password).not.toBe(userData.password);
      expect(userLogged.token).toBe("");
    });
  });

  describe("User Confirm Acount", () => {
    test("should throw an error if the user doesn´t exists", async () => {
      const user = await User.create(userData);
      user.token = "randon-token";
      await user.save();

      const data = { email: "wrongEmail@gmail.com", token: user.token };

      await expect(confirmAcount(data.token, data.email)).rejects.toThrow(
        "Wrong Credentials"
      );
    });

    test("should throw an error if the acount was already activated", async () => {
      const user = await User.create(userData);
      user.token = "randon-token";
      user.confirm = true;
      await user.save();

      const data = { email: userData.email, token: user.token };

      await expect(confirmAcount(data.token, data.email)).rejects.toThrow(
        "The account is already activated"
      );
    });
    test("should throw an error if the token is invalid", async () => {
      const user = await User.create(userData);
      user.token = "randon-token";
      await user.save();

      const data = {
        email: userData.email,
        token: "wrong-randon-token",
      };

      await expect(confirmAcount(data.token, data.email)).rejects.toThrow(
        "Invalid Token"
      );
    });
    test("should confirm the acount", async () => {
      const user = await User.create(userData);
      user.token = "randon-token";
      await user.save();

      const data = { email: userData.email, token: user.token };

      const userConfirmed = await confirmAcount(data.token, data.email);
      expect(userConfirmed.confirm).toBe(true);
    });
  });

  describe("User Forgot Password", () => {
    test("should throw an error if the user doesn´t exists", async () => {
      const user = await User.create(userData);
      (user.token = ""), (user.confirm = true);
      await user.save();

      await expect(forgetPassword("wrongEmail@gmail.com")).rejects.toThrow(
        "Wrong Credentials"
      );
    });

    test("should set a token", async () => {
      const user = await User.create(userData);
      user.token = "";
      user.confirm = true;
      await user.save();

      const userForgotPassword = await forgetPassword(userData.email);

      expect(userForgotPassword.token).toBeTruthy();
      expect(typeof userForgotPassword.token).toBe("string");
    });
  });
  describe("User Change Password", () => {
    test("should throw an error if the token is invalid", async () => {
      const newPassword = "@NewPassword55";
      const wrongToken = "WRONG_TOKEN";
      const user = await User.create(userData);
      user.token = "forgetPasswordTOKEN";
      user.confirm = true;
      await user.save();

      await expect(changePassword(wrongToken, newPassword)).rejects.toThrow(
        "Invalid Token"
      );
    });
    test("should throw an error if the user acount is not confirm", async () => {
      const newPassword = "@NewPassword55";
      const user = await User.create(userData);
      user.token = "forgetPasswordTOKEN";
      await user.save();

      await expect(changePassword(user.token, newPassword)).rejects.toThrow(
        "Your account is not confirmed"
      );
    });
    test("should reset your password and allow you to singin with the newone", async () => {
      const newPassword = "@NewPassword55";
      const user = await User.create(userData);
      user.token = "forgetPasswordTOKEN";
      user.confirm = true;
      await user.save();

      const userNewPassword = await changePassword(user.token, newPassword);

      const data = { email: userNewPassword.email, password: newPassword };

      const userLogged = await login(data);

      expect(userLogged.name).toBe(userData.name);
      expect(userLogged.lastname).toBe(userData.lastname);
      expect(userLogged.email).toBe(userData.email);
      expect(userLogged.password).not.toBe(userData.password);
      expect(userLogged.token).toBe("");
    });
  });
  describe("User Natal Horoscope", () => {
    test("should throw an error if the user doesn´t exists", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true },
        { new: true }
      );

      const data = {
        email: "wrongEmail@mail.com",
      };

      await expect(natalHoroscope(data)).rejects.toThrow("Wrong Credentials");
    });

    test("should throw an error if the subscription has not been paid", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true },
        { new: true }
      );

      const data = {
        email: user.email,
      };

      await expect(natalHoroscope(data)).rejects.toThrow(
        "The subscription has not been paid"
      );
    });

    test("should throw an error if astrological information has been already save in the db", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const userAstroData = await UserAstroData.create({ email: user.email });
      const data = {
        email: user.email,
      };

      await expect(natalHoroscope(data)).rejects.toThrow(
        "Your astrological information has been already save in the db, please use /astrological-info end point to get it"
      );
    });

    // Prueba para el caso en que la llamada a la API externa falla
    test("should throw an error if external API call fails", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = {
        email: user.email,
        // Proporciona datos válidos para la solicitud de información astrológica
      };

      // Simula un error al realizar la llamada a la API externa
      jest
        .spyOn(axios, "post")
        .mockRejectedValue(new Error("Failed to fetch data"));

      // Se espera que la función lance una excepción con el mensaje adecuado
      await expect(natalHoroscope(data)).rejects.toThrow(
        "Failed to fetch data"
      );
    });

    // Prueba para el caso en que la creación de UserAstroData falla en la base de datos
    test("should throw an error if UserAstroData creation fails", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = {
        email: user.email,
        day: 30,
        month: 11,
        year: 1972,
        hour: 19,
        min: 19,
        lat: -34.6036844,
        lon: -58.3815591,
        tzone: -3,
      };

      // Simula un error al crear UserAstroData en la base de datos
      jest.spyOn(UserAstroData, "create").mockImplementationOnce(() => {
        throw new Error("Failed to create UserAstroData");
      });

      // Se espera que la función lance una excepción con el mensaje adecuado
      await expect(natalHoroscope(data)).rejects.toThrow(
        "Failed to create UserAstroData"
      );
    });

    test("should save astrological information successfully", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = {
        email: user.email,
        day: 30,
        month: 11,
        year: 1972,
        hour: 19,
        min: 19,
        lat: -34.6036844,
        lon: -58.3815591,
        tzone: -3,
      };
      // Se espera que la función no lance ninguna excepción
      await expect(natalHoroscope(data)).resolves.not.toThrow();
      const userAstroData = await UserAstroData.findOne({ email: user.email });
      expect(userAstroData).toBeTruthy();
      expect(userAstroData).toHaveProperty("email");
      expect(userAstroData).toHaveProperty("planets");
      expect(userAstroData).toHaveProperty("houseCups");
      expect(userAstroData).toHaveProperty("aspects");
      expect(userAstroData).toHaveProperty("chineseInfo");
      expect(userAstroData).toHaveProperty("kinMaya");
    });

    test("should return an object with this propertys: ", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = {
        email: user.email,
        day: 30,
        month: 11,
        year: 1972,
        hour: 19,
        min: 19,
        lat: -34.6036844,
        lon: -58.3815591,
        tzone: -3,
      };

      const natalHoroscopeObj = await natalHoroscope(data);

      expect(natalHoroscopeObj).toHaveProperty("userHoroscopeInfo");
      expect(natalHoroscopeObj).toHaveProperty("chineseInfo");
      expect(natalHoroscopeObj).toHaveProperty("kinMayaInfo");
    });
  });
  describe("User Birth Place", () => {
    test("should throw an error if birth place is not provided", async () => {
      const data = { email: userData.email };

      await expect(birthPlace(data)).rejects.toThrow(
        "The birth place is required"
      );
    });
    test("Should throw an error if the subscription has not been paid", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true },
        { new: true }
      );
      const data = { email: user.email, birthPlace: "Bahia Blanca, Argentina" };

      await expect(birthPlace(data)).rejects.toThrow(
        "The subscription has not been paid"
      );
    });
    test("should throw an error if astrological information is already saved in the db", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = { email: user.email, birthPlace: "Bahia Blanca, Argentina" };
      const userAstroData = await UserAstroData.create({ email: user.email });

      await expect(birthPlace(data)).rejects.toThrow(
        "You have already used succesfully this end point, your astrological information has been already save in the db"
      );
    });
    // Prueba para el caso en que la llamada a la API externa falla
    test("should throw an error if external API call fails", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = { email: user.email, birthPlace: "xxxxxxxxxxx" };

      // Simula un error al realizar la llamada a la API externa
      jest
        .spyOn(axios, "get")
        .mockRejectedValue(new Error("Failed to fetch data"));

      // Se espera que la función lance una excepción con el mensaje adecuado
      await expect(birthPlace(data)).rejects.toThrow("Failed to fetch data");
    });
    // Prueba para el caso en que se proporciona un lugar de nacimiento válido y se obtienen las coordenadas y la zona horaria correctamente
    test("should return coordinates and time zone for valid birth place", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = { email: user.email, birthPlace: "Bahia Blanca, Argentina" };
      const result = await birthPlace(data);
      expect(result).toHaveProperty("places");
      expect(result).toHaveProperty("timeZone");
      // Realizar más afirmaciones para asegurarte de que se devuelven las coordenadas y la zona horaria correctamente
      expect(result.places).toBeDefined();
      expect(result.places.length).toBeGreaterThan(0);
      expect(result.timeZone).toBeDefined();
    });
  });
  describe("Get user astrological info", () => {
    test("Should thorw an error ", async () => {
      const email = "wrongEmal@test.com";

      await expect(getUserAstroInfo(email)).rejects.toThrow(
        "User info can not be found"
      );
    });
    test("should return user info if found", async () => {
      const token = "";
      const user = await User.create(userData);
      const userConfirm = await User.findOneAndUpdate(
        { email: userData.email },
        { token, confirm: true, payment: true },
        { new: true }
      );
      const data = {
        email: user.email,
        day: 30,
        month: 11,
        year: 1972,
        hour: 19,
        min: 19,
        lat: -34.6036844,
        lon: -58.3815591,
        tzone: -3,
      };

      const natalHoroscopeObj = await natalHoroscope(data);
      const userAstroData = await getUserAstroInfo(user.email);

      expect(userAstroData).toBeTruthy();
      expect(userAstroData).toHaveProperty("planets");
      expect(userAstroData).toHaveProperty("houseCups");
      expect(userAstroData).toHaveProperty("aspects");
      expect(userAstroData).toHaveProperty("chineseInfo");
      expect(userAstroData).toHaveProperty("kinMaya");
    });
  });
});
