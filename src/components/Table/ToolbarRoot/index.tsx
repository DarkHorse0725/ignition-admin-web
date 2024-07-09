import { Toolbar } from "@devexpress/dx-react-grid-material-ui";
import { styled } from "@mui/material";

export const ToolBarRoot = styled(Toolbar.Root)(() => ({
  "&.Toolbar-toolbar": {
    borderBottom: "none",
  },
}));
