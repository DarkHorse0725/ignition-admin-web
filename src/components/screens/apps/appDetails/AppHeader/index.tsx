import { App } from "@/types";
import { Typography, styled } from "@mui/material";

import React from "react";

interface AppHeaderProps {
  data: App;
}

const TextWrapper = styled("div")({
  display: "flex",
  gap: 5,
  margin: "5px 0px",
});
export const AppHeader = ({ data }: AppHeaderProps) => {
  const { _id, brand, environment } = data;

  return (
    <>
      <Typography variant="h4">
        App Details
      </Typography>
      <TextWrapper>
        <Typography variant="body1" color="grey.500">
          ID:
        </Typography>
        <Typography variant="body1"> {_id}</Typography>
      </TextWrapper>
      <TextWrapper>
        <Typography variant="body1" color="grey.500">
          BRAND:
        </Typography>
        <Typography variant="body1"> {brand}</Typography>
      </TextWrapper>

      <TextWrapper>
        <Typography component="span" variant="body1" color="grey.500">
          ENV:
        </Typography>
        <Typography variant="body1"> {environment}</Typography>
      </TextWrapper>
    </>
  );
};
