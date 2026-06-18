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
  submitQuality,
  updateRework,
} from "../../../../Repository/QualityRepository";
import {
  MarutiBlack,
  MarutiBlue500,
  PressGreen,
  PressOreng,
  PressPink,
  Pressblue,
  TypePrimary,
  TypeSecondary,
  TypeTertiary,
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

const ReworkDialogCard = ({
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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disable, setDisable] = useState({
    isUpdate: false,
    issubmit: true,
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [openSure, setOpenSure] = useState(false);

  const shop = useSelector(getShop);
  const reasons = useSelector(selectReasons)?.UPDATION;

  const handleCloseSure = () => {
    setOpenSure(false);
  };
  const fetchRecords = () => {
    setDisable({
      isUpdate: false,
      issubmit: true,
    });
    setLoading(true);
    setMetrics({});
    getQualityRecords(row?.id, "rework", shop?.id)
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
          const total = punchingData.reduce(
            (a, c) => a + Number(c.quantity),
            0
          );
          const condition = total !== Number(metrics?.rework_qty);
          setPunchingData(data);
          setDisable({
            isUpdate: isSubmitted,
            issubmit: isSubmitted || condition,
          });
        } else {
          setDisable({
            isUpdate: isSubmitted,
            issubmit: true,
          });
        }
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
          isUpdate: true,
          issubmit: true,
        });
      });
  };
  useEffect(() => {
    if (row?.id) {
      fetchRecords();
    }
  }, [row, reasons]);

  useEffect(() => {
    setRecords([]);
    getQualityRecords(row?.quality_id, "quality", shop?.id)
      .then((res) => {
        var list = _.get(res, ["data", "records"], []);
        if (list?.length > 0) {
          const filtered = list?.filter((x) => x?.evaluation === "REWORK");
          setRecords(filtered);
        } else {
          setRecords([]);
        }
      })
      .catch((ex) => {
        setRecords([]);
        const params = {
          open: true,
          message: "Error fetching submitted rework records.",
          type: "ERROR",
        };
        dispatch(setApplicationAlert(params));
      });
  }, [row]);

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
        if (Number(metrics?.rework_qty) >= Number(value) + total) {
          if (value < 1) {
            if (value === "") {
              data[idx][name] = value;
              setPunchingData(data);
              if (total === Number(metrics?.rework_qty)) {
                setDisable({ ...disable, issubmit: false });
              } else {
                setDisable({ ...disable, issubmit: true });
              }
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
            if (Number(value) + total === Number(metrics?.rework_qty)) {
              setDisable({ ...disable, issubmit: false });
            } else {
              setDisable({ ...disable, issubmit: true });
            }
            return;
          }
        } else {
          const params = {
            open: true,
            message: "You can not enter more than rework quantity",
            type: "ALERT",
          };
          dispatch(setApplicationAlert(params));
        }
      }
    } else if (name === "reason") {
      data[idx][name] = value?.value;
      data[idx].rsnErr = false;
      data[idx].reasonLabel = value?.label.toLowerCase();
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

  const validationData = (punchingData) => {
    let errorData = punchingData.map((item) => ({
      ...item,
      isQntErr: item?.quantity ? false : true,
      isElvErr: item?.evaluation ? false : true,
      rsnErr: item?.reason ? false : true,
      rmkErr: item?.remark ? false : true,
    }));

    const total = punchingData.reduce((a, c) => a + Number(c.quantity), 0);
    if (total > metrics?.rework_qty) {
      const params = {
        open: true,
        message: "You can not enter more than rework quantity",
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
        updation_list: [...punchingData]?.map((item) => ({
          id: Number(item.id) || null,
          quantity: Number(item.quantity),
          evaluation:
            item?.evaluation?.toUpperCase() === "RECYLCE"
              ? "RECYCLE"
              : item?.evaluation?.toUpperCase(),
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
    updateRework({ data, shop_id: shop?.id, punching_id: Number(row?.id) })
      .then((res) => {
        var list = _.get(res, ["data"], []);
        if (type === "submit") {
          onSubmit();
        } else {
          setUpdateLoading(false);
          const params = {
            open: true,
            message: "Record updated successfully",
            type: "SUCCESS",
          };
          dispatch(setApplicationAlert(params));
          setDisable({
            isUpdate: false,
            issubmit: false,
          });
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
    submitQuality({
      shop_id: shop?.id,
      punching_id: Number(row?.id),
      module: "rework",
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
      updation_list: [...punchingData]?.map((item) => ({
        id: Number(item.id) || null,
        quantity: Number(item.quantity),
        evaluation:
          item?.evaluation?.toUpperCase() === "RECYLCE"
            ? "RECYCLE"
            : item?.evaluation?.toUpperCase(),
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

  const title = (
    <Box
      className={classes["container-flex"]}
      sx={{
        flex: "1",
        paddingRight: "1.7rem",
      }}
    >
      <Typography sx={{ flex: "1 0 0", fontWeight: 700 }} variant="body1">
        Rework Updation
      </Typography>
      <Box
        className={classes["card-container-flex"]}
        sx={{
          gap: 2,
        }}
      >
        <Box className={classes["card-container-flex"]}>
          <Typography variant="body1">Actual Rework Quantity:</Typography>
          <Typography
            sx={{
              color: MarutiBlack,
              fontWeight: "600",
              paddingLeft: "0.5rem",
            }}
          >
            {metrics?.rework_qty || 0}
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
              sx={{ backgroundColor: PressOreng }}
            >
              <Typography variant="body1">Pending Rework Qty:</Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.pending_rework_qty || 0}
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
              sx={{ backgroundColor: Pressblue }}
            >
              <Typography sx={{ color: MarutiBlack }} variant="body1">
                Recycle Qty:
              </Typography>
              <Typography sx={{ fontWeight: "600", paddingLeft: "0.5rem" }}>
                {metrics?.recycle_qty || 0}
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
            {!loading &&
              records?.map((item, index) => (
                <Box className={classes["rework-employ-details-main"]}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "700",
                      color: TypeSecondary,
                      marginBottom: "1rem",
                    }}
                  >
                    Rework Punched
                  </Typography>
                  <Box key={index} className={classes["rework-employ-details"]}>
                    <Box sx={{ marginRight: "4.4rem", width: "12rem" }}>
                      <Typography
                        variant="body2"
                        sx={{ mb: "0.6rem", color: TypeTertiary }}
                      >
                        Employee Name
                      </Typography>
                      <Typography sx={{ color: TypePrimary }} variant="body1">
                        {item.created_by}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginRight: "4rem",
                        width: "17rem",
                        maxWidth: "17rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: "0.6rem", color: TypeTertiary }}
                      >
                        Rework Reason
                      </Typography>
                      <Typography sx={{ color: TypePrimary }} variant="body1">
                        {item.reason}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginRight: "4rem",
                        width: "17rem",
                        maxWidth: "17rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: "0.6rem", color: TypeTertiary }}
                      >
                        Rework Remark
                      </Typography>
                      <Typography sx={{ color: TypePrimary }} variant="body1">
                        {capitalizeFirstCharacter(item.remark)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginRight: "4rem",
                        width: "10rem",
                        maxWidth: "10rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: "0.6rem", color: TypeTertiary }}
                      >
                        Quantity:
                      </Typography>
                      <Typography sx={{ color: TypePrimary }} variant="body1">
                        {item.quantity}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        marginRight: "4rem",
                        width: "10rem",
                        maxWidth: "10rem",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: "0.6rem", color: TypeTertiary }}
                      >
                        Date:
                      </Typography>
                      <Typography sx={{ color: TypePrimary }} variant="body1">
                        {formatDateTime(item?.created_at, "DD-MM-YY") || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            {!loading && isSubmitted && (
              <Box className={classes["submit-id-main"]}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "700",
                    color: TypeSecondary,
                    marginBottom: "1rem",
                  }}
                >
                  Rework Updation
                </Typography>{" "}
                <Box component="span" className={classes["submit-id"]}>
                  <Box sx={{ marginRight: "4.4rem", width: "14rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: "0.6rem", color: TypeTertiary }}
                    >
                      Submitted by Employee ID:
                    </Typography>
                    <Typography sx={{ color: TypePrimary }} variant="body1">
                      {row?.submitted_by || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ marginRight: "4.4rem", width: "14rem" }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: "0.6rem", color: TypeTertiary }}
                    >
                      Date:
                    </Typography>
                    <Typography
                      sx={{
                        color: TypePrimary,
                      }}
                      variant="body1"
                    >
                      {formatDateTime(row?.submitted_at, "DD-MM-YY") || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {!loading && !isSubmitted && !withinTimeLimit && (
              <Box className={classes["submit-id-main"]}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "700",
                    color: TypeSecondary,
                    marginBottom: "1rem",
                  }}
                >
                  Rework Updation
                </Typography>{" "}
                <Box component="span" className={classes["submit-id"]}>
                  <Typography sx={{ color: TypePrimary }} variant="body1">
                    Rework updation cannot be updated 48hrs after production.
                    Kindly contact shop admin.
                  </Typography>
                </Box>
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
                  !disable?.isUpdate &&
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
                disabled={
                  disable?.isUpdate || !withinTimeLimit || updateLoading
                }
                onClick={onhandleUpdate}
              >
                {updateLoading ? <Loader size="SMALL" /> : <>Update</>}
              </SecondaryButton>
              <PrimaryButton
                variant="outlined"
                disabled={disable?.issubmit || !withinTimeLimit}
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
            message="Are you sure you want to Submit?"
          />
        )}
      </DialogCard>
    </>
  );
};
export default ReworkDialogCard;
