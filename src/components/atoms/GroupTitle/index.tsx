import { Typography, styled } from "@mui/material";

export const GroupTitle = styled(Typography)(({ theme }) => ({
  padding: "24px 15px",
  borderRadius: "8px",
  backgroundColor: `${theme.palette.primary.main}12`,
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.primary.main,
}));
