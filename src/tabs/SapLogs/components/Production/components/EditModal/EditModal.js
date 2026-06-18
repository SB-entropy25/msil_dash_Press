import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateManualEditRepushApi } from "../../../../../../Repository/SapProductionRepository";
import PrimaryButton from "../../../../../../components/Buttons/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../../../components/Buttons/SecondaryButton/SecondaryButton";
import TertiaryButton from "../../../../../../components/Buttons/TertiaryButton/TertiaryButton";
import MuiDateTimePicker from "../../../../../../components/MuiDateTimePicker/MuiDateTimePicker";
import MultiSelectFilter from "../../../../../../components/MultiSelect/MultiSelectFilter";
import { setApplicationAlert } from "../../../../../../redux/Actions/AlertActions";
import {
  MarutiBlue200,
  MarutiBlue500,
  MarutiWhite,
} from "../../../../../../utils/colors";
import { editModalColumn } from "./EditModalColumn";
import EditTableData from "./EditTableData";
import useStyles from "../../../../SapLogs.styles";
import Loader from "../../../../../../components/Loader/Loader";

const modalStyle = {
  position: "absolute",
  borderRadius: "8px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  overflowY: "auto",
};

const EditModal = ({
  open,
  onClose,
  isEditData,
  modalData = {},
  filters = {},
  logsData = [],
  handleUpdateSuccess = () => {},
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([
    { ...modalData, isChecked: true },
  ]);

  const isBulkUpdate = useMemo(() => {
    return filters?.machines?.length === 1 && filters?.program_no?.length === 1;
  }, [filters]);

  const handleInputChange = useCallback((value, field, log) => {
    if (log?.isChecked) {
      setFilteredData((prev) =>
        prev.map((row) => (row.isChecked ? { ...row, [field]: value } : row))
      );
    } else {
      setFilteredData((prev) =>
        prev.map((row) =>
          row.id === log?.id ? { ...row, [field]: value } : row
        )
      );
    }
  }, []);

  const handleCheckboxChange = useCallback((id) => {
    const findLog = logsData.filter((item) => item.id === id);
    setFilteredData((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...(row?.isChecked ? findLog[0] : row),
              ["isChecked"]: !row?.isChecked,
            }
          : row
      )
    );
  }, []);

  const checkSame = (key, obj = {}) => {
    return modalData[key] === obj?.[key];
  };

  const showToast = (message, type = "ERROR") => {
    const params = { open: true, message: message, type: type };
    dispatch(setApplicationAlert(params));
  };

  const handleManualUpdate = () => {
    setLoading(true);
    let payload = {};
    const data = [...filteredData];
    payload = data.map((log) => {
      return {
        ...(isBulkUpdate && { log_id: modalData?.id }),
        ...(!checkSame("input_part_number1", log) && {
          input_part_number1: log?.input_part_number1,
        }),
        ...(!checkSame("input_part_number2", log) && {
          input_part_number2: log?.input_part_number2,
        }),
        ...(!checkSame("input1_material_batch_details", log) && {
          input1_material_batch_details: log?.input1_material_batch_details,
        }),
        ...(!checkSame("input2_material_batch_details", log) && {
          input2_material_batch_details: log?.input2_material_batch_details,
        }),
      };
    });
    let endpoint = "";
    const logIds = filteredData?.map((item) => item.id)?.toString();
    if (isBulkUpdate) {
      if (isEditData) {
        endpoint = "repush-edit-bulk";
      } else {
        payload = {};
        endpoint = `repush-bulk?log_id=${logIds}`;
      }
    } else {
      if (isEditData) {
        endpoint = `repush-edit?log_id=${logIds}`;
        payload = payload[0];
      } else {
        payload = {};
        endpoint = `repush?log_id=${logIds}`;
      }
    }
    updateManualEditRepushApi(endpoint, payload)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          showToast("Production data sync is in progress.", "SUCCESS");
          handleUpdateSuccess();
        } else {
          showToast("Something went wrong.");
        }
      })
      .catch((err) => {
        setLoading(false);
        showToast("Something went wrong.");
      });
  };

  const handleReset = () => {
    setFilteredData([{ ...modalData, isChecked: true }]);
    setShowAll(false);
  };

  const updateLogsData = (isShow) => {
    const filter = logsData
      ?.filter((item) => item?.id !== modalData?.id)
      .map((temp) => {
        return { ...temp, isChecked: true };
      });
    const dLog = filteredData
      ?.filter((item) => item?.id === modalData?.id)
      .map((temp) => {
        return { ...temp, isChecked: true };
      });
    setFilteredData(isShow ? [...filteredData, ...filter] : dLog);
  };

  const getTableHeader = () => {
    let left = 0;
    let fixedCount = 0;
    return (
      <TableHead>
        <TableRow>
          {Object.entries(editModalColumn).map(([columnId, column]) => {
            const isFixed = column.fixed;
            let headerStyle = {
              position: "sticky",
              zIndex: isFixed ? 3 : 2,
              backgroundColor: MarutiWhite,
              wordWrap: "break-word",
              overflowWrap: "anywhere",
              width: `${column.width}vw`,
              minWidth: `${column.width}vw`,
              maxWidth: `${column.width}vw`,
              borderRight: "1px solid #E6E9F0",
            };

            if (isFixed) {
              headerStyle = {
                ...headerStyle,
                position: "sticky",
                left: `${left}vw`,
              };
              left += column.width;
              fixedCount += 1;

              if (fixedCount === 5) {
                headerStyle.borderRight = "4px solid #E6E9F0";
                headerStyle.boxShadow = "1px 0px 1px -1px rgba(0, 0, 0, 0.2)";
              }
            }
            if (columnId === "checkbox") {
              return (
                <TableCell padding="checkbox" sx={headerStyle}>
                  <Checkbox disabled size={"large"} />
                </TableCell>
              );
            }

            return (
              <TableCell key={columnId} align="left" sx={headerStyle}>
                <div>{column.name}</div>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" mb={2} sx={{ color: "#66696B" }}>
          Edit Production Details
        </Typography>

        <Divider />
        <Box display="flex" gap={2} flexWrap="wrap" mb={2} mt={2}>
          <Box>
            <MultiSelectFilter
              disabled={true}
              values={filters?.machines}
              onChange={() => {}}
              label="Machine"
            />
          </Box>
          <Box>
            <MultiSelectFilter
              disabled={true}
              values={filters?.program_no}
              onChange={() => {}}
              label="Program No."
            />
          </Box>
          <MuiDateTimePicker
            label="Start Time"
            value={filters?.start_time}
            disabled
          />
          <MuiDateTimePicker
            label="End Time"
            value={filters?.end_time}
            disabled
          />
          <Box>
            <MultiSelectFilter
              disabled={true}
              values={["Failure"]}
              onChange={() => {}}
              label="Status"
            />
          </Box>
          <Box>
            <MultiSelectFilter
              disabled={true}
              values={filters?.shifts}
              onChange={() => {}}
              label="Shift"
            />
          </Box>
        </Box>

        {isBulkUpdate && logsData?.length > 1 ? (
          <Typography variant="body1" mb={1} color="#4B4B4B">
            {`${logsData?.length} rows with similar data fetched`}
            <Typography
              variant="body1"
              component="span"
              onClick={() => {
                updateLogsData(!showAll);
                setShowAll((prev) => !prev);
              }}
              sx={{
                cursor: "pointer",
                color: MarutiBlue500,
                ml: 1,
                textDecoration: "underline",
              }}
            >
              {showAll ? "Show Less" : "Show All"}
            </Typography>
          </Typography>
        ) : null}

        <Box
          sx={{
            mt: 1.4,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              overflow: "auto",
            }}
          >
            <Table size="small" stickyHeader aria-label="sticky table">
              {getTableHeader()}
              <TableBody>
                {filteredData?.map((row) => (
                  <EditTableData
                    key={row.id}
                    tableData={row}
                    isEditData={isEditData}
                    isBulkUpdate={isBulkUpdate}
                    handleInputChange={handleInputChange}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <TertiaryButton onClick={onClose} disabled={loading}>
            Cancel
          </TertiaryButton>
          <SecondaryButton onClick={handleReset} disabled={loading}>
            Reset
          </SecondaryButton>
          {loading ? (
            <Box
              sx={{
                backgroundColor: MarutiBlue200,
                width: "10rem",
                borderRadius: "0.4rem",
              }}
            >
              <Loader size="SMALL" />
            </Box>
          ) : (
            <PrimaryButton onClick={handleManualUpdate} disabled={loading}>
              {isEditData
                ? `${isBulkUpdate && showAll ? "Bulk Edit" : "Repush/Submit"}`
                : `${isBulkUpdate && showAll ? "Bulk Repush" : "Repush"}`}
            </PrimaryButton>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
