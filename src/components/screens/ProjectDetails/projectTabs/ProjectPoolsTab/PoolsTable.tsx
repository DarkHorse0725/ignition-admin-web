import {
  SpreadSheet,
  TableHeader,
  TableRefresh,
  TableRefreshState,
} from "@/components/Table";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import {
  ColumnChooser,
  Grid,
  Table,
  TableColumnVisibility,
  TableHeaderRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import { formatDate, transformPoolName } from "@/helpers";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Template } from "@devexpress/dx-react-core";
import { LoadingButton } from "@mui/lab";
import { PoolStatus } from "@/types";
import { useDispatch } from "react-redux";
import { updatePools } from "@/store/features/projectDetailsSlice";
import { APIClient } from "@/core/api";
import { percentageFormat } from "./poolFunction";
import {
  getPermissionOfResource,
  PERMISSION,
  RESOURCES,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";

interface IPoolsTableProps {
  handleShowEditPool: () => void;
}
const apiClient = APIClient.getInstance();
export const PoolsTable = (props: IPoolsTableProps) => {
  const dispatch = useDispatch();
  const { handleShowEditPool } = props;
  const { current: projectDetails } = useSelectorProjectDetail();
  const { role } = useSelectorAuth();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_POOL
  );
  const { pools, totalRaise } = projectDetails;
  const [loading, setLoading] = useState<boolean>(false);
  const checkDisabledButton =
    pools[0].status === PoolStatus.CLOSED &&
    pools[1].status === PoolStatus.CLOSED;
  const refreshDataTable = async () => {
    setLoading(true);
    const response = await apiClient.projects.findOne(projectDetails._id);
    const { data } = response;
    dispatch(updatePools(data.pools));
    setLoading(false);
  };

  const getParticipantFee = (fee: number) => {
    return typeof fee === "number" ? `${fee}%` : "-";
  };

  const tableColumns: any = [
    {
      name: "_id",
      title: "ID",
      getCellValue: (row: any) => row._id,
    },
    {
      name: "poolId",
      title: "Pool ID",
      getCellValue: (row: any) =>
        row.contractId != undefined ? row.contractId : "-",
    },
    {
      name: "status",
      title: "Status",
      getCellValue: (row: any) => row.status?.toUpperCase() || "-",
    },
    {
      name: "label",
      title: "Label",
      getCellValue: (row: any) => {
        return (
          transformPoolName(row.name).charAt(0).toUpperCase() +
          transformPoolName(row.name).slice(1)
        );
      },
    },
    {
      name: "tierOpenTime",
      title: "Pool Open Time",
      getCellValue: (row: any) =>
        row.label === "CROWDFUNDING"
          ? formatDate(pools[0]?.galaxyEndTime) || "-"
          : formatDate(row.galaxyOpenTime) || "-",
    },
    {
      name: "endTime",
      title: "Pool End Time",
      getCellValue: (row: any) =>
        row.label === "CROWDFUNDING"
          ? formatDate(row.crowdfundingEndTime) || "-"
          : formatDate(row.galaxyEndTime) || "-",
    },
    {
      name: "poolRaisePercentage",
      title: "Pool Raise Percentage (over Total Raise) (%)",
      getCellValue: (row: any) => {
        const totalRaiseGalaxyPercentage: number =
          pools[0].galaxyRaisePercentage;
        const totalRaiseCrowdfundingPercentage: number =
          100 - pools[0].galaxyRaisePercentage;
        return row.label === "CROWDFUNDING"
          ? totalRaiseCrowdfundingPercentage && totalRaise
            ? percentageFormat(
                totalRaiseCrowdfundingPercentage,
                totalRaise * totalRaiseCrowdfundingPercentage
              )
            : "-"
          : totalRaiseGalaxyPercentage && totalRaise
          ? percentageFormat(
              totalRaiseGalaxyPercentage,
              totalRaise * totalRaiseGalaxyPercentage
            )
          : "-";
      },
    },
    {
      name: "earlyAccessPercentage",
      title: "Early Access Percentage (%)",
      getCellValue: (row: any) => {
        const overTotalRaiseCrowdfunding: number = totalRaise
          ? (totalRaise * (100 - pools[0]?.galaxyRaisePercentage)) / 100
          : NaN;
        return typeof row.earlyAccessPercentage === "number" && totalRaise
          ? percentageFormat(
              row.earlyAccessPercentage,
              overTotalRaiseCrowdfunding * row.earlyAccessPercentage
            )
          : "-";
      },
    },
    {
      name: "participantFee",
      title: "Participant Fee (%)",
      getCellValue: (row: any) =>
        row.label === "CROWDFUNDING"
          ? getParticipantFee(row.crowdfundingParticipantFee)
          : getParticipantFee(row.galaxyParticipantFee),
    },
  ];

  const tableColumnExtensions = [
    { columnName: "_id", width: 250 },
    { columnName: "poolId", width: 180 },
    { columnName: "status", width: 180 },
    { columnName: "label", width: 180 },
    { columnName: "tierOpenTime", width: 220 },
    { columnName: "endTime", width: 220 },
    { columnName: "poolRaisePercentage", width: 250 },
    { columnName: "earlyAccessPercentage", width: 250 },
    { columnName: "participantFee", width: 250 },
  ];
  return (
    <Box
      sx={{
        padding: "0 2rem",
        "& .MuiToolbar-root": {
          display: "flex",
          justifyContent: "flex-end",
        },
      }}
    >
      <Grid rows={pools} columns={tableColumns}>
        <Table
          tableComponent={SpreadSheet}
          columnExtensions={tableColumnExtensions}
          messages={{ noData: loading ? "Loading" : "No data" }}
        />
        <TableHeaderRow rowComponent={TableHeader} />
        <TableColumnVisibility />
        <Toolbar />

        <Template name="toolbarContent">
          {permissionOfResource.includes(PERMISSION.WRITE) && (
            <LoadingButton
              loading={loading}
              disabled={loading || checkDisabledButton}
              onClick={handleShowEditPool}
              sx={{ width: "120px", height: "26px", padding: "20px 0" }}
            >
              Edit Pools
            </LoadingButton>
          )}
        </Template>

        <ColumnChooser
          toggleButtonComponent={(props) => {
            return (
              <IconButton onClick={props.onToggle}>
                <VisibilityOffIcon color="primary" />
              </IconButton>
            );
          }}
        />
        <TableRefreshState action={() => refreshDataTable()} />
        <TableRefresh />
      </Grid>
    </Box>
  );
};
