const { table1, table2, kinMayaTable } = require("./tablesKinMaya");

//Auxiliar

function filterTable1(year) {
  const table1Filter = table1.filter((row) => {
    if (Object.values(row).flat().includes(year)) {
      return row;
    }
  });
  return Number(Object.keys(table1Filter[0]));
}
function filterTable2(month) {
  for (let prop in table2) {
    if (Number(prop) === month) {
      return table2[prop];
    }
  }
}

function calcSolarSail(position) {
  if(position===0){
    return "sun"
  }
  const filter = kinMayaTable.filter((row) => {
    if (Object.values(row).flat().includes(position)) {
      return row;
    }
  });

  const solarSail = Object.keys(filter[0])[0];

  return solarSail;
}

//Principal

function calcKinMaya(year, month, day) {

  const tones=["magnetico","lunar","electrico","autoexistente","entonado","ritmico","resonante","galactico","solar","planetario","espectral","cristal","cosmico"]
  const step1 = filterTable1(year);
  const step2 = filterTable2(month);
  const step3 = step1 + step2 + day;
  const kin = step3 > 260 ? step3 - 260 : step3;
  const cosmicToneIndex = kin % 13;
  const solarSailPosition = kin % 20;
  const solarSail = calcSolarSail(solarSailPosition);

  return {
    kin,
    solarSail,
    cosmicTone:cosmicToneIndex>0?tones[cosmicToneIndex-1]:tones[tones.length-1]
  };
}

//traduce el sello solar y tono cosmico a la misma notación que usan en el modelo de three js

function transformSolarSail(solarSail){
  if(solarSail==="dragon"){return "dragonRojo"}
  if(solarSail==="wind"){return "vientoBlanco"}
  if(solarSail==="night"){return "nocheAzul"}
  if(solarSail==="seed"){return "semillaAmarilla"}
  if(solarSail==="snake"){return "serpienteRoja"}
  if(solarSail==="worldBridger"){return "enlazadorMundos"}
  if(solarSail==="hand"){return "manoAzul"}
  if(solarSail==="start"){return "estrellaAmarilla"}
  if(solarSail==="moon"){return "lunaRoja"}
  if(solarSail==="dog"){return "perroBlanco"}
  if(solarSail==="monkey"){return "monoAzul"}
  if(solarSail==="human"){return "humanoAmarillo"}
  if(solarSail==="skyWalker"){return "caminanteCielo"}
  if(solarSail==="wizard"){return "magoBlanco"}
  if(solarSail==="eagle"){return "aguilaAzul"}
  if(solarSail==="warrior"){return "guerreroAmarillo"}
  if(solarSail==="earth"){return "tierraRoja"}
  if(solarSail==="mirrow"){return "perroBlanco"}
  if(solarSail==="storm"){return "tormentaAzul"}
  if(solarSail==="sun"){return "solAmarillo"}

  return ""


}






module.exports = { calcKinMaya, filterTable1, filterTable2, calcSolarSail,transformSolarSail };
