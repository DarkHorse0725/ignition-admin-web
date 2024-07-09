import { Partner } from "@/types";
import { Typography, styled } from "@mui/material";

import React from "react";

interface PartnerHeaderProps {
  data: Partner;
}

const TextWrapper = styled("div")({
  display: "flex",
  gap: 5,
  margin: "5px 0px",
});
export const PartnerHeader = ({ data }: PartnerHeaderProps) => {
  const { _id, code } = data;

  return (
    <>
      <Typography variant="h4">Partner Details</Typography>
      <TextWrapper>
        <Typography variant="body1" color="grey.500">
          ID:
        </Typography>
        <Typography variant="body1"> {_id}</Typography>
      </TextWrapper>
      <TextWrapper>
        <Typography variant="body1" color="grey.500">
          CODE:
        </Typography>
        <Typography variant="body1"> {code}</Typography>
      </TextWrapper>
    </>
  );
};
