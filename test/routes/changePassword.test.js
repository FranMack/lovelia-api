const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("POST, /changePassword", () => {
  let user;
  beforeAll(async () => {
    const userData = {
      email: "example@hotmail.com",
      password: "@Freedom99",
      name: "Fran",
      lastname: "Mack",
    };

    user = await User.create(userData);
    (user.token = "someTOKEN"), (user.confirm = true);
    user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    server.close();
  });

  test("should return error when then token is invalid", async () => {
    const response = await request(app)
      .patch("/api/v1/user/changePassword")
      .send({ token: "wrongTOKEN", password: "passwordWrong@1" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Invalid Token");
  });

  test("should change the user password", async () => {
    const response = await request(app)
      .patch("/api/v1/user/changePassword")
      .send({ token: user.token, password: "@Nuevopassword15" });

    expect(response.statusCode).toBe(201);
    expect(response.body).not.toHaveProperty("error");
    expect(response.body.message).toBe("Your password has benn reset");
  });

  describe("New password", () => {
    test("should throw an error if the password is less than 8 characters", async () => {
      const response = await request(app)
        .patch("/api/v1/user/changePassword")
        .send({ token: user.token, password: "pas" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].msg).toBe("password minimum 8 character");
    });

    test("should throw an error if the password doesn't have an especial caracter", async () => {
      const response = await request(app)
        .patch("/api/v1/user/changePassword")
        .send({ token: user.token, password: "passwo134" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].msg).toBe(
        "password must contain at least one special character"
      );
    });
    test("should throw an error if the password doesn't have at least one number", async () => {
      const response = await request(app)
        .patch("/api/v1/user/changePassword")
        .send({ token: user.token, password: "passwordWrong@" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].msg).toBe(
        "password must contain at least one number"
      );
    });

    test("should throw an error if the password doesn't have at least one lowercase letter", async () => {
      const response = await request(app)
        .patch("/api/v1/user/changePassword")
        .send({ token: user.token, password: "1111111111@A" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].msg).toBe(
        "password must contain at least one lowercase letter"
      );
    });

    test("should throw an error if the password doesn't have at least one capital letter", async () => {
      const response = await request(app)
        .patch("/api/v1/user/changePassword")
        .send({ token: "wrongTOKEN", password: "111111111a@" });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].msg).toBe(
        "password must contain at least one capital letter"
      );
    });
  });
});
