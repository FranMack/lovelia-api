const { faker } = require("@faker-js/faker");

const genereteCity = () => {
  return [
    {
      address_components: [
        {
          long_name: 'Bahía Blanca',
          short_name: 'Bahía Blanca',
          types: [ 'locality', 'political' ]
        },
        {
          long_name: 'Bahía Blanca',
          short_name: 'Bahía Blanca',
          types: [ 'administrative_area_level_2', 'political' ]
        },
        {
          long_name: 'Buenos Aires Province',
          short_name: 'Buenos Aires Province',
          types: [ 'administrative_area_level_1', 'political' ]
        },
        {
          long_name: 'Argentina',
          short_name: 'AR',
          types: [ 'country', 'political' ]
        }
      ],
      formatted_address: 'Bahía Blanca, Buenos Aires Province, Argentina',
      geometry: {
        bounds: {
          northeast: { lat: -38.651577, lng: -62.15530769999999 },
          southwest: { lat: -38.7908821, lng: -62.3574372 }
        },
        location: { lat: -38.7183177, lng: -62.2663478 },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: { lat: -38.651577, lng: -62.15530769999999 },
          southwest: { lat: -38.7908821, lng: -62.3574372 }
        }
      },
      place_id: 'ChIJvQIT3Ku87ZUREXoeJI3Y0XY',
      types: [ 'locality', 'political' ]
    }
  ]
};

const generateManyCities = (size) => {
  const limit = size || 10;
  let cities = [];
  for (let i = 0; i < limit; i++) {
    cities.push(genereteCity());
  }
  return cities;
};

const natalHoroscopeFake1 ={
    "planets": [
        {
            "name": "Sun",
            "full_degree": 163.9447,
            "norm_degree": 13.9447,
            "speed": 0.9707,
            "is_retro": "false",
            "sign_id": 6,
            "sign": "Virgo",
            "house": 12
        },
        {
            "name": "Moon",
            "full_degree": 148.8686,
            "norm_degree": 28.8686,
            "speed": 13.0406,
            "is_retro": "false",
            "sign_id": 5,
            "sign": "Leo",
            "house": 12
        },
        {
            "name": "Mars",
            "full_degree": 164.2737,
            "norm_degree": 14.2737,
            "speed": 0.6388,
            "is_retro": "false",
            "sign_id": 6,
            "sign": "Virgo",
            "house": 12
        },
        {
            "name": "Mercury",
            "full_degree": 151.7925,
            "norm_degree": 1.7925,
            "speed": 1.8405,
            "is_retro": "false",
            "sign_id": 6,
            "sign": "Virgo",
            "house": 12
        },
        {
            "name": "Jupiter",
            "full_degree": 268.7181,
            "norm_degree": 28.7181,
            "speed": 0.0378,
            "is_retro": "false",
            "sign_id": 9,
            "sign": "Sagittarius",
            "house": 3
        },
        {
            "name": "Venus",
            "full_degree": 118.4389,
            "norm_degree": 28.4389,
            "speed": 1.0286,
            "is_retro": "false",
            "sign_id": 4,
            "sign": "Cancer",
            "house": 11
        },
        {
            "name": "Saturn",
            "full_degree": 79.9761,
            "norm_degree": 19.9761,
            "speed": 0.0466,
            "is_retro": "false",
            "sign_id": 3,
            "sign": "Gemini",
            "house": 9
        },
        {
            "name": "Uranus",
            "full_degree": 196.5575,
            "norm_degree": 16.5575,
            "speed": 0.0555,
            "is_retro": "false",
            "sign_id": 7,
            "sign": "Libra",
            "house": 1
        },
        {
            "name": "Neptune",
            "full_degree": 242.6336,
            "norm_degree": 2.6336,
            "speed": 0.0125,
            "is_retro": "false",
            "sign_id": 9,
            "sign": "Sagittarius",
            "house": 2
        },
        {
            "name": "Pluto",
            "full_degree": 181.2124,
            "norm_degree": 1.2124,
            "speed": 0.0365,
            "is_retro": "false",
            "sign_id": 7,
            "sign": "Libra",
            "house": 12
        },
        {
            "name": "Node",
            "full_degree": 295.1424,
            "norm_degree": 25.1424,
            "speed": -0.0885,
            "is_retro": "true",
            "sign_id": 10,
            "sign": "Capricorn",
            "house": 5
        },
        {
            "name": "Chiron",
            "full_degree": 16.429,
            "norm_degree": 16.429,
            "speed": -0.0365,
            "is_retro": "true",
            "sign_id": 1,
            "sign": "Aries",
            "house": 7
        },
        {
            "name": "Part of Fortune",
            "full_degree": 166.3754,
            "norm_degree": 16.3754,
            "speed": 0,
            "is_retro": "false",
            "sign_id": 6,
            "sign": "Virgo",
            "house": 12
        }
    ],
    "houses": [
        {
            "house": 1,
            "sign": "Libra",
            "degree": 181.45154
        },
        {
            "house": 2,
            "sign": "Scorpio",
            "degree": 221.79873
        },
        {
            "house": 3,
            "sign": "Sagittarius",
            "degree": 248.81149
        },
        {
            "house": 4,
            "sign": "Capricorn",
            "degree": 270.79708
        },
        {
            "house": 5,
            "sign": "Capricorn",
            "degree": 292.90988
        },
        {
            "house": 6,
            "sign": "Aquarius",
            "degree": 320.37198
        },
        {
            "house": 7,
            "sign": "Aries",
            "degree": 1.45154
        },
        {
            "house": 8,
            "sign": "Taurus",
            "degree": 41.79873
        },
        {
            "house": 9,
            "sign": "Gemini",
            "degree": 68.81149
        },
        {
            "house": 10,
            "sign": "Cancer",
            "degree": 90.79708
        },
        {
            "house": 11,
            "sign": "Cancer",
            "degree": 112.90988
        },
        {
            "house": 12,
            "sign": "Leo",
            "degree": 140.37198
        }
    ],
    "ascendant": 181.4515359700907,
    "midheaven": 90.79707996379193,
    "vertex": 0.6145475875853276,
    "lilith": {
        "name": "Lilith",
        "full_degree": 231.8657,
        "norm_degree": 21.8657,
        "speed": 0.1117,
        "is_retro": "false",
        "sign_id": 8,
        "sign": "Scorpio",
        "house": 2
    },
    "aspects": [
        {
            "aspecting_planet": "Sun",
            "aspected_planet": "Mars",
            "aspecting_planet_id": 0,
            "aspected_planet_id": 2,
            "type": "Conjunction",
            "orb": 0.33,
            "diff": 0.33
        },
        {
            "aspecting_planet": "Sun",
            "aspected_planet": "Saturn",
            "aspecting_planet_id": 0,
            "aspected_planet_id": 6,
            "type": "Square",
            "orb": 6.03,
            "diff": 83.97
        },
        {
            "aspecting_planet": "Moon",
            "aspected_planet": "Mercury",
            "aspecting_planet_id": 1,
            "aspected_planet_id": 3,
            "type": "Conjunction",
            "orb": 2.92,
            "diff": 2.92
        },
        {
            "aspecting_planet": "Moon",
            "aspected_planet": "Jupiter",
            "aspecting_planet_id": 1,
            "aspected_planet_id": 4,
            "type": "Trine",
            "orb": 0.15,
            "diff": 119.85
        },
        {
            "aspecting_planet": "Moon",
            "aspected_planet": "Neptune",
            "aspecting_planet_id": 1,
            "aspected_planet_id": 8,
            "type": "Square",
            "orb": 3.77,
            "diff": 93.77
        },
        {
            "aspecting_planet": "Moon",
            "aspected_planet": "Midheaven",
            "aspecting_planet_id": 1,
            "aspected_planet_id": 11,
            "type": "Sextile",
            "orb": 1.93,
            "diff": 58.07
        },
        {
            "aspecting_planet": "Mars",
            "aspected_planet": "Saturn",
            "aspecting_planet_id": 2,
            "aspected_planet_id": 6,
            "type": "Square",
            "orb": 5.7,
            "diff": 84.3
        },
        {
            "aspecting_planet": "Mercury",
            "aspected_planet": "Jupiter",
            "aspecting_planet_id": 3,
            "aspected_planet_id": 4,
            "type": "Trine",
            "orb": 3.07,
            "diff": 116.93
        },
        {
            "aspecting_planet": "Mercury",
            "aspected_planet": "Neptune",
            "aspecting_planet_id": 3,
            "aspected_planet_id": 8,
            "type": "Square",
            "orb": 0.84,
            "diff": 90.84
        },
        {
            "aspecting_planet": "Mercury",
            "aspected_planet": "Midheaven",
            "aspecting_planet_id": 3,
            "aspected_planet_id": 11,
            "type": "Sextile",
            "orb": 1,
            "diff": 61
        },
        {
            "aspecting_planet": "Jupiter",
            "aspected_planet": "Saturn",
            "aspecting_planet_id": 4,
            "aspected_planet_id": 6,
            "type": "Opposition",
            "orb": 8.74,
            "diff": 171.26
        },
        {
            "aspecting_planet": "Jupiter",
            "aspected_planet": "Pluto",
            "aspecting_planet_id": 4,
            "aspected_planet_id": 9,
            "type": "Square",
            "orb": 2.49,
            "diff": 87.51
        },
        {
            "aspecting_planet": "Jupiter",
            "aspected_planet": "Ascendant",
            "aspecting_planet_id": 4,
            "aspected_planet_id": 10,
            "type": "Square",
            "orb": 2.73,
            "diff": 87.27
        },
        {
            "aspecting_planet": "Jupiter",
            "aspected_planet": "Midheaven",
            "aspecting_planet_id": 4,
            "aspected_planet_id": 11,
            "type": "Opposition",
            "orb": 2.08,
            "diff": 177.92
        },
        {
            "aspecting_planet": "Venus",
            "aspected_planet": "Neptune",
            "aspecting_planet_id": 5,
            "aspected_planet_id": 8,
            "type": "Trine",
            "orb": 4.19,
            "diff": 124.19
        },
        {
            "aspecting_planet": "Venus",
            "aspected_planet": "Pluto",
            "aspecting_planet_id": 5,
            "aspected_planet_id": 9,
            "type": "Sextile",
            "orb": 2.77,
            "diff": 62.77
        },
        {
            "aspecting_planet": "Venus",
            "aspected_planet": "Ascendant",
            "aspecting_planet_id": 5,
            "aspected_planet_id": 10,
            "type": "Sextile",
            "orb": 3.01,
            "diff": 63.01
        },
        {
            "aspecting_planet": "Saturn",
            "aspected_planet": "Uranus",
            "aspecting_planet_id": 6,
            "aspected_planet_id": 7,
            "type": "Trine",
            "orb": 3.42,
            "diff": 116.58
        },
        {
            "aspecting_planet": "Neptune",
            "aspected_planet": "Pluto",
            "aspecting_planet_id": 8,
            "aspected_planet_id": 9,
            "type": "Sextile",
            "orb": 1.42,
            "diff": 61.42
        },
        {
            "aspecting_planet": "Neptune",
            "aspected_planet": "Ascendant",
            "aspecting_planet_id": 8,
            "aspected_planet_id": 10,
            "type": "Sextile",
            "orb": 1.18,
            "diff": 61.18
        },
        {
            "aspecting_planet": "Pluto",
            "aspected_planet": "Ascendant",
            "aspecting_planet_id": 9,
            "aspected_planet_id": 10,
            "type": "Conjunction",
            "orb": 0.24,
            "diff": 0.24
        },
        {
            "aspecting_planet": "Pluto",
            "aspected_planet": "Midheaven",
            "aspecting_planet_id": 9,
            "aspected_planet_id": 11,
            "type": "Square",
            "orb": 0.42,
            "diff": 90.42
        },
        {
            "aspecting_planet": "Ascendant",
            "aspected_planet": "Midheaven",
            "aspecting_planet_id": 10,
            "aspected_planet_id": 11,
            "type": "Square",
            "orb": 0.65,
            "diff": 90.65
        }
    ]
}

module.exports = { genereteCity, generateManyCities, natalHoroscopeFake1 };
