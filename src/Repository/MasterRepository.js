
  import { getBearerToken } from "../services/auth";
import { baseClient } from "./BaseRepository";

const fetchMasterData = (payload) => {
  var path = `pressShop/master/details?shop_id=${payload?.shop_id}`;
  return baseClient.get(path);
};

const uploadMaster = (payload) => {
  var path = `pressShop/master/upload`;
  const token = getBearerToken();
  let options = {
    headers: {
      shop_id: payload.shop_id,
      shop_name: payload.shop_name,
      Authorization: token,
    },
  };
  return baseClient.post(path, payload.file, options);
};
const saveDetails = (payload) => {
  var path = `pressShop/master/upload/details-save?`;
  path = path + `shop_id=${payload.shop_id}&`;
  path = path + `shop_name=${payload.shop_name}&`;
  path = path + `plant_name=${payload.plant_name}&`;
  path = path + `module_name=${payload.module_name}&`;
  path = path + `uploader_id=${payload.uploader_id}&`;
  path = path + `uploader_name=${payload.uploader_name}&`;
  path = path + `uploader_email=${payload.uploader_email}&`;
  path = path + `reviewer_id=${payload.reviewer_id}&`;
  path = path + `reviewer_name=${payload.reviewer_name}&`;
  path = path + `reviewer_email=${payload.reviewer_email}&`;
  path = path + `file_name=${payload.file_name}&`;
  path = path + `file_path=${payload.file_path}&`;
  path = path + `siteName=${payload.site_name}&`;
  path = path + `location=${payload.location_name}`;
  return baseClient.post(path);
};

const downloadMaster = (payload, options) => {
  var path = `/pressShop/master/download?shop_id=${payload.shop_id}&file_name=${payload.file_name}`;
  return baseClient.get(path, options);
};

export { downloadMaster, fetchMasterData, saveDetails, uploadMaster };
