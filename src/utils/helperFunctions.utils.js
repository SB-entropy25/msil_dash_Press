import moment from "moment";

export const getErrorMessage = (ex) => {
  let message = "";
  if (ex?.response?.status === 409) {
    message = ex?.response?.data?.message;
  } else {
    message = ex?.message;
  }
  return message;
};
export const getBarGraphHeight = () => {
  const screenHeight = window.screen.height;
  let height = 310;
  if (screenHeight <= 900 && screenHeight >= 730) {
    height = 470;
  }
  if (screenHeight > 900) {
    height = 580;
  }
  return height;
};
export const capitalizeFirstCharacter = (inputString) => {
  if (!inputString) {
    return inputString;
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

export const getWidth = (val) => {
  const width = window.screen.width;
  return (width * val) / 1440;
};

export const getPageSize = () => {
  let page = 20;
  if (window.screen.height > 900) {
    page = 30;
  }
  return page;
};

export const getHeight = (val) => {
  const height = window.screen.height;
  return (height * val) / 800;
};

export const addOneMinute = (dateTime) => {
  if (!dateTime) {
    return null;
  }
  let newDate = new Date(dateTime);
  newDate.setMinutes(newDate.getMinutes() + 1);
  return newDate;
};

export const subtractOneMinute = (dateTime) => {
  if (!dateTime) {
    return null;
  }
  let newDate = new Date(dateTime);
  newDate.setMinutes(newDate.getMinutes() - 1);
  return newDate;
};

export const equalList = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  return true;
};

export const getStartDate = (val) => {
  const shiftStart = new Date(val);
  shiftStart.setHours(6);
  shiftStart.setMinutes(30);
  shiftStart.setSeconds(0);
  return shiftStart;
};

export const checkValidList = (list) => {
  const filtered = list?.filter((x) => x && x !== null && x !== "");
  return filtered;
};

export const isNonNegativeInteger = (value) => {
  if (
    !String(value).includes(".") &&
    !String(value).includes("-") &&
    typeof value === "number" &&
    !Number.isNaN(value) &&
    Number.isInteger(value) &&
    value >= 0
  ) {
    return true;
  }
  return false;
};

export const isNonNegative = (value) => {
  if (typeof value === "number" && !Number.isNaN(value) && value >= 0) {
    return true;
  }
  return false;
};

export const filterPositive = (value) => {
  return isNonNegative(value) ? value : 0;
};

export const formatDateTime = (val, type = "DD MMMM  YYYY; h:mm A") => {
  if (val === "-") {
    return "-";
  }
  if (val) {
    return moment(val).format(type);
  }
};

export const differenceGreaterThan48 = (givenTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(givenTime);
  const fortyEightHoursInMilliseconds = 48 * 60 * 60 * 1000;

  // Check if the time difference is greater than 48 hours
  if (timeDifference > fortyEightHoursInMilliseconds) {
    return true;
  }
  return false;
};

export const differenceGreaterThan24 = (givenTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(givenTime);
  const fortyEightHoursInMilliseconds = 24 * 60 * 60 * 1000;

  // Check if the time difference is greater than 24 hours
  if (timeDifference > fortyEightHoursInMilliseconds) {
    return true;
  }
  return false;
};
export const differenceGreaterThan100 = (givenTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime - new Date(givenTime);
  const fortyEightHoursInMilliseconds = 100 * 60 * 60 * 1000;

  // Check if the time difference is greater than 24 hours
  if (timeDifference > fortyEightHoursInMilliseconds) {
    return true;
  }
  return false;
};

export const getHighestAndCreateList = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  const highest = Math.max(...arr);

  const newList = [];
  for (let i = 1; i <= highest; i++) {
    newList.push(i);
  }

  return newList;
};

export const correctUrl = (str) => {
  if (str[str.length - 1] === "&") {
    return str.substring(0, str.length - 1);
  }
  return str;
};

export const validString = (val) => {
  if (val && val !== "") {
    return true;
  }
  return false;
};

export const ExcelDateToJSDate = (serial) => {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;
  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  var date = new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
  return moment(date).format("YYYY-MM-DD");
};
export const findPermittedShop = (sites, shopsPermitted) => {
  for (let siteIndex = 0; siteIndex < sites.length; siteIndex++) {
    for (
      let locationIndex = 0;
      locationIndex < sites[siteIndex]?.locations.length;
      locationIndex++
    ) {
      for (
        let plantIndex = 0;
        plantIndex < sites[siteIndex]?.locations[locationIndex]?.plants.length;
        plantIndex++
      ) {
        for (
          let shopIndex = 0;
          shopIndex <
          sites[siteIndex]?.locations[locationIndex]?.plants[plantIndex]?.shops
            .length;
          shopIndex++
        ) {
          let currentShop =
            sites[siteIndex]?.locations[locationIndex]?.plants[plantIndex]
              ?.shops[shopIndex];
          if (shopsPermitted.includes(String(currentShop.id))) {
            return {
              site: sites[siteIndex],
              location: sites[siteIndex]?.locations[locationIndex],
              plant:
                sites[siteIndex]?.locations[locationIndex]?.plants[plantIndex],
              shop: sites[siteIndex]?.locations[locationIndex]?.plants[
                plantIndex
              ]?.shops[shopIndex],
            };
          }
        }
      }
    }
  }
  if (sites !== undefined) {
    return {
      site: sites[0],
      location: sites[0]?.locations[0],
      plant: sites[0]?.locations[0]?.plants[0],
      shop: sites[0]?.locations[0]?.plants[0]?.shops[0],
    };
  }
};

export const sliceString = (input, length) => {
  return input?.length > length ? input?.slice(0, length) + "..." : input;
};

export const eventReplica = (name, value) => {
  return { target: { name: name, value: value } };
};

export const listResult = (list) => {
  if (list && Array.isArray(list)) {
    if (list.length === 0) {
      return undefined;
    } else {
      return list;
    }
  }
  return undefined;
};

export const encodedList = (list) => {
  if (list && Array.isArray(list)) {
    if (list.length === 0) {
      return undefined;
    } else {
      const filtered = list.map((x) => encodeURIComponent(x));
      return filtered;
    }
  }
  return undefined;
};

export const selectResult = (val) => {
  if (val && val !== "All") {
    return val;
  }
  return undefined;
};

export const formArrResult = (val) => {
  if (val && val !== "All") {
    if (Array.isArray(val) && val?.length) {
      return val;
    }
    return undefined;
  }
  return undefined;
};

export const handleNumberEmpty = (val) => {
  if (val === "") {
    return 0;
  }
  return val;
};

export const getError = (ex) => {
  const error = ex?.response?.data?.message;
  if (error) {
    return error;
  }
  return ex.message;
};

export const convertTo12HourFormat = (time, isminute) => {
  const parsedTime = new Date(time);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedTime = isminute
    ? `${formattedHours}: ${formattedMinutes} ${period}`
    : `${formattedHours} : ${period}`;
  return formattedTime;
};

export const findStatingAndEndDate = (list) => {
  let minsDate = null;
  let maxSDate = null;

  for (const data of list) {
    const startDate = new Date(data.name);
    if (!minsDate || startDate < minsDate) {
      minsDate = startDate;
    }
    if (!maxSDate || startDate > maxSDate) {
      maxSDate = startDate;
    }
  }

  return { minsDate, maxSDate };
};

export const sapFileName = (name, shop) => {
  const formatDate = moment(new Date()).format("DDMMYYYYhhmmss");
  return `${name}_${shop || ""}_${formatDate}.xlsx`;
};

export const getFileName = (name) => {
  const formatDate = moment(new Date()).format("DDMMYYYYhhmmss");
  return `${name}_${formatDate}.xlsx`;
};
