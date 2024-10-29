const mongoose = require("mongoose");
const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("POST, /forgetPassword", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should send status 200", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);
    user.confirm = true;
    await user.save();

    const response = await request(app)
      .post("/api/v1/user/forgetPassword")
      .send({ email: userData.email});

  
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("You will recive an email to reset your password");
   
  });

  test("should return error when request body is missing email", async () => {
    const response = await request(app)
      .post("/api/v1/user/forgetPassword")
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error[0].msg).toBe("email is required");
  });
  
  test("should return error when email format is invalid", async () => {
    const response = await request(app)
      .post("/api/v1/user/forgetPassword")
      .send({ email: "invalid_email"});
  
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error[0].msg).toBe("invalid email");
  });

 
});
