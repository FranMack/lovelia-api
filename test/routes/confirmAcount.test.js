const mongoose = require("mongoose");
const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("GET, /confirmAcount", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should throw an error if the token is invalid", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);

    const response = await request(app)
      .get("/api/v1/user/confirmAcount")
      .query({ email: user.email, token: "wrong TOKEN" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid Token");
  });

  test("should throw an error if the email is invalid", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);

    const response = await request(app)
      .get("/api/v1/user/confirmAcount")
      .query({ email: "wrong@mail.com", token: user.token });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Wrong Credentials");
  });

  test("should throw an error if the acout has been already activated", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);
    user.token = "";
    user.confirm = true;
    await user.save();

    const response = await request(app)
      .get("/api/v1/user/confirmAcount")
      .query({ email: user.email, token: user.token });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("The account is already activated");
  });

  test("should confirm the acount if both email and token are valid", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);

    const response = await request(app)
      .get("/api/v1/user/confirmAcount")
      .query({ email: user.email, token: user.token });

      const userConfirmed=await User.findOne({email:userData.email})

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Your acount is now activated');
    expect(userConfirmed.confirm).toBe(true);
    expect(userConfirmed.token).toBe("");
  });
});
