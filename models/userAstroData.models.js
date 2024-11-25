const mongoose = require("mongoose");

const userAstroDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  planets: [
    {
      planetName: String,
      housePosition: String,
      signName: String,
      element: String,
    },
  ],
  houseCups: { houseName: String, signName: String,element:String },

  aspects:[{aspectingPlanet:String, aspectType:String,aspectedPlanet:String}],
  chineseInfo:{
    animal:String,
    element:String,
    number:Number
  },
  kinMaya:{
    kin:Number,
    solarSail:String,
    cosmicTone:String
  },
  soundPath:{
    type:String
  },
  intention:{
    type:String
  }
});

const UserAstroData = mongoose.model("User astro data", userAstroDataSchema);

module.exports = UserAstroData;
