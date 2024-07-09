import {
  Box,
  Tab,
  Tabs as TabsBase,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { ReactElement, SyntheticEvent, useState } from "react";

interface TabPanelProps {
  children: ReactElement;
  isActiveTab: boolean;
  index: number;
}

const TabPanel = ({ children, isActiveTab, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={!isActiveTab}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {isActiveTab && <Box>{children}</Box>}
    </div>
  );
};

export interface TabItem {
  title: string;
  disabled?: boolean;
  Icon?: React.ElementType;
  tooltip?: string; //only visible if tab is disabled
  children: any;
  isHidden?: boolean;
}

interface TabsProps {
  items: TabItem[];
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const CloneTabsProps = (props: any) => {
  const { children, ...other } = props;
  return children(other);
};

const LabelTab = ({
  item: { Icon, title },
  color,
}: {
  item: TabItem;
  color: string;
}) => {
  return (
    <Box sx={{ display: "flex", gap: "10px" }}>
      {Icon && (
        <Box>
          <Icon color={color} />
        </Box>
      )}
      <Typography color={color} textTransform="capitalize">
        {title}
      </Typography>
    </Box>
  );
};

const Tabs = ({ items }: TabsProps) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <TabsBase
        value={activeTab}
        onChange={handleChange}
        aria-label="basic tabs example"
        textColor="secondary"
        TabIndicatorProps={{
          style: {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        indicatorColor="secondary"
        sx={{
          borderBottom: `solid 1px ${theme.palette.text.secondary}`,
        }}
      >
        {items.map((item: TabItem, index) => {
          const { disabled, tooltip, isHidden } = item;

          const contentColor = disabled
            ? theme.palette.text.disabled
            : index === activeTab
              ? theme.palette.primary.main
              : theme.palette.text.secondary;

          if (isHidden) return;
          if (disabled && tooltip) {
            return (
              <CloneTabsProps key={index}>
                {(tabsProps: any) => (
                  <Tooltip title={tooltip} placement="top" arrow key={index}>
                    <div>
                      <Tab
                        value={index}
                        label={<LabelTab item={item} color={contentColor} />}
                        disabled={disabled}
                        {...a11yProps(index)}
                        {...tabsProps}
                      />
                    </div>
                  </Tooltip>
                )}
              </CloneTabsProps>
            );
          }
          return (
            <Tab
              key={index}
              value={index}
              label={<LabelTab item={item} color={contentColor} />}
              disabled={disabled}
              {...a11yProps(index)}
            />
          );
        })}
      </TabsBase>
      {items.map((item, index) => (
        <TabPanel isActiveTab={activeTab === index} key={index} index={index}>
          {item.children}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Tabs;
