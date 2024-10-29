const {
  calcularAnimal,
  chineeseAnimalElement,
  chineseNumber,
  chineseInformation,
} = require("../../helpers/filterChineseInfo");

describe("Chinese info", () => {
  describe("Animal", () => {
    let year = 1988;
    let data = { year: year };

    afterEach(async () => {
      year = year + 1;
      data = { year: year };
    });

    test("Should return Dragon", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Dragon");
    });
    test("Should return Snake", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Snake");
    });
    test("Should return Horse", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Horse");
    });
    test("Should return Goat", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Goat");
    });
    test("Should return Monkey", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Monkey");
    });
    test("Should return Rooster", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Rooster");
    });
    test("Should return Dog", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Dog");
    });
    test("Should return Pig", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Pig");
    });
    test("Should return Rat", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Rat");
    });
    test("Should return Ox", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Ox");
    });
    test("Should return Tiger", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Tiger");
    });
    test("Should return Rabbit", () => {
      const animal = calcularAnimal(data);

      expect(animal).toBe("Rabbit");
    });
  });

  describe("Elements", () => {
    let year = 1990;
    let data = { year: year };

    afterEach(async () => {
      year = year + 1;
      data = { year: year };
    });

    test("Should return Metal if the last number of the birth year is 0", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Metal");
    });
    test("Should return Metal if the last number of the birth year is 1", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Metal");
    });
    test("Should return Watter if the last number of the birth year is 2", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Watter");
    });
    test("Should return Watter if the last number of the birth year is 3", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Watter");
    });
    test("Should return Wood if the last number of the birth year is 4", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Wood");
    });
    test("Should return Wood if the last number of the birth year is 5", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Wood");
    });
    test("Should return Fire if the last number of the birth year is 6", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Fire");
    });
    test("Should return Fire if the last number of the birth year is 7", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Fire");
    });
    test("Should return Earth if the last number of the birth year is 8", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Earth");
    });
    test("Should return Earth if the last number of the birth year is 9", () => {
      const element = chineeseAnimalElement(data);
      expect(element.chineseElement).toBe("Earth");
    });
  });

  describe("Number", () => {
    let year = 1990;
    let month = 5
    let day = 4
    let data = { year: year,month,day };

    test("Should return the chinese number", () => {
      for (let i = 1; i < 10; i++) {
        expect(chineseNumber(data)).toBe(i);
        year = year + 1;
        data = { year: year,month,day };
      }
    });
  });

  describe("Resume information", () => {
    let year = 1990;
    let month = 5
    let day = 4
    let data = { year,month,day };

    test("Should return the animal,element and number of the chinese horoscope", () => {
      const chineseInfo = chineseInformation(data);

      expect(chineseInfo).toHaveProperty("animal");
      expect(chineseInfo).toHaveProperty("number");
      expect(chineseInfo).toHaveProperty("element");
    });
  });
});
