import { TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { styled } from "@mui/material";

const StyledHeaderRow = styled(TableHeaderRow.Row)(({ theme }) => ({
  "& th.MuiTableCell-root": {
    borderBottom: "none",
    color: theme.palette.grey[800],
  },
  "& th.MuiTableCell-root:first-of-type": {
    borderRadius: "4px 0px 0px 4px",
  },
  "& th.MuiTableCell-root:last-child": {
    borderRadius: "0px 4px 4px 0px",
  },
  background: theme.palette.grey[700],
}));

export const TableHeader = (props: any) => {
  return <StyledHeaderRow {...props} />;
};
