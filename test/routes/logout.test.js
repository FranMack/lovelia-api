const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("GET, /logout", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should clear the token cookie", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);
    user.confirm = true;
    await user.save();

    const loginResponse = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userData.email, password: userData.password });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    // Realizamos una solicitud para cerrar sesión
    const logoutResponse = await request(app)
      .get("/api/v1/user/logout")
      .set("Cookie", loginResponse.headers["set-cookie"]); // Establecer las cookies de la sesión de login

    expect(logoutResponse.statusCode).toBe(200);

    // Verificamos que la cookie se haya eliminado completamente
    const cookies = logoutResponse.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // Verificamos que la cookie tenga un valor vacío y una fecha de expiración en el pasado
    cookies.forEach((cookie) => {
      expect(cookie.startsWith("token=;")).toBe(true);
      expect(cookie.includes("Expires")).toBe(true);
    });
  });
  test("should send an status 401 if the token is not valid ", async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    const user = await User.create(userData);
    user.confirm = true;
    await user.save();

    const loginResponse = await request(app)
      .post("/api/v1/user/login")
      .send({ email: userData.email, password: userData.password });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    // Realizamos una solicitud para cerrar sesión
    const logoutResponse = await request(app).get("/api/v1/user/logout");

    

    expect(logoutResponse.statusCode).toBe(401);
    expect(logoutResponse.res.text).toBe('{"error":"Unauthorized"}');

  });
});
