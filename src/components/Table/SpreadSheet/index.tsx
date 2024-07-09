import { Table } from "@devexpress/dx-react-grid-material-ui";
import { styled } from "@mui/material";

const StyledTable = styled(Table.Table)(({ theme }) => ({
  "& .TableNoDataCell-text": {
    color: theme.palette.primary.main,
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: "4px",
  },
  "& .MuiTableCell-root": {
    border: "none",
    fontSize: 12,
    fontWeight: 400,
    fontFamily: "Arial",
    color: theme.palette.grey[500],
  },
  "& .MuiTableRow-root:nth-of-type(even) .TableFixedCell-fixedCell": {
    backgroundColor: theme.palette.grey[400],
  },
  "& .MuiTableRow-root:nth-of-type(odd) .TableFixedCell-fixedCell": {
    backgroundColor: theme.palette.background.default,
  },
  "& .TableFixedCell-fixedCell": {
    border: "none",
    borderColor: "unset",
    boxShadow:
      "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    padding: "0 0 0 15px",
  },
  "& .TableFixedCell-dividerLeft": {
    borderLeft: "none!important",
  },
}));

export const SpreadSheet = (props: any) => {
  return <StyledTable {...props} />;
};
