const { filterTable1, filterTable2,calcSolarSail,calcKinMaya } = require("../../helpers/filterKinMaya");

filterTable2;

describe("Kin Maya info", () => {
  describe("Filter auxiliar Table 1", () => {
    let year = 1988;

    test("Should return the number from auxiliar table 1 corresponding to the year", () => {
      expect(filterTable1(year)).toBe(192);
      expect(filterTable1(year + 1)).toBe(37);
      expect(filterTable1(year + 2)).toBe(142);
      expect(filterTable1(year + 3)).toBe(247);
      expect(filterTable1(year + 4)).toBe(92);
      expect(filterTable1(year + 5)).toBe(197);
      expect(filterTable1(year + 6)).toBe(42);
      expect(filterTable1(year + 7)).toBe(147);
      expect(filterTable1(year + 8)).toBe(252);
      expect(filterTable1(year + 9)).toBe(97);
      expect(filterTable1(year + 10)).toBe(202);
    });
  });

  describe("Filter auxiliar Table 2", () => {
    let month = 1;

    test("Should return the number from auxiliar table 2 corresponding to the month", () => {
      expect(filterTable2(month)).toBe(0);
      expect(filterTable2(month + 1)).toBe(31);
      expect(filterTable2(month + 2)).toBe(59);
      expect(filterTable2(month + 3)).toBe(90);
      expect(filterTable2(month + 4)).toBe(120);
      expect(filterTable2(month + 5)).toBe(151);
      expect(filterTable2(month + 6)).toBe(181);
      expect(filterTable2(month + 7)).toBe(212);
      expect(filterTable2(month + 8)).toBe(243);
      expect(filterTable2(month + 9)).toBe(13);
      expect(filterTable2(month + 10)).toBe(44);
      expect(filterTable2(month + 11)).toBe(74);
    });
  });

  describe("Solar Sail", () => {
    let solarSailPosition = 0;

    test("Should return the user solar tail", () => {
      expect(calcSolarSail(solarSailPosition)).toBe("sun");
      expect(calcSolarSail(solarSailPosition + 1)).toBe("dragon");
      expect(calcSolarSail(solarSailPosition + 2)).toBe("wind");
      expect(calcSolarSail(solarSailPosition + 3)).toBe("night");
      expect(calcSolarSail(solarSailPosition + 4)).toBe("seed");
      expect(calcSolarSail(solarSailPosition + 5)).toBe("snake");
      expect(calcSolarSail(solarSailPosition + 6)).toBe("worldBridger");
      expect(calcSolarSail(solarSailPosition + 7)).toBe("hand");
      expect(calcSolarSail(solarSailPosition + 8)).toBe("start");
      expect(calcSolarSail(solarSailPosition + 9)).toBe("moon");
      expect(calcSolarSail(solarSailPosition + 10)).toBe("dog");
      expect(calcSolarSail(solarSailPosition + 11)).toBe("monkey");
      expect(calcSolarSail(solarSailPosition + 12)).toBe("human");
      expect(calcSolarSail(solarSailPosition + 13)).toBe("skyWalker");
      expect(calcSolarSail(solarSailPosition + 14)).toBe("wizard");
      expect(calcSolarSail(solarSailPosition + 15)).toBe("eagle");
      expect(calcSolarSail(solarSailPosition + 16)).toBe("warrior");
      expect(calcSolarSail(solarSailPosition + 17)).toBe("earth");
      expect(calcSolarSail(solarSailPosition + 18)).toBe("mirrow");
      expect(calcSolarSail(solarSailPosition + 19)).toBe("storm");
    });
  });

  describe("Calc Kin Maya", () => {
    let year= 1972;
    let month = 11;
    let day=30;

    test("Should return an object with the kin number, solar sail and cosmic tone", () => {
      const userKinMayaInfo=calcKinMaya(year,month,day)
      expect(userKinMayaInfo).toHaveProperty("kin")
      expect(userKinMayaInfo).toHaveProperty("solarSail")
      expect(userKinMayaInfo).toHaveProperty("cosmicTone")
      expect(userKinMayaInfo.kin).toBe(146)
      expect(userKinMayaInfo.solarSail).toBe("worldBridger")
      expect(userKinMayaInfo.cosmicTone).toBe(3)
      
     
    });
  });
});
