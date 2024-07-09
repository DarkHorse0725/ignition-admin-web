import { Box, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SnapshotTable from "./SnapshotTable";
import SubmitStatusIndicator from "./SubmitStatusIndicator";
import { detectPools } from "@/helpers";
import { AppDispatch } from "@/store";
import { EProjectAsyncStatus, ProjectStatus, SnapshotRecord } from "@/types";
import { useDispatch } from "react-redux";
import { APIClient } from "@/core/api";
import InitialSnapshotTime from "./InitialSnapshotTime";
import { InputSearch } from "@/components/atoms/InputSearch";
import { GridRowModes, GridRowModesModel } from "@mui/x-data-grid-pro";
import { randomId } from "@mui/x-data-grid-generator";
import { SUCCESS_EVENTS, useSocket } from "@/providers/SocketContext";
import { useSelectorProjectDetail } from "@/store/hook";

export enum ACTIONS {
  ADD_NEW = "addNew",
  EDIT = "edit",
}

const ProjectSnapshotTab = () => {
  const { current: projectDetails } = useSelectorProjectDetail();
  const { socket } = useSocket();
  const {
    deploy_status,
    status,
    submit_snapshot_status,
    pools,
    _id: projectId,
  } = projectDetails;
  const [records, setRecords] = useState<SnapshotRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isEditingRecord, setIsEditingRecord] = useState<boolean>(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isSubmitting, setIsSubmitting] = useState(
    submit_snapshot_status === EProjectAsyncStatus.PRCOCESSING,
  );
  const [submittingTime, setSubmittingTime] = useState<Date | undefined>(
    undefined,
  );

  const apiClient = APIClient.getInstance();

  const [totalRecords, setTotalRecords] = useState(0);

  const [action, setAction] = useState<ACTIONS>();

  const {
    galaxyPool: { galaxyOpenTime },
    crowdfundingPool: { crowdfundingEndTime },
  } = detectPools(pools);

  const liveProject = status === ProjectStatus.LIVE;

  const isEditingTime = useMemo(() => {
    if (!galaxyOpenTime) return false;
    return (
      liveProject && submit_snapshot_status === EProjectAsyncStatus.PENDING
    );
  }, [liveProject, submit_snapshot_status, galaxyOpenTime]);

  const isSubmittingTime = useMemo(() => {
    if (!(galaxyOpenTime && crowdfundingEndTime)) return false;

    return liveProject;
  }, [crowdfundingEndTime, liveProject, galaxyOpenTime]);

  const getSubmitTime = async (projectId: string) => {
    try {
      const { data } = await apiClient.snapshot.getSnapshotTime(projectId);
      if (data) setSubmittingTime(new Date(data));
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async (
    currentPage: number,
    pageSize: number,
    searchText: string,
    sortField?: string,
    direction?: "asc" | "desc",
  ) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.snapshot.list(projectId, {
        page: currentPage,
        limit: pageSize,
        email: searchText,
        sort: sortField || "snapShotData",
        direction,
      });
      const { result, total } = data;
      setTotalRecords(total);
      setRecords(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      getSubmitTime(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (!(socket && projectId)) return;

    socket.on(SUCCESS_EVENTS.AUTO_GENERATE_SNAPSHOT_DATA_SUCCESS, (_res) => {
      loadData(1, 10, "");
    });

    return () => {
      socket.off(SUCCESS_EVENTS.AUTO_GENERATE_SNAPSHOT_DATA_SUCCESS);
    };
  }, [socket, projectId]);

  const handleAddRecord = () => {
    setAction(ACTIONS.ADD_NEW);
    const id = randomId();
    setRecords((oldRows) => [
      {
        _id: id,
        allocationValue: "",
        email: "",
        galaxyMaxBuy: 0,
        kycStatus: false,
        maxBuy: 0,
        numberOfAllocation: "",
        project: "",
        userType: 0,
        walletAddress: "",
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "email" },
    }));
    setIsEditingRecord(true);
  };

  const isSnapshotted = totalRecords > 0;

  return (
    <Box mt="5px">
      <SubmitStatusIndicator isSubmittingTime={isSubmittingTime} />
      <Stack
        mt="10px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <InitialSnapshotTime
          isSubmittingTime={isSubmittingTime}
          isEditingTime={isEditingTime}
          totalRecords={totalRecords}
          disableSubmitButton={
            isEditingRecord || deploy_status != EProjectAsyncStatus.SUCCESS
          }
          submittingTime={submittingTime}
          isEditingRecord={isEditingRecord}
          handleAddRecord={handleAddRecord}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          isSnapshotted={isSnapshotted}
        />
        {isSnapshotted && (
          <InputSearch
            placeholder="Search by Account"
            getMessage={() => {}}
            onValueChange={(value) => {
              setSearchValue(value);
            }}
          />
        )}
      </Stack>

      <SnapshotTable
        action={action}
        setAction={setAction}
        setRecords={setRecords}
        records={records}
        loadData={loadData}
        rowCount={totalRecords}
        isLoading={isLoading}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        isEditingRecord={isEditingRecord}
        setIsEditingRecord={setIsEditingRecord}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        isDisableEditMode={!isEditingTime || isSubmitting}
      />
    </Box>
  );
};

export default ProjectSnapshotTab;
