import { Stack, Typography, useTheme } from "@mui/material";
import { SnapshotTabIcon } from "@/components/icons";

export const NoResultsOverlay = () => {
  const theme = useTheme();
  return (
    <Stack
      height="100%"
      alignItems="center"
      justifyContent="center"
      sx={{ paddingTop: "86px" }}
    >
      <SnapshotTabIcon color={theme.palette.text.secondary} size={40} />
      <Typography
        color="text.secondary"
        fontWeight={700}
        fontSize={14}
        mt="12px"
      >
        There is no snapshot record to show
      </Typography>
    </Stack>
  );
};
