import { Navigate } from "react-router-dom";

//? to check if two arrays have common elements
function isIntersecting(arrA, arrB) {
  //* use sets if arrB.length > 15
  //const setB = new Set(arrB);
  //return arrA.some((a) => setB.has(a));

  return arrA.some((a) => arrB.includes(a));
}

function checkPermission(perms, resource, accessLevel) {
  for (let i = 0; i < resource.length; i++) {
    // console.log(perms[resource[i]], resource[i], accessLevel);
    if (perms["admin"] === true || perms[resource[i]] === accessLevel) {
      return true;
    } else if (perms[resource[i]] === "editor" && accessLevel === "viewer") {
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

  if (perms["admin"] === true) {
    return <Navigate to="search/MunicipalPropertyRecord" />;
  }
  for (const key in perms) {
    if (key === "admin") continue;

    if (perms[key] !== "deny") {
      return <Navigate to={routes[key]} />;
    }
  }
}

export { isIntersecting, checkPermission, getDefaultDigitizationRoute };
