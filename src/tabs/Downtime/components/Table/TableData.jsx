import { TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckTextfield from "../../../../components/CheckTextfield/CheckTextfield";
import { setApplicationAlert } from "../../../../redux/Actions/AlertActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import { selectDowntimeRemarks } from "../../../../redux/Selectors/DowntimeSelector";
import { updateRemarks } from "../../../../Repository/DowntimeRepository";
import { getUser } from "../../../../services/auth";
import { formatDateTime } from "../../../../utils/helperFunctions.utils";

const TableData = ({ row = {}, columnWidth, index, onChange = () => {} }) => {
  const [remark, setRemark] = useState("");
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const shop = useSelector(getShop);
  const dispatch = useDispatch();
  const options = useSelector(selectDowntimeRemarks);

  const handleRemarkChange = (value) => {
    if (value !== "Other") {
      setComment(value);
      setRemark(value);
    } else {
      setRemark("Other");
      setComment("");
    }
  };

  const handleCommentChange = (value) => {
    setComment(value);
    setRemark("Other");
  };

  const handleRemarkSubmit = () => {
    const payload = {
      id: row?.id,
      shop_id: shop?.id,
      remarks: remark.trim(),
      comment: remark === "Other" ? comment.trim() : null,
    };
    if (comment !== null && comment.trim() === "") {
      const params = {
        open: true,
        message: "Please enter the remark",
        type: "ALERT",
      };
      dispatch(setApplicationAlert(params));
    } else {
      setLoading(true);
      updateRemarks(payload)
        .then((res) => {
          setDone(true);
          onChange(index, getUser()?.username);
          setLoading(false);
        })
        .catch((ex) => {
          const params = {
            open: true,
            message: "Error updating the remark",
            type: "ERROR",
          };
          dispatch(setApplicationAlert(params));
          setLoading(false);
          setComment("");
        });
    }
  };

  useEffect(() => {
    if (row?.remarks && row?.remarks !== "") {
      setComment(row?.remarks);
      setDone(true);
    }
  }, [row?.remarks]);

  return (
    <TableRow>
      <TableCell align="left" sx={{ width: columnWidth.machine }}>
        {row?.machine}
      </TableCell>
      <TableCell align="center" sx={{ width: columnWidth.model }}>
        {row?.model}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.part_name }}>
        {row?.part_name}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.start_time }}>
        {formatDateTime(row?.start_time, "DD-MM-YY | hh:mm:ss A")}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.end_time }}>
        {row?.end_time
          ? formatDateTime(row?.end_time, "DD-MM-YY | hh:mm:ss A")
          : "-"}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.duration }}>
        {row?.duration}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.reason }}>
        {row?.reason}
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.remarks }}>
        <CheckTextfield
          options={options[row?.reason]}
          remark={remark}
          value={comment}
          onChange={handleCommentChange}
          onSelectChange={handleRemarkChange}
          onSubmit={handleRemarkSubmit}
          done={done}
          loading={loading}
        />
      </TableCell>
      <TableCell align="left" sx={{ width: columnWidth.uploaded_by }}>
        {row?.updated_by}
      </TableCell>
    </TableRow>
  );
};
export default TableData;
