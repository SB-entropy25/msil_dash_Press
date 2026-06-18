import { Box, DialogContent, Divider, Typography } from "@mui/material";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AreYouSure from "../../../../components/AreYouSure/AreYouSure";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton/SecondaryButton";
import DialogCard from "../../../../components/DialogCard/DialogCard.component";
import Loader from "../../../../components/Loader/Loader";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { selectReasons } from "../../../../redux/Selectors/QualitySelector";
import {
  getQualityRecords,
  submitPunching,
  updatePunching,
} from "../../../../Repository/QualityRepository";
import {
  MarutiBlack,
  MarutiBlue500,
  PressGreen,
  PressOreng,
  PressPink,
  Pressblue,
} from "../../../../utils/colors";
import {
  capitalizeFirstCharacter,
  formatDateTime,
  isNonNegativeInteger,
} from "../../../../utils/helperFunctions.utils";
import useStyles from "../../Quality.styles";
import RecordData from "../RecordData/RecordData";

const initialData = {
  idx: 1,
  quantity: "",
  evaluation: "",
  reason: "",
  reasonLabel: "",
  remark: "",
  updated_by: "-",
  updated_at: "-",
  is_deleted: false,
};
const PunchingDialogCard = ({
  open = false,
  onClose,
  row = {},
  onSubmitSuccess = () => {},
  withinTimeLimit = true,
  isSubmitted = false,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [punchingData, setPunchingData] = useState(
    isSubmitted || !withinTimeLimit ? [] : [initialData]
  );
  const [disable, setDisable] = useState({
    update: false,
    submit: true,
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [openSure, setOpenSure] = useState(false);
  const reasons = useSelector(selectReasons)?.PUNCHING;
  const shop = useSelector(getShop);

  const handleCloseSure = () => {
    setOpenSure(false);
  };
  const fetchRecords = () => {
    setDisable({
      update: false,
      submit: true,
    });
    setMetrics({});
    setLoading(true);
    getQualityRecords(row?.id, "quality", shop?.id)
      .then((res) => {
        var response = _.get(res, ["data"], []);
        const list = response?.records;
        setMetrics(response?.metrics);
        if (list?.length > 0 && reasons) {
          const data = list.map((item) => ({
            ...item,
            id: item.id,
            quantity: item.quantity,
            evaluation: capitalizeFirstCharacter(
              item.evaluation?.toLowerCase()
            ),
            reason: item.reason_id,
            reasonLabel: item.reason,
            remark: capitalizeFirstCharacter(item.remark?.toLowerCase()),
            updated_by: item.updated_by,
            updated_at: item.updated_at,
            reasonList: reasons[item?.evaluation]?.map((item) => {
              var firstKey = Object.keys(item)[0];
              return { value: firstKey, label: item[firstKey] };
            }),
            is_updated: true,
            is_deleted: false,
            disabled: isSubmitted || !withinTimeLimit,
          }));

          setPunchingData(data);
        }
        setDisable({
          update: isSubmitted,
          submit: isSubmitted,
        });
        setLoading(false);
      })
      .catch((ex) => {
        const params = {
          open: true,
          message: "Error fetching the records. Please try again.",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        setLoading(false);
        setDisable({
          update: true,
          submit: true,
        });
      });
  };
  useEffect(() => {
    if (row?.id) {
      fetchRecords();
    }
  }, [row, reasons]);

  const handleChange = (evt, idx) => {
    const { value, name } = evt.target;
    const data = _.cloneDeep(punchingData);
    if (name === "evaluation") {
      const res = reasons[value];
      const reasonList = res.map((item) => {
        var firstKey = Object.keys(item)[0];
        return { value: firstKey, label: item[firstKey] };
      });
      data[idx][name] = _.capitalize(value);
      data[idx]["reason"] = "";
      data[idx]["reasonLabel"] = "";
      data[idx].reasonList = reasonList;
      data[idx].isElvErr = false;
      setPunchingData(data);
    } else if (name == "quantity") {
      data[idx].isQntErr = false;
      var total = punchingData.reduce((a, c) => a + Number(c.quantity), 0);
      total = total - data[idx]["quantity"];
      if (isNonNegativeInteger(Number(value))) {
        if (Number(metrics?.prod_qty) >= Number(value) + total) {
          if (value < 1) {
            if (value === "") {
              data[idx][name] = value;
              setPunchingData(data);
              return;
            } else {
              const params = {
                open: true,
                message: "Quantity can't be less than 1",
                type: "ALERT",
              };
              dispatch(setApplicationAlert(params));
            }
          } else {
            data[idx][name] = value;
            setPunchingData(data);
            return;
          }
        } else {
          const params = {
            open: true,
            message: "You can not enter more than actual quantity",
            type: "ALERT",
          };
          dispatch(setApplicationAlert(params));
        }
      }
    } else if (name === "reason") {
      data[idx][name] = value?.value;
      data[idx].rsnErr = false;
      data[idx].reasonLabel = value?.label;
      setPunchingData(data);
    } else if (name == "remark") {
      data[idx][name] = value;
      data[idx].rmkErr = false;
      setPunchingData(data);
    } else {
      data[idx][name] = value;
      setPunchingData(data);
    }
  };

  const handleAddRow = () => {
    const punchingList = _.cloneDeep(punchingData);
    punchingList.push({
      idx: Math.floor(Math.random() * 100 + 1),
      quantity: "",
      is_deleted: false,
      evaluation: "",
      reason: "",
      remark: "",
      is_updated: false,
      disabled: false,
      updated_by: "",
      updated_at: "",
    });
    setPunchingData(punchingList);
  };

  const validationData = (punchingData) => {
    if (punchingData?.length === 1 && punchingData[0]?.quantity === "") {
      return true;
    }
    let errorData = punchingData.map((item) => ({
      ...item,
      isQntErr: item?.quantity ? false : true,
      isElvErr: item?.evaluation ? false : true,
      rsnErr: item?.reason ? false : true,
      rmkErr: item?.remark ? false : true,
    }));

    const total = punchingData.reduce((a, c) => a + Number(c.quantity), 0);
    if (total > Number(metrics?.prod_qty)) {
      const params = {
        open: true,
        message: "You can not enter more than actual quantity",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
      errorData = errorData.map((item) => ({ ...item, isQntErr: true }));
      return false;
    }

    setPunchingData([...errorData]);
    for (let index = 0; index < errorData.length; index++) {
      if (
        errorData[index].isQntErr ||
        errorData[index].isElvErr ||
        errorData[index].rsnErr ||
        errorData[index].rmkErr
      ) {
        return false;
      }
    }
    return true;
  };

  const onhandleUpdate = () => {
    setUpdateLoading(true);
    const isValid = validationData(punchingData);
    if (isValid) {
      const payload = {
        punching_list: [...punchingData]?.map((item) => ({
          id: Number(item.id) || null,
          quantity: Number(item.quantity),
          evaluation: item?.evaluation?.toUpperCase(),
          reason_id: Number(item.reason),
          remark: item.remark,
          is_updated: item?.is_deleted ? false : Number(item.id) ? true : false,
          is_deleted: item?.is_deleted,
        })),
      };
      updateApi(payload, "update");
    } else {
      setUpdateLoading(false);
    }
  };

  const updateApi = (payload, type) => {
    const data = {
      ...payload,
    };
    updatePunching({ data, shop_id: shop?.id, punching_id: Number(row?.id) })
      .then((res) => {
        var list = _.get(res, ["data"], []);
        if (type === "submit") {
          onSubmit();
        } else {
          setUpdateLoading(false);
          setDisable({
            update: false,
            submit: false,
          });
          const params = {
            open: true,
            message: "Record updated successfully",
            type: "SUCCESS",
          };
          dispatch(setApplicationAlert(params));
          fetchRecords();
        }
      })
      .catch((ex) => {
        setUpdateLoading(false);
        const params = {
          open: true,
          message: "Error updating the record",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  };

  const onSubmit = () => {
    submitPunching({
      shop_id: shop?.id,
      punching_id: Number(row?.id),
      module: "quality",
    })
      .then((res) => {
        var list = _.get(res, ["data"], []);
        setSubmitLoading(false);
        onSubmitSuccess();
        onClose();
        handleCloseSure();
      })
      .catch((ex) => {
        setSubmitLoading(false);
        const params = {
          open: true,
          message: "Error submitting the record",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
        onClose();
        handleCloseSure();
      });
  };

  const onhandleSubmit = () => {
    setSubmitLoading(true);
    const payload = {
      punching_list: [...punchingData]?.map((item) => ({
        id: Number(item.id) || null,
        quantity: Number(item.quantity),
        evaluation: item?.evaluation?.toUpperCase(),
        reason_id: Number(item.reason),
        remark: item.remark,
        is_updated: item?.is_deleted ? false : Number(item.id) ? true : false,
        is_deleted: item?.is_deleted,
      })),
    };
    updateApi(payload, "submit");
  };

  const handleAreYouSure = () => {
    const isValid = validationData(punchingData);
    if (isValid) {
      setOpenSure(true);
    } else {
      setOpenSure(false);
    }
  };

  const handleRemove = (item, idx) => {
    const data = _.cloneDeep(punchingData);
    if (item?.id) {
      data[idx].is_deleted = true;
      data[idx].is_updated = false;
      setPunchingData(data);
      return;
    }
    data.splice(idx, 1);
    setPunchingData(data);
  };

  const getMessage = () => {
    const total = punchingData.reduce((a, c) => a + Number(c.quantity), 0);
    const difference = Number(metrics?.prod_qty) - total;
    let message = "";
    if (Number(difference) > 0) {
      message = `Hold Qty: ${difference} will be OK Qty. \nAre you sure you want to Submit?`;
    } else {
      message = "Are you sure you want to Submit?";
    }
    return message;
  };

  const title = (
    <Box
      className={classes["container-flex"]}
      sx={{
        flex: "1",
        paddingRight: "1.7rem",
      }}
    >
      <Typography sx={{ flex: "1 0 0", fontWeight: 700 }} variant="body1">
        Quality Punching
      </Typography>
      <Box
        className={classes["card-container-flex"]}
        sx={{
          gap: 2,
        }}
      >
        <Box className={classes["card-container-flex"]}>
          <Typography variant="body1">Actual production Quantity:</Typography>
          <Typography
            sx={{
              color: MarutiBlack,
              fontWeight: "600",
              paddingLeft: "0.5rem",
            }}
          >
            {row?.prod_qty}
          </Typography>
        </Box>
        <Box className={classes["card-container-flex"]}>
          <Typography variant="body1">Batch ID:</Typography>
          <Typography
            sx={{
              color: MarutiBlack,
              fontWeight: "600",
              paddingLeft: "0.5rem",
            }}
          >
            {row?.batch_id}
          </Typography>
        </Box>

        <Box className={classes["card-container-flex"]}>
          <Typography variant="body1">Part Name:</Typography>
          <Typography
            sx={{
              color: MarutiBlack,
              fontWeight: "600",
              paddingLeft: "0.5rem",
            }}
          >
            {row?.part_name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  return (
    <>
      <DialogCard
        open={open}
        maxWidth={"md"}
        fullWidth={true}
        sx={{ color: MarutiBlue500, padding: "1.2rem" }}
        variant="h4"
        closable={true}
        handleClose={onClose}
        title={title}
      >
        <DialogContent sx={{ color: MarutiBlue500, padding: "1.2rem" }}>
          <Divider sx={{ mb: 1.2 }} />
          <Box
            component="span"
            className={classes["card-container-flex"]}
            sx={{ gap: 1 }}
          >
            <Box
              className={classes["prodigi-quality-info"]}
              sx={{ backgroundColor: Pressblue }}
            >
              <Typography sx={{ color: MarutiBlack }} variant="body1">
                Hold Qty:
              </Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.hold_qty || 0}
              </Typography>
            </Box>
            <Box
              className={classes["prodigi-quality-info"]}
              sx={{ backgroundColor: PressPink }}
            >
              <Typography variant="body1">Reject Qty:</Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.reject_qty || 0}
              </Typography>
            </Box>
            <Box
              className={classes["prodigi-quality-info"]}
              sx={{ backgroundColor: PressOreng }}
            >
              <Typography variant="body1">Rework Qty:</Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.rework_qty || 0}
              </Typography>
            </Box>
            <Box
              className={classes["prodigi-quality-info"]}
              sx={{ backgroundColor: PressGreen }}
            >
              <Typography variant="body1">Ok Qty:</Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.ok_qty || 0}
              </Typography>
            </Box>
          </Box>
          <Box className={classes["prodigi-dialog-data-container"]}>
            {loading && <Loader sx={{ pt: 1.2 }} />}
            {!loading &&
              punchingData.map((item, idx) => (
                <RecordData
                  key={idx}
                  item={item}
                  index={idx}
                  length={punchingData?.length}
                  reasons={reasons}
                  handleRemove={handleRemove}
                  handleChange={handleChange}
                />
              ))}
            {!loading && isSubmitted && (
              <Box component="span" className={classes["submit-id"]}>
                <Box className={classes["card-container-flex"]}>
                  <Typography sx={{ color: MarutiBlack }} variant="body1">
                    Submitted by Employee ID:
                  </Typography>
                  <Typography
                    sx={{
                      color: MarutiBlack,
                      fontWeight: "600",
                      paddingLeft: "0.5rem",
                    }}
                  >
                    {row?.submitted_by || "-"}
                  </Typography>
                </Box>

                <Box className={classes["card-container-flex"]}>
                  <Typography sx={{ color: MarutiBlack }} variant="body1">
                    Date:
                  </Typography>
                  <Typography
                    sx={{
                      color: MarutiBlack,
                      fontWeight: "600",
                      paddingLeft: "0.5rem",
                    }}
                  >
                    {formatDateTime(row?.submitted_at, "DD-MM-YY") || "-"}
                  </Typography>
                </Box>
              </Box>
            )}
            {!loading && !isSubmitted && !withinTimeLimit && (
              <Box component="span" className={classes["submit-id"]}>
                <Typography sx={{ color: MarutiBlack }} variant="body1">
                  Quality punching cannot be updated 100hrs after production.
                  Kindly contact shop admin.
                </Typography>
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 1.2 }} />
          <Box
            className={classes["card-container-flex"]}
            sx={{
              gap: 2,
            }}
          >
            <Box className={classes["add-row"]}>
              <Typography
                component="span"
                sx={{
                  cursor: "pointer",
                  visibility:
                    isSubmitted || !withinTimeLimit ? "hidden" : "visible",
                  maxWidth: "10rem",
                }}
                onClick={
                  !disable?.update &&
                  !isSubmitted &&
                  withinTimeLimit &&
                  handleAddRow
                }
              >
                + Add Row
              </Typography>
            </Box>
            <Box
              className={classes["card-container-flex"]}
              sx={{ gap: "1rem" }}
            >
              <SecondaryButton
                variant="contained"
                disabled={disable?.update || !withinTimeLimit || updateLoading}
                onClick={onhandleUpdate}
              >
                {updateLoading ? <Loader size="SMALL" /> : <>Update</>}
              </SecondaryButton>
              <PrimaryButton
                variant="outlined"
                disabled={disable?.submit || !withinTimeLimit}
                onClick={handleAreYouSure}
              >
                Submit
              </PrimaryButton>
            </Box>
          </Box>
        </DialogContent>
        {openSure && (
          <AreYouSure
            open={openSure}
            onClose={handleCloseSure}
            loading={submitLoading}
            onSubmit={onhandleSubmit}
            message={getMessage()}
          />
        )}
      </DialogCard>
    </>
  );
};
export default PunchingDialogCard;
