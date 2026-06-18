
  export const filtersInitialState = {
  plan: [],
  downtime: [],
  quality: [],
  reports: [],
};

export const planStatusInitialState = {
  errors: null,
  plan_for_date: "",
  shop_id: 3,
  status: "INPROGRESS",
};

export const reasonsInitialState = {
  PUNCHING: {},
  UPDATION: {
    OK: [],
    RECYCLE: [],
    REJECT: [],
  },
};

// export const refreshedInitialState={
//   plan:false,
//   downtime:false,
//   quality_punching:false,
//   quality_rework:false,
// }
