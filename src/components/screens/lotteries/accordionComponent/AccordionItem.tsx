import React from 'react';
import { Typography, Divider, Grid, styled } from '@mui/material'

const CustomDivider = styled(Divider)({
    marginBottom: 10,
});

type CustomRowProps = {
    label: string;
    value?: string | number;
};

const CustomRow = ({ label, value }: CustomRowProps) => {
    return (
        <>
            <CustomDivider />
            <Grid
                container
                direction="row"
                alignItems="left"
                style={{ marginBottom: 10, marginLeft: 20 }}
            >
                <Typography variant="h5">{label}:</Typography>
                <Typography variant="h6" sx={{ marginLeft: 1 }}>{value || '--'}</Typography>
            </Grid>
        </>
    );
};

type LotteryTicketItemProps = {
    moon?: string | number;
    galaxy?: string | number;
};

export const LotteryTicketItem: React.FC<LotteryTicketItemProps> = (props) => {
    const { moon, galaxy } = props;

    return (
        <>
            <CustomRow label="Moon" value={moon} />
            {
                galaxy && <CustomRow label="Galaxy" value={galaxy} />
            }
            <CustomDivider />
        </>
    );
};