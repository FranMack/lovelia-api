const {
  translateElement,
  translateSign,
  soundPathFile,
} = require("../../helpers/sound");

translateElement;
describe("Auxiliar sound functions", () => {
  describe("Translate sign function", () => {
    test("Shoul translate the zodiact sign to spanish,using capital letters", () => {
      expect(translateSign("Aries")).toBe("ARIES");
      expect(translateSign("Taurus")).toBe("TAURO");
      expect(translateSign("Gemini")).toBe("GEMINIS");
      expect(translateSign("Cancer")).toBe("CANCER");
      expect(translateSign("Leo")).toBe("LEO");
      expect(translateSign("Virgo")).toBe("VIRGO");
      expect(translateSign("Libra")).toBe("LIBRA");
      expect(translateSign("Scorpio")).toBe("ESCORPIO");
      expect(translateSign("Sagittarius")).toBe("SAGITARIO");
      expect(translateSign("Capricorn")).toBe("CAPRICORNIO");
      expect(translateSign("Aquarius")).toBe("ACUARIO");
      expect(translateSign("Pisces")).toBe("PISCIS");
    });
    test("Shoul return an error message if the enter value (sing) ir wrong", () => {
      expect(()=>translateSign("WrongSing")).toThrow(
        "Error in translateSign function:Please check the function enter parameter"
      );
    });
  });

  describe("Translate element function", () => {
    test("Shoul translate the element", () => {
      expect(translateElement("Fire")).toBe("Fuego");
      expect(translateElement("Water")).toBe("Agua");
      expect(translateElement("Air")).toBe("Aire");
      expect(translateElement("Earth")).toBe("Tierra");
    
    });
    test("Shoul return an error message if the enter value (element) ir wrong", () => {
        expect(()=>translateElement("WrongElement")).toThrow(
          "Error in translateElement function:Please check the function enter parameter"
        );
      });
   
  });

  describe("Sound path", () => {
    test("Shoul return the sound path with the correct structure ", () => {

        let planets=[
            {
                planetName: "Sun",
                housePosition: "7",
                signName: "Sagittarius",
                element: "Fire",
                _id: "65f45232fa6235fe598e175f"
            },
            {
                planetName: "Moon",
                housePosition: "4",
                signName: "Libra",
                element: "Air",
                _id: "65f45232fa6235fe598e1760"
            }
        ]
        let houseCups={
            houseName: "1",
            signName: "Gemini",
            element: "Air"
        }
        let planets2 = [
            {
                planetName: "Mars",
                housePosition: "10",
                signName: "Leo",
                element: "Fire",
                _id: "65f45232fa6235fe598e175f"
            },
            {
                planetName: "Venus",
                housePosition: "1",
                signName: "Cancer",
                element: "Water",
                _id: "65f45232fa6235fe598e1760"
            }
        ];
        let houseCups2 = {
            houseName: "2",
            signName: "Taurus",
            element: "Earth"
        };

        expect(soundPathFile(planets2, houseCups2)).toBe("LEO-ASC.Tierra_LUNA_Agua.wav");
  
        expect(soundPathFile(planets,houseCups)).toBe("SAGITARIO-ASC.Aire_LUNA_Aire.wav")
    });
    
   
  });
});
