
  import { correctUrl } from "../utils/helperFunctions.utils";
import { baseClient } from "./BaseRepository";

export const downloadDowntime = (payload, options) => {
  const {
    shop_id,
    machine_list,
    model_list,
    part_name_list,
    start_time,
    end_time,
    shift,
    duration,
    reason,
    remarks,
  } = payload;
  var path = `/pressShop/downtime/report?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (start_time) {
    path += `&start_time=${start_time}`;
  }
  if (end_time) {
    path += `&end_time=${end_time}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (duration) {
    path += `&duration=${duration}`;
  }
  if (reason) {
    path += `&reason=${reason}`;
  }
  if (remarks) {
    path += `&remarks=${remarks}`;
  }
  return baseClient.get(correctUrl(path), options);
};

export const getDowntime = (payload) => {
  const {
    shop_id,
    page_no = 1,
    page_size = 20,
    machine_list,
    model_list,
    part_name_list,
    start_time,
    end_time,
    shift,
    duration,
    reason,
    remarks,
  } = payload;
  var path = `/pressShop/downtime?page_no=${page_no}&page_size=${page_size}&shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (start_time) {
    path += `&start_time=${start_time}`;
  }
  if (end_time) {
    path += `&end_time=${end_time}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (duration) {
    path += `&duration=${duration}`;
  }
  if (reason) {
    path += `&reason=${reason}`;
  }
  if (remarks) {
    path += `&remarks=${remarks}`;
  }
  return baseClient.get(path);
};

export const fetchDowntimeStopTime = (payload) => {
  const {
    shop_id,
    machine_list,
    model_list,
    part_name_list,
    start_time,
    end_time,
    shift,
    duration,
    reason,
    remarks,
  } = payload;
  var path = `/pressShop/downtime/totalduration?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (start_time) {
    path += `&start_time=${start_time}`;
  }
  if (end_time) {
    path += `&end_time=${end_time}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (duration) {
    path += `&duration=${duration}`;
  }
  if (reason) {
    path += `&reason=${reason}`;
  }
  if (remarks) {
    path += `&remarks=${remarks}`;
  }
  return baseClient.get(path);
};

export const updateRemarks = (payload) => {
  const { shop_id, id, reason, remarks, comment } = payload;
  var path = `/pressShop/downtime/remark/update?shop_id=${shop_id}`;
  if (id) {
    path += `&id=${id}`;
  }
  if (reason) {
    path += `&reason=${reason}`;
  }
  if (remarks) {
    path += `&remarks=${remarks}`;
  }
  if (comment) {
    path += `&comment=${comment}`;
  }
  return baseClient.put(path);
};

export const getRemarkList = (id) => {
  var path = `/pressShop/downtime/remark/list?shop_id=${id}`;
  return baseClient.get(path);
};
