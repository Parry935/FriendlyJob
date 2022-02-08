export function convertDate(date) {
  let dateInArray = date
    .split("/")
    .join(",")
    .split(".")
    .join(",")
    .split(" ")
    .join(",")
    .split(":")
    .join(",")
    .split(",");

  let dateNow = new Date();
  let dateToConvert = new Date(
    dateInArray[2],
    dateInArray[1] - 1,
    dateInArray[0],
    dateInArray[3],
    dateInArray[4],
    dateInArray[5]
  );

  if (dateNow < dateToConvert.addHours(1))
    return `${Math.floor((dateNow - dateToConvert) / 60000)} minut temu`;
  else if (dateNow < dateToConvert.addDays(1)) return "dzisiaj";
  else if (dateNow < dateToConvert.addDays(2)) return "wczoraj";

  return dateToConvert.toLocaleDateString();
}

// eslint-disable-next-line no-extend-native
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// eslint-disable-next-line no-extend-native
Date.prototype.addHours = function (hours) {
  var date = new Date(this.valueOf());
  date.setHours(date.getHours() + hours);
  return date;
};

export function convertExperience(experience) {
  if (experience === 0) return "Brak doświadczenia";
  else if (experience === 0.5) return "Pół roku doświadczenia";
  else if (experience === 1) return "Rok doświadczenia";
  else if (experience === 1.5) return "Półtora roku doświadczenia";
  else return `${experience} (doświadczenie w latach)`;
}
