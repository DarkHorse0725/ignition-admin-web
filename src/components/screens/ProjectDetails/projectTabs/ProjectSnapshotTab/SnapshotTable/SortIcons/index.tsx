import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material";

export const SortedDescendingIcon = () => {
  const theme = useTheme();
  return (
    <ExpandMoreIcon
      className="icon"
      sx={{ fontSize: 15, color: theme.palette.grey[800] }}
    />
  );
};

export const SortedAscendingIcon = () => {
  const theme = useTheme();
  return (
    <ExpandLessIcon
      className="icon"
      sx={{ fontSize: 15, color: theme.palette.grey[800] }}
    />
  );
};
