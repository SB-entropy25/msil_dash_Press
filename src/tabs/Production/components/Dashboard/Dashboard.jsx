import { Box } from "@mui/material";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReasons } from "../../../../redux/Actions/QualityActions";
import { getShop } from "../../../../redux/Reducers/PressShopReducer";
import useStyles from "../../Production.styles";
import DashboardCard from "../DashboardCard/DashboardCard";

const Dashboard = ({
  parts = [],
  production = {},
  loading = {},
  onVariantChange = () => {},
  machine = {},
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const shop = useSelector(getShop);

  useEffect(() => {
    if (!_.isEmpty(shop) && shop?.id) {
      const obj = {
        shop_id: shop?.id,
        for_rework: "PUNCHING",
      };
      dispatch(fetchReasons(obj));
    }
  }, [shop]);

  const toggleSyncing = () => {};

  return (
    <>
      <Box
        className={classes["container-flex-h-start"]}
        sx={{ gap: "2rem !important", flex: 1, overflow: "hidden" }}
      >
        <DashboardCard
          production={production}
          card={parts[0]}
          part="part_1"
          loading={loading?.part1}
          onVariantChange={onVariantChange}
          machine={machine}
          toggleSyncing={toggleSyncing}
        />
        <DashboardCard
          production={production}
          card={parts[1]}
          part="part_2"
          loading={loading?.part2}
          onVariantChange={onVariantChange}
          machine={machine}
          toggleSyncing={toggleSyncing}
        />
      </Box>
    </>
  );
};
export default Dashboard;
