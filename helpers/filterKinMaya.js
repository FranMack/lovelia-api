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
  const step1 = filterTable1(year);
  const step2 = filterTable2(month);
  const step3 = step1 + step2 + day;

  const kin = step3 > 260 ? step3 - 260 : step3;
  const cosmicTone = kin % 13;
  const solarSailPosition = kin % 20;
  const solarSail = calcSolarSail(solarSailPosition);

  return {
    kin,
    solarSail,
    cosmicTone,
  };
}

module.exports = { calcKinMaya, filterTable1, filterTable2, calcSolarSail };
