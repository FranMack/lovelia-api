const mongoose = require("mongoose");
const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("POST, /login", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should login when credentials are valid", async () => {
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
      .post("/api/v1/user/login")
      .send({ email: userData.email, password: userData.password });

    //es un array con todas las cookies
    const cookies = response.headers["set-cookie"];

    let tokenCookieFound = false;
    cookies.forEach((cookie) => {
      if (cookie.startsWith("token=")) {
        tokenCookieFound = true;
      }
    });

    // Asegúrate de que se haya encontrado la cookie con el token
    
    expect(tokenCookieFound).toBe(true);
    expect(cookies).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("payload");
    expect(response.body).toHaveProperty("token");
  });

  test("It should throw an error when credentials are invalid ", async () => {
    const userData = {
      email: "franmack99@hotmail.com",
      password: "Pas123456@",
    };

    const response = await request(app)
      .post("/api/v1/user/login ")
      .send(userData);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Wrong Credentials");
  });

  test("should return an error message when email is missing", async () => {
    const userData = {
      password: "Pas123456@",
    };

    const response = await request(app)
      .post("/api/v1/user/login")
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error[0].msg).toBe("email is required");
  });
  test("should throw an error when email format is wrong", async () => {
    const userData = {
      email: "franmack99@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);
    user.confirm = true;
    await user.save();

    const response = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "franmack99hotmail.com", password: userData.password });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error[0].msg).toBe("invalid email");
  });

  test("It should give an error when the acount is not confirmed  ", async () => {
    const userData = {
      email: "franmack99@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);

    const response = await request(app)
      .post("/api/v1/user/login ")
      .send({ email: userData.email, password: userData.password });
    console.log(userData);

    expect(response.statusCode).toBe(403);
  });
});
