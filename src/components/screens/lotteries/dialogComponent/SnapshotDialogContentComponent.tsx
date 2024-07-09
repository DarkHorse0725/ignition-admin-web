import React from 'react'
import { Typography } from '@mui/material';
import { Column } from "@devexpress/dx-react-grid";
import { Grid, TableHeaderRow, VirtualTable } from "@devexpress/dx-react-grid-material-ui";

import { SpreadSheet, TableHeader, } from "@/components/Table";
import { LotteryEntry } from '@/types';

export const SnapshotDialogContentComponent = ({ lotteryEntry }: { lotteryEntry: LotteryEntry | undefined }): JSX.Element => {

    if (!lotteryEntry) return (<Typography>Loading...</Typography>)

    const columns: Column[] = [
        { name: 'account', title: 'Account' },
        { name: 'chainId', title: 'Chain ID' },
        { name: 'guaranteedGalaxyTickets', title: 'Guaranteed Galaxy Tickets' },
        { name: 'totalStakedBalance', title: 'Total Staked Balance' },
        { name: 'totalWalletBalance', title: 'Total Wallet Balance' },
    ]
    
    const rows = lotteryEntry?.snapshot?.wallets.map((wallet) => {
        return {
            account: wallet.account,
            chainId: wallet.chainId,
            guaranteedGalaxyTickets: "",
            totalStakedBalance: wallet.totalStakedBalance,
            totalWalletBalance: "",
        }
    });

    return (
        <>
            <Typography sx={{ mb: 2 }}>ID: {lotteryEntry._id}</Typography>
            <Typography sx={{ mb: 2 }}>TotalStakedBalance: {lotteryEntry?.snapshot?.totalStakedBalance || 0}</Typography>
            <Typography sx={{ mb: 2 }}>TotalWalletBalance: {lotteryEntry?.snapshot?.totalStakedBalance || 0}</Typography>
            <Grid
                rows={rows || []}
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

