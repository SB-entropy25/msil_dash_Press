import { baseClient } from "./BaseRepository";

export const fetchMachines = (id) => {
  const path = `/pressShop/machines?shop_id=${id}`;
  return baseClient.get(path);
};

export const fetchProduction = ({ equipment_id, shop_id }) => {
  const path = `/pressShop/production?equipment_id=${equipment_id}&shop_id=${shop_id}`;
  return baseClient.get(path);
};

export const fetchInputs = ({ parts, shop_id, equipment_id, program_no }) => {
  const path = `/pressShop/part/input?parts=${parts?.join(";")}&shop_id=${shop_id}&equipment_id=${equipment_id}&program_no=${program_no}`;
  return baseClient.get(path);
};

export const submitProduction = ({
  production_id,
  shop_id,
  machine_name,
  program_number = "",
  body,
}) => {
  const path = `/pressShop/production?production_id=${production_id}&shop_id=${shop_id}&machine_name=${machine_name}&program_number=${program_number}`;
  return baseClient.post(path, body);
};

export const pauseProduction = ({ production_id, shop_id }) => {
  const path = `/pressShop/production/update?production_id=${production_id}&shop_id=${shop_id}`;
  return baseClient.put(path);
};

export const fetchProductionParts = ({ production_id, shop_id }) => {
  const path = `/pressShop/production/part-data?production_id=${production_id}&shop_id=${shop_id}`;
  return baseClient.get(path);
};

export const updateInputMaterials = ({ shop_id, body }) => {
  const path = `/pressShop/production/material-update?shop_id=${shop_id}`;
  return baseClient.put(path, body);
};

export const changeVariant = (body) => {
  const path = `/pressShop/production/variant`;
  return baseClient.put(path, body);
};
