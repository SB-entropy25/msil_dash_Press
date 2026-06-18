import { baseClient } from "./BaseRepository";

export const fetchReport = (payload, options) => {
  const {
    type = "production",
    machine_list,
    model_list,
    part_name_list,
    shift,
    shop_id,
    start_time,
    end_time,
    kpi,
  } = payload;
  var path = `/pressShop/reports/${type}/report?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (kpi && type === "production") {
    path += `&kpi=${kpi}`;
  }
  if (start_time) {
    path += `&start_date=${start_time}`;
  }
  if (end_time) {
    path += `&end_date=${end_time}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  return baseClient.get(path, options);
};

export const fetchReportGraph = (payload) => {
  const {
    type = "production",
    machine_list,
    model_list,
    part_name_list,
    shift,
    shop_id,
    start_time,
    end_time,
    kpi,
  } = payload;
  var path = `/pressShop/reports/${type}?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (kpi && type === "production") {
    path += `&kpi=${kpi}`;
  }
  if (start_time) {
    path += `&start_date=${start_time}`;
  }
  if (end_time) {
    path += `&end_date=${end_time}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  return baseClient.get(path);
};
