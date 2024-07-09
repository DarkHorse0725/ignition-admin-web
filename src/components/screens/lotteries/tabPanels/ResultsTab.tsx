import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Dinero from "dinero.js";
import { TabPanel } from "@mui/lab";

import { LotteryResult } from "@/types";
import { APIClient } from "@/core/api";
import { AccordionMenu } from "../accordionComponent/AccordionMenu";
import { LotteryTicketItem } from "../accordionComponent/AccordionItem";
import { useSelectorLotteryDetails } from "@/store/hook";

const formatPercentage = (rawPercent: number | null | undefined) => {
  let precision = 4;
  const percent = (rawPercent || 0) * 100;

  if (percent <= 9) {
    precision = 3;
  }

  return percent.toPrecision(precision) + "%";
};

const apiClient = APIClient.getInstance();

function ResultsTab() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { _id } = lotteryDetails;
  const [lotteryResult, setLotteryResult] = useState<
    Partial<LotteryResult> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (_id) loadData();
  }, [_id]);

  const loadData = async () => {
    setIsLoading(true);
    const response = await apiClient.lotteries.getResults(_id);
    const { data } = response;
    setLotteryResult(data);
    setIsLoading(false);
  };

  return (
    <TabPanel value="results">
      {isLoading ? (
        <Typography variant="h6" align="center" color="primary.main">
          Loading...
        </Typography>
      ) : (
        <AccordionMenu
          items={[
            {
              title: "Tickets",
              children: (
                <LotteryTicketItem
                  moon={lotteryResult?.tickets?.moon?.toLocaleString()}
                  galaxy={lotteryResult?.tickets?.galaxy?.toLocaleString()}
                />
              ),
            },
            {
              title: "Winning Tickets",
              children: (
                <LotteryTicketItem
                  moon={lotteryResult?.winnersTickets?.moon?.toLocaleString()}
                  galaxy={lotteryResult?.winnersTickets?.galaxy?.toLocaleString()}
                />
              ),
            },
            {
              title: "Raise Amount",
              children: (
                <LotteryTicketItem
                  moon={
                    lotteryResult?.raiseAmount?.moon === undefined ||
                    lotteryResult?.raiseAmount?.moon === null
                      ? undefined
                      : Dinero({
                          amount: Number(lotteryResult.raiseAmount.moon),
                          currency: "USD",
                          precision: 0,
                        }).toFormat("$0,0")
                  }
                  galaxy={
                    lotteryResult?.raiseAmount?.galaxy === undefined ||
                    lotteryResult?.raiseAmount?.galaxy === null
                      ? undefined
                      : Dinero({
                          amount: Number(lotteryResult.raiseAmount.galaxy),
                          currency: "USD",
                          precision: 0,
                        }).toFormat("$0,0")
                  }
                />
              ),
            },
            {
              title: "Ticket Allocation",
              children: (
                <LotteryTicketItem
                  moon={lotteryResult?.ticketAllocation?.moon?.toLocaleString()}
                  galaxy={lotteryResult?.ticketAllocation?.galaxy?.toLocaleString()}
                />
              ),
            },
            {
              title: "Chances Of Winning",
              children: (
                <LotteryTicketItem
                  moon={
                    lotteryResult?.chancesOfWinning?.moon === undefined
                      ? undefined
                      : formatPercentage(lotteryResult?.chancesOfWinning?.moon)
                  }
                />
              ),
            },
            {
              title: "Selected Tickets Chances Of Winning",
              children: (
                <LotteryTicketItem
                  moon={lotteryResult?.selectedTicketsChancesOfWinning?.moon?.toLocaleString()}
                />
              ),
            },
            {
              title: "Additional Percentage",
              children: (
                <LotteryTicketItem
                  moon={lotteryResult?.additionalPercentage?.moon?.toLocaleString()}
                />
              ),
            },
            {
              title: "Selected Winning Tickets",
              children: (
                <LotteryTicketItem
                  moon={
                    lotteryResult?.selectedWinnerTickets?.moon === undefined
                      ? undefined
                      : formatPercentage(
                          lotteryResult?.selectedWinnerTickets?.moon
                        )
                  }
                />
              ),
            },
          ]}
        />
      )}
    </TabPanel>
  );
}

export default ResultsTab;
