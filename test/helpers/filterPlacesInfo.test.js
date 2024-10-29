const { filterPlacesInfo } = require("../../helpers/filterPlacesInfo");
const {genereteCity } = require("./fake.info");

describe("Relevant info", () => {
  test("Should return only relevant info (id,city,state,country)", () => {
    const city=genereteCity()

    let citiesWithRelevantInfo = filterPlacesInfo(city);
expect(citiesWithRelevantInfo).toHaveProperty("city")
expect(citiesWithRelevantInfo).toHaveProperty("state")
expect(citiesWithRelevantInfo).toHaveProperty("country")
expect(citiesWithRelevantInfo).toHaveProperty("coordinates")
expect(citiesWithRelevantInfo.coordinates).toHaveProperty("lat")
expect(citiesWithRelevantInfo.coordinates).toHaveProperty("lng")
  });
});
