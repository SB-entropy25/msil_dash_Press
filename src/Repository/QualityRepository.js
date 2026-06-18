import { holdMapper, qualityReasonMapper } from "../utils/mapper";
import { baseClient } from "./BaseRepository";

export const getQuality = (payload) => {
  const {
    machine_list,
    model_list,
    part_name_list,
    batch,
    hold_qty,
    shift,
    shop_id,
    page_no = 1,
    page_size = 20,
    start_time,
    end_time,
  } = payload;
  var path = `/pressShop/quality?shop_id=${shop_id}&page_no=${page_no}&page_size=${page_size}`;
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
  if (batch) {
    path += `&batch=${batch}`;
  }
  if (hold_qty) {
    path += `&hold_qty=${holdMapper[hold_qty]}`;
  }
  return baseClient.get(path);
};

export const getQualityRework = (payload) => {
  const {
    machine_list,
    model_list,
    part_name_list,
    batch,
    status,
    shift,
    shop_id,
    page_no = 1,
    page_size = 20,
    start_time,
    end_time,
  } = payload;

  var path = `/pressShop/rework?shop_id=${shop_id}&page_no=${page_no}&page_size=${page_size}`;
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
  if (batch) {
    path += `&batch=${batch}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (status) {
    path += `&status=${status}`;
  }
  return baseClient.get(path);
};

export const downloadQuality = (payload, options) => {
  const {
    module = "quality",
    machine_list,
    model_list,
    part_name_list,
    batch,
    hold_qty,
    shift,
    shop_id,
    start_time,
    end_time,
    status,
  } = payload;
  var path = `/pressShop/${module}/report?shop_id=${shop_id}`;
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
  if (batch) {
    path += `&batch=${batch}`;
  }
  if (hold_qty) {
    path += `&hold_qty=${holdMapper[hold_qty]}`;
  }
  if (status) {
    path += `&status=${status}`;
  }
  return baseClient.get(path, options);
};

export const getQualityReasons = ({ shop_id, for_rework }) => {
  var path = `/pressShop/quality/reasons?shop_id=${shop_id}&for_rework=${for_rework}`;
  return baseClient.get(path);
};

export const getQualityReworkReasons = ({ shop_id }) => {
  var path = `/pressShop/rework/reasons?shop_id=${shop_id}`;
  return baseClient.get(path);
};
export const getQualityRecords = (id, module = "quality", shopId) => {
  var path = `/pressShop/${module}/records?punching_id=${id}&shop_id=${shopId}`;
  return baseClient.get(path);
};

export const updatePunching = ({ data, shop_id, punching_id }) => {
  var path = `pressShop/quality/punching?shop_id=${shop_id}&punching_id=${punching_id}`;
  return baseClient.put(path, data);
};

export const submitPunching = ({ shop_id, punching_id }) => {
  var path = `pressShop/quality/submit?shop_id=${shop_id}&punching_id=${punching_id}`;
  return baseClient.post(path);
};

export const getReasons = ({ shop_id, for_rework }) => {
  var path = `/pressShop/quality/reasons?shop_id=${shop_id}&for_rework=${qualityReasonMapper[for_rework]}`;
  return baseClient.get(path);
};

export const getTotalRework = (payload) => {
  const {
    machine_list,
    model_list,
    part_name_list,
    batch,
    status,
    shift,
    shop_id,
    start_time,
    end_time,
  } = payload;

  var path = `/pressShop/rework/total?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model=${model_list?.join(";")}`;
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
  if (batch) {
    path += `&batch=${batch}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (status) {
    path += `&status=${status}`;
  }
  return baseClient.get(path);
};

export const submitQuality = ({ shop_id, punching_id, module }) => {
  var path = `/pressShop/${module}/submit?shop_id=${shop_id}&punching_id=${punching_id}`;
  return baseClient.post(path);
};
export const updateRework = ({ data, shop_id, punching_id }) => {
  var path = `/pressShop/rework/updation?shop_id=${shop_id}&punching_id=${punching_id}`;
  return baseClient.put(path, data);
};
