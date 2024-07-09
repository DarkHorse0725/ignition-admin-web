import React from "react";

import { Form, Formik, FormikHelpers } from "formik";
import { withdrawValidationSchema } from "./withdrawValidationSchema";
import InputField from "@/components/atoms/InputField";
import { Box, Button, DialogContentText, useTheme } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogIcon,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { WalletIcon } from "@/components/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: any, helpers: FormikHelpers<any>) => void;
};

export default function EnterWalletDialog({ open, onClose, onConfirm }: Props) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} width="400px">
      <Formik
        validationSchema={withdrawValidationSchema}
        initialValues={{ walletAddress: "" }}
        validateOnBlur={false}
        onSubmit={(values, helpers) => onConfirm(values, helpers)}
      >
        {({ errors, values, handleBlur, setFieldTouched, setFieldValue }) => {
          return (
            <Form>
              <Box sx={{ px: "12px", py: "4px" }}>
                <DialogIcon>
                  <WalletIcon />
                </DialogIcon>
                <DialogTitle
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    letterSpacing: "0.02em",
                    textAlign: "center",
                  }}
                >
                  Enter Wallet Address
                </DialogTitle>

                <DialogContentText
                  sx={{
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "17px",
                    pb: 1,
                  }}
                >
                  You are about to withdraw funds from the IDO pool.
                  <br />
                  Please enter the receiving wallet address to proceed
                </DialogContentText>
                <InputField
                  sx={{
                    "& .MuiInputBase-input": {
                      p: "4.5px",
                    },
                    width: 1,
                    borderRadius: "4px",
                  }}
                  name="walletAddress"
                  value={values.walletAddress}
                  onBlur={handleBlur}
                  onChange={(e: any) => {
                    if (e.target.value.length > 100) {
                      e.preventDefault();
                      return;
                    }
                    setFieldValue("walletAddress", e.target.value);
                    setFieldTouched("walletAddress", true, false);
                  }}
                />

                <DialogActions
                  sx={{
                    display: "flex",
                    gap: "15px",
                    marginTop: 1.5,
                  }}
                >
                  <Button
                    color="secondary"
                    sx={{
                      width: 1 / 2,
                      height: "40px",
                      textTransform: "none",
                      color: "white",
                    }}
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      onClose && onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type={"submit"}
                    variant="contained"
                    size="large"
                    sx={{
                      width: 1 / 2,
                      height: "40px",
                      backgroundColor: theme.palette.primary.main,
                      textTransform: "none",
                    }}
                    disabled={!!errors.walletAddress}
                  >
                    Continue
                  </Button>
                </DialogActions>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
