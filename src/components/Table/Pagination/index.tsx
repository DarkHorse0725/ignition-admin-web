import * as React from "react";
import { Pagination, Stack, styled } from "@mui/material";

const StyledPaging = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-ellipsis": {
    color: theme.palette.text.secondary,
  },
  "& .MuiButtonBase-root": {
    color: theme.palette.text.secondary,
    border: "none",
    "&.Mui-selected": {
      backgroundColor: theme.palette.grey[600],
      color: theme.palette.primary.main,
      borderRadius: "8px",
    },
    "&:hover": {
      borderRadius: "8px",
    },
  },
  "& .MuiPaginationItem-icon": {
    color: theme.palette.primary.main,
  },
}));

type TablePagination = {
  totalPages: number;
  currentPage: number;
  onCurrentPageChange: (page: number) => void;
};

export const TablePagination = ({
  totalPages,
  currentPage,
  onCurrentPageChange,
}: TablePagination) => {
  const [current, setCurrent] = React.useState(currentPage ? currentPage : 1);

  return (
    <Stack spacing={2} sx={{ margin: "1rem 0" }}>
      <StyledPaging
        count={totalPages}
        variant="outlined"
        shape="rounded"
        onChange={(_, page) => {
          onCurrentPageChange(page - 1);
          setCurrent(page);
        }}
        page={current}
      />
    </Stack>
  );
};
