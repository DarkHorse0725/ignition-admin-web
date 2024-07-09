import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import React, { ReactElement, useEffect, useState } from "react";
import ProjectTable from "@/components/screens/projects/projectTable";
import {
  Box,
  Button,
  DialogContentText,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { LayerIcon } from "@/components/icons";
import { useRouter } from "next/router";
import { PlusIcon } from "@/components/icons/PlusIcon";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth } from "@/store/hook";

const Projects: NextPageWithLayout = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const id = router.query?.id;
  const theme = useTheme();
  const { role } = useSelectorAuth();
  const permissionWithdraw = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  useEffect(() => {
    if (id && router.query.name) {
      setShowSuccessModal(true);
    }
  }, []);
  const handleCloseModalAlert = () => {
    resetQueryName();
    setShowSuccessModal(false);
  };
  const resetQueryName = () => {
    const { pathname, query } = router;
    delete query.name;

    router.replace({ pathname, query }, undefined, { shallow: true });
  };
  const handleContinueEditing = () => {
    resetQueryName();
    router.push(`/admin/projects/${router.query.id}`);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          ml: 2,
          mb: 2,
          borderRadius: "8px",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.primary.main,
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Projects
        </Typography>
        {permissionWithdraw.includes(PERMISSION.WRITE) && (
          <Box sx={{ display: "flex" }}>
            <IconButton onClick={() => router.push("/admin/projects/id")}>
              <PlusIcon />
            </IconButton>
            <Typography
              sx={{
                color: "white",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                paddingRight: "1rem",
              }}
              onClick={() => router.push("/admin/projects/id")}
            >
              Add new project
            </Typography>
          </Box>
        )}
      </Box>
      <ProjectTable />
      {/* Alert Create Project Successfully */}
      <Dialog
        open={showSuccessModal}
        onClose={handleCloseModalAlert}
        width="470px"
      >
        <DialogIcon>
          <LayerIcon />
        </DialogIcon>
        <DialogTitle>Thank you for adding a new project!</DialogTitle>
        <DialogContentText textAlign="center" sx={{ padding: "10px 20px" }}>
          <Typography variant="subtitle2">
            The new project with
            <Typography
              component="span"
              variant="subtitle2"
              sx={{ color: theme.palette.primary.main, padding: "0 10px" }}
            >
              Name: {router?.query.name}
            </Typography>
            is successfully created! You can now edit the project and add more
            details to it from the Project Lists page.
          </Typography>
        </DialogContentText>
        <DialogActions
          mt="10px"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 20px",
            gap: "20px",
          }}
        >
          <Button
            sx={{ width: "50%", fontSize: "14px" }}
            onClick={handleContinueEditing}
          >
            Continue editing
          </Button>
          <Button
            sx={{ width: "50%" }}
            color="secondary"
            onClick={handleCloseModalAlert}
          >
            Go to Project Lists
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Projects;
