import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { AlertTitle, Alert, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { AlertTypes } from "@/types";
import { CheckCircleOutline, InfoOutlined } from "@mui/icons-material";
import { useAlertContext } from "@/providers/AlertContext";

const StyledAlert = styled(Alert)(({ theme }) => ({
  color: theme.palette.text.disabled,
  whiteSpace: "pre-line",
  alignItems: "center",
  "& .MuiAlert-icon": {
    padding: 0,
    fontSize: 18,
  },
  "& .MuiAlert-action": {
    paddingTop: 0,
  },
  "& .MuiAlert-message": {
    padding: 0,
    overflow: "visible",
  },
  "&.MuiAlert-standardWarning": {
    backgroundColor: theme.palette.warning.light,
    border: `solid 2px ${theme.palette.warning.main}`,
    width: 229,
    padding: "5px 10px",
  },
  "&.MuiAlert-standardError": {
    backgroundColor: theme.palette.error.light,
    border: `solid 2px ${theme.palette.error.main}`,
    width: 229,
    padding: "5px 10px",
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: theme.palette.success.light,
    border: `solid 2px ${theme.palette.success.main}`,
    width: 229,
    padding: "5px 10px",
  },
}));

export const AlertField: React.FC = (): JSX.Element => {
  const { open, closeAlert, message, title, type } = useAlertContext();
  const handleAlertClose = () => {
    closeAlert();
  };

  const alertMessage =
    message instanceof Array
      ? message
          .map((msg) => {
            if (msg.length && msg.includes(".")) {
              const [message1, message2] = msg.split(".");
              return message1.length > message2.length ? message1 : message2;
            }
            return msg;
          })
          .join("\n\n")
      : message;

  return (
    <Snackbar
      open={open}
      autoHideDuration={type === AlertTypes.SUCCESS ? 6000 : 12000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <StyledAlert
        iconMapping={{
          success: <CheckCircleOutline />,
          warning: <InfoOutlined />,
          error: <InfoOutlined />,
        }}
        onClose={handleAlertClose}
        severity={type}
      >
        <AlertTitle color="grey.900" sx={{ margin: 0, fontWeight: 600 }}>
          {title}
        </AlertTitle>
        <Typography color="grey.900">{alertMessage}</Typography>
      </StyledAlert>
    </Snackbar>
  );
};
