import { Navigate } from "react-router-dom";

//? to check if two arrays have common elements
function isIntersecting(arrA, arrB) {
  //* use sets if arrB.length > 15
  //const setB = new Set(arrB);
  //return arrA.some((a) => setB.has(a));

  return arrA.some((a) => arrB.includes(a));
}

function checkPermission(perms, resource, accessLevel) {
  console.log(perms);
  for (let i = 0; i < resource.length; i++) {
    // console.log(perms[resource[i]], resource[i], accessLevel);
    if (perms[resource[i]] === accessLevel) {
      return true;
    } else if (perms[resource[i]] === "editor" && accessLevel === "viewer") {
      return true;
    } else if (
      Array.isArray(accessLevel) &&
      accessLevel.includes(perms[resource[i]])
    ) {
      return true;
    }
  }
  return false;
}

function getDefaultDigitizationRoute(perms) {
  // const perms = {
  //   admin: false,
  //   birth_records: "viewer",
  //   construction_license_records: "viewer",
  //   death_records: "deny",
  //   house_tax_records: "viewer",
  //   municipality_property_records: "viewer",
  //   trade_license_records: "deny",
  // };

  const routes = {
    birth_records: "search/BirthRecord",
    construction_license_records: "search/ConstructionLicenseRecord",
    death_records: "search/DeathRecord",
    house_tax_records: "search/HouseTaxRecord",
    municipality_property_records: "search/MunicipalPropertyRecord",
    trade_license_records: "search/TradeLicenseRecord",
  };

  for (const key in routes) {
    if (perms[key] !== "deny") {
      return <Navigate to={routes[key]} />;
    }
  }
}

function getRandomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getColorForString(inputString) {
  const stringLength = inputString.length;
  const hexColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#00FFFF",
    "#FFD700",
    "#7FFF00",
    "#008080",
    "#8B008B",
    "#00FF7F",
    "#FF4500",
    "#9932CC",
    "#FF69B4",
    "#40E0D0",
    "#FF8C00",
    "#8A2BE2",
    "#FF00FF",
  ];

  const colorIndex = stringLength % hexColors.length;
  return hexColors[colorIndex];
}

function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

export {
  capitalizeEveryWord,
  isIntersecting,
  checkPermission,
  getDefaultDigitizationRoute,
  getRandomElement,
  getColorForString,
};
