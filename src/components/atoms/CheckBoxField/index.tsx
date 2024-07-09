import React from "react";
import { ErrorMessage, Field } from "formik";
import { Box, styled, useTheme, Checkbox } from "@mui/material";
interface CheckBoxProps {
  label: string;
  name: string;
  disabled?: boolean;
}

const StyledLabel = styled("label")(({ theme }) => ({
  color: theme.palette.common.white,
}));

export const CheckboxField: React.FC<CheckBoxProps> = ({
  label,
  name,
  disabled,
}): JSX.Element => {
  const theme = useTheme();
  return (
    <Box sx={{ margin: "20px", marginLeft: "12px" }}>
      <StyledLabel>
        <Field
          name={name}
          type="checkbox"
          as={Checkbox}
          disabled={disabled}
          sx={{
            "&.Mui-disabled": {
              color: `${theme.palette.grey[200]} !important`,
            },
            "&.MuiCheckbox-root": {
              color: theme.palette.primary.main,
            },
          }}
        />
        {label}
      </StyledLabel>
      <Box
        sx={{
          marginLeft: "10px",
          marginTop: "4px",
          fontSize: "12px",
          color: theme.palette.error.main,
        }}
      >
        <ErrorMessage name={name} />
      </Box>
    </Box>
  );
};
