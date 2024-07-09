import WarningIcon from "@/components/icons/WarningIcon";
import {
  Box,
  List,
  ListItem,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React from "react";

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 700,
  fontSize: "14px",
}));

const AutoSnapshotError = () => {
  const theme = useTheme();
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{ minHeight: 350 }}
    >
      <Stack direction={"column"} alignItems={"center"} gap={1}>
        <WarningIcon color={theme.palette.grey[500]} width={40} height={40} />
        <Box
          sx={{
            fontSize: 14,
            lineHeight: "22px",
          }}
        >
          <Text>
            Initial Snapshot can not be taken due to Project’s contract has not
            been deployed
          </Text>
          <Text>Next Steps:</Text>

          <List
            sx={{
              listStyleType: "disc",
              color: theme.palette.text.secondary,
              p: 0,
              "& .MuiListItem-root": {
                display: "list-item",
                ml: 5,
                p: "4px",
              },
            }}
          >
            <ListItem>
              <Text>
                Extend EarlyPool Open Time to at least 30 hours after the
                current date time
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                Deploy the Project’s contract at 25 hours prior to the EarlyPool
                Open Time
              </Text>
            </ListItem>
          </List>
        </Box>
      </Stack>
    </Box>
  );
};

export default AutoSnapshotError;
