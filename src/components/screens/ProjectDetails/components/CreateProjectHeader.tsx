import { setProposalStatus } from "@/store/features/projectDetailsSlice";
import { ProposalStatus } from "@/types";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const CreateProjectHeader = () => {
  const routeProjectList = "/admin/projects";
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProposalStatus(ProposalStatus.NotFound));
  }, [dispatch]);
  const handleCancel = () => {
    router.push(
      {
        pathname: routeProjectList,
        query: { name: "" },
      },
      routeProjectList
    );
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
          Create Project
        </Typography>
        <Button
          onClick={handleCancel}
          color="warning"
          sx={{
            width: "110px",
            height: "40px",
          }}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
};
