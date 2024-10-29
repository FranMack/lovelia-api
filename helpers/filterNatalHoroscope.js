const { soundPathFile } = require("./sound");


function filterNatalHoroscope(obj) {
  const aspectingPlanets = [0, 1];
  const aspectedPlanets = [2,3,4,5,6,7,8,9];

  const aspectsNames = ["Conjunction", "Square", "Opposition"];

  const elements = [
    { Fire: ["Aries", "Leo", "Sagittarius"] },
    { Watter: ["Scorpio", "Cancer", "Pisces"] },
    { Air: ["Gemini", "Libra", "Aquarius"] },
    { Earth: ["Taurus", "Virgo", "Capricorn"] },
  ];

  const planets = obj.planets.filter((planet) => {
    if (planet.name === "Sun" || planet.name === "Moon") {
      return planet;
    }
  });

  const planetsRelevantInfo = planets.map((planet) => {
    const elemento = function () {
      return elements
        .map((element) => {
          if (Object.values(element).flat().includes(planet.sign)) {
            return { element: Object.keys(element).join("") };
          }
        })
        .filter((element) => {
          if (element) {
            return element;
          }
        })[0];
    };

    return {
      planetName: planet.name,
      housePosition: planet.house,
      signName: planet.sign,
      ...elemento(),
    };
  });

  const houseCups = obj.houses.filter((houseCup) => {
    if (houseCup.house === 1) {
      return houseCup;
    }
  });
  const houseCupsRelevantInfo = houseCups.map((houseCup) => {
    const elemento = function () {
      return elements
        .map((element) => {
          if (Object.values(element).flat().includes(houseCups[0].sign)) {
            return { element: Object.keys(element).join("") };
          }
        })
        .filter((element) => {
          if (element) {
            return element;
          }
        })[0];
    };
    return {
      houseName: houseCup.house,
      signName: houseCup.sign,
      ...elemento(),
    };
  });

  const aspects = obj.aspects.filter((aspect) => {
    if (
      aspectingPlanets.includes(aspect.aspecting_planet_id) &&
      aspectsNames.includes(aspect.type)
      && aspectedPlanets.includes(aspect.aspected_planet_id)
    ) {
      return aspect;
    }
  });

  const aspectRelevantInfo = aspects.map((aspect) => {
    return {
      aspectingPlanet: aspect.aspecting_planet,
      aspectType: aspect.type,
      aspectedPlanet: aspect.aspected_planet,
    };
  });




  return {
    planets:planetsRelevantInfo,
    houseCups:houseCupsRelevantInfo[0],
    aspects:aspectRelevantInfo,
    soundPath:soundPathFile(planetsRelevantInfo,houseCupsRelevantInfo[0])
  };
}

module.exports = { filterNatalHoroscope };
