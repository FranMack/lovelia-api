function translateSign(userSign) {
  const zodiacSign = [
    { Aries: "Aries" },
    { Tauro: "Taurus" },
    { Geminis: "Gemini" },
    { Cancer: "Cancer" },
    { Leo: "Leo" },
    { Virgo: "Virgo" },
    { Libra: "Libra" },
    { Escorpio: "Scorpio" },
    { Sagitario: "Sagittarius" },
    { Capricornio: "Capricorn" },
    { Acuario: "Aquarius" },
    { Piscis: "Pisces" },
  ];

  const signoFilter = zodiacSign.find(
    (sign) => Object.values(sign)[0] === userSign
  );

  const signo =signoFilter ? Object.keys(signoFilter)[0].toLocaleUpperCase():null;

  if(!signo){throw new Error("Error in translateSign function:Please check the function enter parameter")}

  return signo 
}

function translateElement(userElement) {
  const elements = [
    { Fuego: "Fire" },
    { Agua: "Watter" },
    { Aire: "Air" },
    { Tierra: "Earth" },
  ];

  const elementoFilter = elements.find(
    (element) => Object.values(element)[0] === userElement
  );
  const elemento =elementoFilter ? Object.keys(elementoFilter)[0]:null;

  

  if(!elemento){throw new Error("Error in translateElement function:Please check the function enter parameter")}

  return elemento 
}

function soundPathFile(planets, houseCups) {
  const sunSign = planets[0].signName;
  const houseCupElement = houseCups.element;
  const moonElement = planets[1].element;

 

  return `${translateSign(sunSign)}-ASC.${translateElement(houseCupElement)}_LUNA_${translateElement(moonElement)}.wav`;
}


function soundTimeFormat(time){

  const minutes= Math.floor(time/60)
  const seconds=Math.round(((time/60)-minutes)*60);

  return `${minutes>9 ?minutes:`0${minutes}`}:${seconds>9 ?seconds:`0${seconds}`}`

}




module.exports = { soundPathFile,translateSign,translateElement,soundTimeFormat };


