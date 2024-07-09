import { styled } from "@mui/material";
import { DataGridPro, gridClasses } from "@mui/x-data-grid-pro";

export const DataGridContainer = styled(DataGridPro)(({ theme }) => ({
  [`& .${gridClasses.main}`]: {
    padding: "21px 30px 21px 10px",
    backgroundColor: theme.palette.background.default,
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  [`& .MuiDataGrid-withBorderColor`]: {
    borderRadius: "8px",
  },
  [`& .MuiDataGrid-pinnedColumns`]: {
    backgroundImage: "none",
  },
  [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
    outline: "none"
  },
  [`& .MuiDataGrid-columnHeaderTitle`]: {
    fontSize: "12px",
  },
  [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
    outline: "none"
  },
  [`& .MuiDataGrid-cell--editing:focus-within`]: {
    outline: "none !important",
  },
  [`& .${gridClasses.toolbarContainer}`]: {
    padding: 0
  },
  [`& .${gridClasses.cell}`]: {
    border: "none",
  },
  [`& .${gridClasses.row}`]: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.grey[400],
      borderRadius: "8px",
    }
  },
  [`& .${gridClasses.columnSeparator}`]: {
    display: "none",
  },
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: theme.palette.grey[700],
    borderBottom: "none",
    color: theme.palette.action.disabledBackground,
  },
  [`& .MuiDataGrid-row--editing, & .MuiDataGrid-row--editing .MuiDataGrid-cell`]: {
    height: "75px !important",
    maxHeight: "75px !important",
    borderRadius: "0px",
  },
  [`& .MuiStack-root`]: {
    width: "100%",
  },
  [`& .MuiInputBase-root`]: {
    height: "30px",
    border: `1px solid ${theme.palette.grey[300]}`
  },
  [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
    outline: "none",
  },
  [`& .${gridClasses.toolbarContainer}`]: {
    padding: 0,
  },
  [`& .${gridClasses.cell}`]: {
    border: "none",
  },
  [`& .${gridClasses.row}`]: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.grey[400],
      borderRadius: "8px",
    },
  },
  [`& .${gridClasses.columnSeparator}`]: {
    display: "none",
  },
  [`& .${gridClasses.columnHeaders}`]: {
    backgroundColor: theme.palette.grey[700],
    borderBottom: "none",
    color: theme.palette.action.disabledBackground,
  },
  border: "none",
  color: theme.palette.text.secondary,
  ".MuiDataGrid-pinnedColumnHeaders": {
    backgroundColor: theme.palette.grey[700],
    backgroundImage: "none",
    borderRadius: 0,
  },
}));
