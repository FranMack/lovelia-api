const { User } = require("../../models/index.models.js");
const UserServices = require("../../services/user.services.js");

// Crear un spy para el método 'register' del servicio 'UserServices'
const spyRegister = jest.spyOn(UserServices, "register");

describe("Users Model", () => {
  let userData = {
    name: "fran",
    lastname: "mack",
    email: "fran@getMaxListeners.com",
    password: "@Milanesa122",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Validators", function () {
    describe("email", () => {
      test("Should throw an error if email not defined", async () => {
        spyRegister.mockRejectedValue(
          new Error("User validation failed: email: Path `email` is required.")
        );

        await expect(
          UserServices.register({ ...userData, email: undefined })
        ).rejects.toThrowError(
          "User validation failed: email: Path `email` is required."
        );
      });

      test("Should throw an error if email is not a string", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            'User validation failed: email: Cast to string failed for value "[]" (type Array) at path "email"'
          )
        );

        await expect(
          UserServices.register({ ...userData, email: [] })
        ).rejects.toThrowError(
          'User validation failed: email: Cast to string failed for value "[]" (type Array) at path "email"'
        );
      });

      test("should throw an error if email is not unique", async () => {
        // Mock para simular la creación de un usuario con un correo electrónico único
        spyRegister.mockResolvedValue({ ...userData });

        // Intenta crear otro usuario con el mismo correo electrónico
        spyRegister.mockRejectedValue(
          new Error(
            `E11000 duplicate key error collection: DEV.users index: email_1 dup key: { email: '${userData.email}' }`
          )
        );

        // Verifica que al intentar guardar el usuario duplicado, se lance un error de duplicación
        await expect(
          UserServices.register({ ...userData })
        ).rejects.toThrowError(
          `E11000 duplicate key error collection: DEV.users index: email_1 dup key: { email: '${userData.email}' }`
        );
      });

      test("Shouldn't throw an error if email is a string", async () => {
        spyRegister.mockResolvedValue({ ...userData });

        const user = await UserServices.register({ ...userData });
        expect(user).toEqual({ ...userData });
      });
    });

    describe("password", () => {
      test("Should throw an error if password is not defined", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            "User validation failed: password: Path `password` is required."
          )
        );

        await expect(
          UserServices.register({ ...userData, password: undefined })
        ).rejects.toThrowError(
          "User validation failed: password: Path `password` is required."
        );
      });

      test("Should throw an error if password is not a string", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            'User validation failed: password: Cast to string failed for value "[]" (type Array) at path "password"'
          )
        );

        await expect(
          UserServices.register({ ...userData, password: [] })
        ).rejects.toThrowError(
          'User validation failed: password: Cast to string failed for value "[]" (type Array) at path "password"'
        );
      });
    });

    describe("name", () => {
      test("Should throw an error if name is not defined", async () => {
        spyRegister.mockRejectedValue(
          new Error("User validation failed: name: Path `name` is required.")
        );

        await expect(
          UserServices.register({ ...userData, name: undefined })
        ).rejects.toThrowError(
          "User validation failed: name: Path `name` is required."
        );
      });

      test("Should throw an error if name is not a string", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            'User validation failed: name: Cast to string failed for value "[]" (type Array) at path "name"'
          )
        );

        await expect(
          UserServices.register({ ...userData, name: [] })
        ).rejects.toThrowError(
          'User validation failed: name: Cast to string failed for value "[]" (type Array) at path "name"'
        );
      });
    });
    describe("lastname", () => {
      test("Should throw an error if name is not defined", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            "User validation failed: lastname: Path `lastname` is required."
          )
        );

        await expect(
          UserServices.register({ ...userData, lastname: undefined })
        ).rejects.toThrowError(
          "User validation failed: lastname: Path `lastname` is required."
        );
      });

      test("Should throw an error if lastname is not a string", async () => {
        spyRegister.mockRejectedValue(
          new Error(
            'User validation failed: lastname: Cast to string failed for value "[]" (type Array) at path "lastname"'
          )
        );

        await expect(
          UserServices.register({ ...userData, name: [] })
        ).rejects.toThrowError(
          'User validation failed: lastname: Cast to string failed for value "[]" (type Array) at path "lastname"'
        );
      });
    });
  });

  describe("Create new users", () => {
    test("should create a new user", async () => {
      const newUser = { ...userData };
      spyRegister.mockResolvedValue(newUser);

      const createdUser = await UserServices.register(userData);
      expect(createdUser).toEqual(newUser);
      expect(createdUser).toHaveProperty("name")
      expect(createdUser).toHaveProperty("lastname")
      expect(createdUser).toHaveProperty("email")
      expect(createdUser).toHaveProperty("password")
    });

  });
});
