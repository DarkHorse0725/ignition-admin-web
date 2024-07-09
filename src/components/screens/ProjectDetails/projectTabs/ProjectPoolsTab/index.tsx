import React, { useState } from "react";
import { EditPoolStep } from "./EditPoolDialog";
import { PoolsTable } from "./PoolsTable";
import { Dialog, DialogIcon } from "@/components/atoms/Dialog";
import { WalletIcon } from "@/components/icons";
import { DialogContentText } from "@mui/material";
import { useSelectorProjectDetail } from "@/store/hook";
import { useDispatch } from "react-redux";
import { setOpenPoolDialog } from "@/store/features/projectDetailsSlice";
const ProjectPoolsTab = () => {
  const dispatch = useDispatch();
  const { isOpenPoolDialog } = useSelectorProjectDetail();
  const [isOpenNotAdminWalletDialog, setIsOpenNotAdminWalletDialog] =
    useState(false);
  return (
    <>
      <EditPoolStep
        openDialog={isOpenPoolDialog}
        handleCloseDialog={() => dispatch(setOpenPoolDialog(false))}
        setIsOpenNotAdminWalletDialog={setIsOpenNotAdminWalletDialog}
      />
      <PoolsTable
        handleShowEditPool={() => dispatch(setOpenPoolDialog(true))}
      />
      <Dialog
        open={isOpenNotAdminWalletDialog}
        onClose={() => setIsOpenNotAdminWalletDialog(false)}
        width="432px"
      >
        <DialogIcon>
          <WalletIcon />
        </DialogIcon>
        <DialogContentText textAlign={"center"} sx={{ pb: 2 }}>
          Your connected wallet is not in the Contract Admin List
          <br /> Please switch wallet to perform this action
        </DialogContentText>
      </Dialog>
    </>
  );
};

export default ProjectPoolsTab;
