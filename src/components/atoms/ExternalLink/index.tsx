import { LinkIcon } from "@/components/icons/LinkIcon";
import { SUPPORTED_CHAINS } from "@/core/api/services/contract.service/contract.utils";
import { Typography } from "@mui/material";

interface ExternalLinkProps {
  network: number;
  address: string;
}

export const ExternalLink = ({ network, address }: ExternalLinkProps) => {
  return (
    <Typography
      sx={{ cursor: "pointer", display: "flex", justifyItems: "center" }}
      onClick={() =>
        window.open(
          `${SUPPORTED_CHAINS[network].blockExplorerUrls[0]}/address/${address}`
        )
      }
      variant="body1"
    >
      {address} &nbsp;
      <span>
        <LinkIcon />
      </span>
    </Typography>
  );
};
