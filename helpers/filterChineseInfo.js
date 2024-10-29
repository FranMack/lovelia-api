function calcularAnimal(data) {
  const year = data.year;
  const cicloAnimal = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  const baseYear = 1900;
  const animalIndex = (year - baseYear) % 12;
  return cicloAnimal[animalIndex < 0 ? animalIndex + 12 : animalIndex];
}

function chineeseAnimalElement(data) {
  const year = data.year.toString();
  const lastNumber = Number(year[year.length - 1]);
  const elements = [
    { Metal: [0, 1] },
    { Watter: [2, 3] },
    { Wood: [4, 5] },
    { Fire: [6, 7] },
    { Earth: [8, 9] },
  ];

  const newArray = elements
    .map((element) => {
      if (Object.values(element).flat().includes(lastNumber)) {
        return { element: Object.keys(element).join("") };
      }
    })
    .filter((element) => {
      if (element) {
        return element;
      }
    })[0];

  return { chineseElement: newArray.element };
}

function chineseNumber(data) {
  let year = data.year
    .toString()
    .split("")
    .map((num) => {
      return Number(num);
    });
  let month = data.month
    .toString()
    .split("")
    .map((num) => {
      return Number(num);
    });
  let day = data.day
    .toString()
    .split("")
    .map((num) => {
      return Number(num);
    });

    let birthDate=[...year,...month,...day]

  let i = 10;

  while (i > 9) {
    i = birthDate.reduce((a, b) => {
      return a + b;
    }, 0);
    if (i > 9) {
      birthDate = i
        .toString()
        .split("")
        .map((num) => {
          return Number(num);
        });
    }
  }

  return i;
}

function chineseInformation(data) {
  const animal = calcularAnimal(data);
  const number = chineseNumber(data);
  const element = chineeseAnimalElement(data).chineseElement;
  return { animal, number, element };
}

module.exports = {
  calcularAnimal,
  chineeseAnimalElement,
  chineseNumber,
  chineseInformation,
};
