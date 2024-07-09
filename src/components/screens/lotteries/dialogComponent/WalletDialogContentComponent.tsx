import React from 'react'
import { Typography } from '@mui/material';
import { Column } from "@devexpress/dx-react-grid";
import { Grid, TableHeaderRow, VirtualTable } from "@devexpress/dx-react-grid-material-ui";

import { SpreadSheet, TableHeader, } from "@/components/Table";
import { LotteryEntry } from '@/types';

export const WalletDialogContentComponent = ({ lotteryEntry }: { lotteryEntry: LotteryEntry | undefined }): JSX.Element => {

  const columns: Column[] = [
    { name: 'account', title: 'Account ID' },
    { name: 'chainId', title: 'Chain ID' },
  ]

  return (
    <>
      <Typography sx={{ mb: 2 }}>ID: {lotteryEntry!!._id}</Typography>
      <Grid
        rows={lotteryEntry!!.wallets}
        columns={columns}
        getRowId={(row: any) => row._id}
      >
        <VirtualTable
          tableComponent={SpreadSheet}
          height={"auto"}
          messages={{ noData: "No data" }}
        />
        <TableHeaderRow rowComponent={TableHeader} />
      </Grid>
    </>
  )
}

