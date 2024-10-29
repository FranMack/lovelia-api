const { filterNatalHoroscope } = require("../../helpers/filterNatalHoroscope");
const { natalHoroscopeFake1 } = require("./fake.info");

describe("Relevant info", () => {
  test("Should return only relevant info", () => {
    const objWithRelevantInfo = filterNatalHoroscope(natalHoroscopeFake1);

    expect(objWithRelevantInfo).toHaveProperty("planets");
    expect(objWithRelevantInfo).toHaveProperty("houseCups");
    expect(objWithRelevantInfo).toHaveProperty("aspects");
  });

  test("Should filter the planets informations, returning only the sun and the moon", () => {
    const objWithRelevantInfo = filterNatalHoroscope(natalHoroscopeFake1);

    const planets = objWithRelevantInfo.planets;
    //should be an emty array
    const diferentsPlanetsThanMoonAndSun = planets.filter((planet) => {
      if (planet.planetName !== "Sun" && planet.planetName !== "Moon") {
        return planet;
      }
    });

    planets.forEach((planet) => {
      expect(planet.planetName === "Sun" || planet.planetName === "Moon").toBe(
        true
      );
    });

    expect(diferentsPlanetsThanMoonAndSun.length).toBeFalsy();
  });

  test("Should filter the aspect informations, returning only the sun and the moon with conjuction,square and opposition", () => {
    const objWithRelevantInfo = filterNatalHoroscope(natalHoroscopeFake1);

    const planets = objWithRelevantInfo.aspects;
    const diferentsPlanetsThanMoonAndSun = planets.filter((planet) => {
      if (planet.aspectingPlanet !== "Sun" && planet.aspectingPlanet !== "Moon") {
        return planet;
      }
    });

    const aspects = objWithRelevantInfo.aspects;


    const diferentsAspects = aspects.filter((aspect) => {
      if (
        aspect.aspectType !== "Conjunction" &&
        aspect.aspectType !== "Square" &&
        aspect.aspectType !== "Opposition"
      ) {
        return aspect;
      }
    });

    planets.forEach((planet) => {
     expect(planet.aspectingPlanet === "Sun" || planet.aspectingPlanet === "Moon").toBe(true);
    });

    aspects.forEach((aspect) => {
      expect(
        aspect.aspectType === "Conjunction" ||
          aspect.aspectType === "Square" ||
          aspect.aspectType === "Opposition"
      ).toBe(true);
    });

    expect(diferentsAspects.length).toBeFalsy();
    expect(diferentsPlanetsThanMoonAndSun.length).toBeFalsy();
  });
});
