export const getWidth = (val) => {
  const screenHeight = window.screen.height;
  const width = window.screen.width;
  const value = (width * val) / 1440;
  let dimension = value * 0.9;
  if (screenHeight <= 900 && screenHeight >= 730) {
    dimension = value * 0.9;
  }
  if (screenHeight > 900) {
    dimension = value;
  }
  return dimension;
};

export const getHeight = (val) => {
  const screenHeight = window.screen.height;
  const height = window.screen.height;
  const value = (height * val) / 800;
  let dimension = value * 0.7;
  if (screenHeight <= 900 && screenHeight >= 730) {
    dimension = value * 0.8;
  }
  if (screenHeight > 900) {
    dimension = value;
  }
  return dimension;
};

export const exists = (val) => {
  if (val !== undefined && val !== null) {
    return true;
  }
  return false;
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

export const getBarWidth = () => {
  const screenHeight = window.screen.height;
  let width = 45;
  if (screenHeight <= 900 && screenHeight >= 730) {
    width = 62;
  }
  if (screenHeight > 900) {
    width = 70;
  }
  return width;
};

export const getBarLeft = () => {
  const screenHeight = window.screen.height;
  let width = 0;
  if (screenHeight <= 900 && screenHeight >= 730) {
    width = 10;
  }
  if (screenHeight > 900) {
    width = 15;
  }
  return width;
};

export const getBarBottom = () => {
  const screenHeight = window.screen.height;
  let height = 10;
  if (screenHeight <= 900 && screenHeight >= 730) {
    height = 20;
  }
  if (screenHeight > 900) {
    height = 30;
  }
  return height;
};

export const getBarBottomTick = () => {
  const screenHeight = window.screen.height;
  let height = 15;
  if (screenHeight <= 900 && screenHeight >= 730) {
    height = 20;
  }
  if (screenHeight > 900) {
    height = 30;
  }
  return height;
};
