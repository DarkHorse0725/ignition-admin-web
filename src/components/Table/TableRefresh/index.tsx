import {
  Action,
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

interface RefreshProps {
  onRefresh: () => void;
}

const RefreshButton = (props: RefreshProps) => {
  const { onRefresh } = props;
  return (
    <Tooltip title="Refresh Table" placement="bottom">
      <IconButton onClick={onRefresh}>
        <AutorenewRoundedIcon
          color="primary"
          sx={{
            transform: "rotate(25deg)",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

const TableRefreshBase = (props: {
  refreshComponent: React.ComponentType<RefreshProps>;
}) => {
  const { refreshComponent: RefreshButton } = props;

  return (
    <Plugin name="TableRefresh">
      <Template name="toolbarContent">
        <TemplatePlaceholder />
        <TemplateConnector>
          {(_, { clickRefresh }) => {
            return <RefreshButton onRefresh={clickRefresh} />;
          }}
        </TemplateConnector>
      </Template>
    </Plugin>
  );
};

export const TableRefreshState = (props: { action: () => void }) => {
  const { action } = props;
  return (
    <Plugin name="TableRefreshState">
      <Action name="clickRefresh" action={action} />
    </Plugin>
  );
};

export const TableRefresh = () => (
  <TableRefreshBase refreshComponent={RefreshButton} />
);
