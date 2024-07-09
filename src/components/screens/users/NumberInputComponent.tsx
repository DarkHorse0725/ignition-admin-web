import { Stack, Typography, TextField, useTheme } from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid-pro";
import { useGridApiContext } from "@mui/x-data-grid";

interface NumberInputComponentProps {
  props: GridRenderEditCellParams;
  setEditingRow: Function;
  errorMessage: string;
  maxLength?: number;
  type?: string;
}

export const NumberInputComponent = ({
  props,
  setEditingRow,
  errorMessage,
  maxLength,
}: NumberInputComponentProps) => {
  const { id, value, field, row } = props;
  const theme = useTheme();

  const apiRef = useGridApiContext();

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user

    // check if length is greater than 30, if so, return
    if (maxLength && newValue.length > maxLength) return;

    // only update the row if the value is an integer (no decimals), or if the value is empty
    if (newValue.match(/^(\s*|\d+)$/)) {
      setEditingRow({ ...row, [field]: newValue });
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    }
  };

  return (
    <Stack>
      <TextField
        sx={{
          padding: "4px 8px",
          marginTop: errorMessage ? "18px" : "0",
          marginLeft: 0,
          [`& .MuiInputBase-input`]: {
            color: errorMessage
              ? theme.palette.error.main
              : theme.palette.grey[500],
          },
          [`& .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiOutlinedInput-notchedOutline`]:
            {
              borderColor: errorMessage
                ? theme.palette.error.main
                : theme.palette.grey[300],
            },
        }}
        value={value}
        onChange={handleValueChange}
      />
      {errorMessage && (
        <Typography color="error.main" sx={{ marginLeft: 1, fontSize: "11px" }}>
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};
