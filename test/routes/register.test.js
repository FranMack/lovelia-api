
const { User } = require("../../models/index.models");
const request = require("supertest");
const { app, server } = require("../../server.testing");

describe("POST, /register", () => {
  afterAll(async () => {
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("email", () => {
    test("should throw an error if email is missing", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "@Freedom99",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("email is required");
    });
    test("should throw an error when email format is wrong", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "@Freedom99",
        email: "franmack.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("invalid email");
    });
  });

  describe("name", () => {
    test("should throw an error if name is missing", async () => {
      const userData = {
        lastname: "mack",
        password: "@Freedom99",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("name is required");
    });

    test("should throw an error if the name does not contain exclusively letters and spaces", async () => {
      const userData = {
        name: "fran9",
        lastname: "mack",
        password: "@Freedom99",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "name can only contain letters and spaces"
      );
    });
  });

  describe("lastname", () => {
    test("should throw an error if lastname is missing", async () => {
      const userData = {
        name: "fran",
        password: "@Freedom99",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("lastname is required");
    });

    test("should throw an error if the lastname does not contain exclusively letters and spaces", async () => {
      const userData = {
        name: "fran",
        lastname: "mack4",
        password: "@Freedom99",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "lastname can only contain letters and spaces"
      );
    });
  });

  describe("password", () => {
    test("should throw an error if password is missing", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("password is required");
    });

    test("should throw an error if the password is less than 8 characters", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "1234567",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("password minimum 8 character");
    });

    test("should throw an error if the password doesn't have an especial caracter", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "1234567a",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "password must contain at least one special character"
      );
    });
    test("should throw an error if the password doesn't have at least one number", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "@abcdefg",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "password must contain at least one number"
      );
    });

    test("should throw an error if the password doesn't have at least one lowercase letter", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "@1234567A",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "password must contain at least one lowercase letter"
      );
    });

    test("should throw an error if the password doesn't have at least one capital letter", async () => {
      const userData = {
        name: "fran",
        lastname: "mack",
        password: "@1234567a",
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/user/register")
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "password must contain at least one capital letter"
      );
    });
  });

  test("should register a new user successfully", async () => {
    const userData = {
      name: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "StrongPassword123!",
    };

    const response = await request(app)
      .post("/api/v1/user/register")
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe('Your account has been created successfully, you will then receive an email that will allow you to confirm your account');
    
  });

  test("should reject registration with duplicate email", async () => {
    const existingUser = await User.create({
      name: "Existing",
      lastname: "User",
      email: "john@example.com",
      password: "StrongPassword123!",
    });
     existingUser.confirm=true;
     await existingUser.save();

    const userData = {
      name: "John",
      lastname: "Doe",
      email: "john@example.com",
      password: "StrongPassword123!",
    };

    const response = await request(app)
      .post("/api/v1/user/register")
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("User already exist");
  });
});
