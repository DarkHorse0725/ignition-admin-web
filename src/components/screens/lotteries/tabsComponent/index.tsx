import { SyntheticEvent, useState } from "react";
import { Box, Typography, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";

import { LotteryStatus } from "@/types/lottery";
import InfoTab from "../tabPanels/InfoTab";
import EntriesTab from "../tabPanels/EntriesTab";
import TransactionsTab from "../tabPanels/TransactionsTab";
import ResultsTab from "../tabPanels/ResultsTab";
import EntryResultsTab from "../tabPanels/EntryResultsTab";
import { useSelectorLotteryDetails } from "@/store/hook";

const isLotteryResultsReady = (status: string): boolean => {
  // Results are ready when the lottery is completed or finished
  const statuses: (LotteryStatus | string)[] = [
    LotteryStatus.COMPLETED,
    LotteryStatus.FINISHED,
  ];
  return statuses.includes(status);
};

export default function TabsComponent() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { status } = lotteryDetails;
  const [value, setValue] = useState("info");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!status)
    return (
      <Typography variant="h6" align="center" color="primary.main">
        Loading...
      </Typography>
    );

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Info" value="info" />
            <Tab label="Entries" value="entries" />
            {isLotteryResultsReady(status!!) && [
              <Tab key="results" label="Results" value="results" />,
              <Tab
                key="entry-results"
                label="Entry Results"
                value="entry-results"
              />,
            ]}
            <Tab label="Transactions" value="transactions" />
          </TabList>
        </Box>
        <InfoTab />
        <EntriesTab />
        {isLotteryResultsReady(status!!) && [
          <ResultsTab key="results" />,
          <EntryResultsTab key="entry-results" />,
        ]}
        <TransactionsTab />
      </TabContext>
    </Box>
  );
}
