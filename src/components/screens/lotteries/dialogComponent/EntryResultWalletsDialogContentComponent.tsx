import React from 'react'
import { Typography } from '@mui/material';
import { Column } from "@devexpress/dx-react-grid";
import { Grid, TableHeaderRow, VirtualTable } from "@devexpress/dx-react-grid-material-ui";

import { SpreadSheet, TableHeader, } from "@/components/Table";
import { LotteryEntryResult } from '@/types';

export const EntryResultWalletsDialogContentComponent = ({ lotteryEntryResult }: { lotteryEntryResult: LotteryEntryResult | undefined }): JSX.Element => {

    if (!lotteryEntryResult) return (<div>Loading...</div>);

    const columns: Column[] = [
        { name: 'account', title: 'Account ID' },
        { name: 'chainId', title: 'Chain ID' },
        { name: 'Tickets', title: 'Tickets' },
        { name: 'Winning Tickets', title: 'Winning Tickets' },
    ]

    return (
        <>
            <Typography sx={{ mb: 2 }}>ID: {lotteryEntryResult._id}</Typography>
            <Typography sx={{ mb: 2 }}>Entry ID: {lotteryEntryResult.entry}</Typography>
            <Grid
                rows={lotteryEntryResult.wallets}
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

