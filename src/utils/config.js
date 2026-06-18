const prodConfig = {
  USER_ENDPOINT: "https://8tp0dv93l1.execute-api.ap-south-1.amazonaws.com",
  PRESS_ENDPOINT: "https://ltr8d5c4sg.execute-api.ap-south-1.amazonaws.com",
};

const devConfig = {
  USER_ENDPOINT: "https://iotspace.maruti.co.in/dev/api",
  PRESS_ENDPOINT: "https://iotspace.maruti.co.in/api",
};

const QA_config = {
  USER_ENDPOINT: "https://m5d7n2vx05.execute-api.ap-south-1.amazonaws.com",
  PRESS_ENDPOINT: "https://3ec0wxc4q2.execute-api.ap-south-1.amazonaws.com",
};

let config = devConfig;

if (
  process.env.REACT_APP_ENVIRONMENT === "UI_production" ||
  process.env.REACT_APP_ENVIRONMENT === "production"
) {
  config = prodConfig;
} else if (
  process.env.REACT_APP_ENVIRONMENT === "UI_develop" ||
  process.env.REACT_APP_ENVIRONMENT === "develop"
) {
  config = devConfig;
} else if (
  process.env.REACT_APP_ENVIRONMENT === "UI_QA" ||
  process.env.REACT_APP_ENVIRONMENT === "QA"
) {
  config = QA_config;
}

export default config;
