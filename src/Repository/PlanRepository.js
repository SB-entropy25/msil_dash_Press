import { correctUrl } from "../utils/helperFunctions.utils";
import { baseClient } from "./BaseRepository";

export const downloadReport = (payload, options) => {
  var path = `/pressShop/plan/download?shop_id=${payload.shop_id}&shop_name=${payload.shop_name}&date=${payload.date}`;
  return baseClient.get(path, options);
};

export const downloadPlan = (payload, options) => {
  const {
    shop_id,
    machine_list,
    model_list,
    part_name_list,
    pe_code_list,
    production_date_list,
    shift,
    priority,
    status,
    sort_priority,
  } = payload;
  var path = `/pressShop/plan/report?shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (pe_code_list) {
    path += `&pe_code_list=${pe_code_list?.join(";")}`;
  }
  if (production_date_list) {
    path += `&production_date_list=${production_date_list?.join(";")}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (priority) {
    path += `&priority=${priority}`;
  }
  if (status) {
    path += `&status=${status}`;
  }
  if (sort_priority && sort_priority !== null) {
    path += `&sort_priority=${sort_priority}`;
  }
  return baseClient.get(correctUrl(path), options);
};

export const getPlan = (payload) => {
  const {
    shop_id,
    machine_list,
    model_list,
    part_name_list,
    pe_code_list,
    production_date_list,
    shift,
    priority,
    status,
    sort_priority,
    initiate_production,
    page_no = 1,
    page_size = 20,
  } = payload;
  var path = `/pressShop/plan?page_no=${page_no}&page_size=${page_size}&shop_id=${shop_id}`;
  if (machine_list) {
    path += `&machine_list=${machine_list?.join(";")}`;
  }
  if (model_list) {
    path += `&model_list=${model_list?.join(";")}`;
  }
  if (part_name_list) {
    path += `&part_name_list=${part_name_list?.join(";")}`;
  }
  if (pe_code_list) {
    path += `&pe_code_list=${pe_code_list?.join(";")}`;
  }
  if (production_date_list) {
    path += `&production_date_list=${production_date_list?.join(";")}`;
  }
  if (shift) {
    path += `&shift=${shift}`;
  }
  if (priority) {
    path += `&priority=${priority}`;
  }
  if (status) {
    path += `&status=${status}`;
  }
  if (sort_priority && sort_priority !== null) {
    path += `&sort_priority=${sort_priority}`;
  }
  if (initiate_production) {
    path += `&initiate_production=${initiate_production}`;
  }
  return baseClient.get(path);
};

export const uploadPlan = (payload) => {
  const { shop_id, shop_name } = payload;
  var path = `pressShop/plan/upload?shop_id=${shop_id}&shop_name=${shop_name}`;
  return baseClient.get(path);
};

export const getPlanStatus = (payload) => {
  const { shop_id } = payload;
  var path = `/pressShop/plan/status?shop_id=${shop_id}`;
  return baseClient.get(path);
};
