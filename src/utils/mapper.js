
  import {
  StatusBlue,
  StatusGreen,
  StatusGrey,
  StatusRed,
  StatusYellow,
} from "../utils/colors";

export const statusColor = {
  Planned: StatusBlue,
  Running: StatusYellow,
  Paused: StatusRed,
  Completed: StatusGreen,
  "Short closed": StatusGrey,
  Unplanned: StatusRed,
};

export const statusMapper = {
  Planned: "PLANNED",
  Running: "RUNNING",
  Paused: "PAUSED",
  Completed: "COMPLETED",
  "Short closed": "SHORT_CLOSED",
};

export const statusOppMapper = {
  PLANNED: "Planned",
  RUNNING: "Running",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  SHORT_CLOSED: "Short closed",
  UNPLANNED: "Unplanned",
};

export const qualityReasonMapper = {
  PUNCHING: 0,
  UPDATION: 1,
};

export const holdMapper = {
  0: 0,
  ">0": 1,
};
