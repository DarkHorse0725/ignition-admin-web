import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, FormControlLabel, FormGroup, Switch } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface AccordionItem {
    title: string;
    disabled?: boolean;
    expanded?: boolean;
    children: any;
}

export type AccordionMenuProps = {
    items: AccordionItem[];
};

export const AccordionMenu: React.FC<AccordionMenuProps> = (props) => {
    const { items } = props;
    const [expandedState, setExpandedState] = useState(items.map((item) => item.expanded || false));

    const handleExpanded = (index: number) => {
        setExpandedState((prevState) => prevState.map((item, idx) => (idx === index ? !item : item)));
    };

    const setExpanded = (index: number, isOn: boolean) => {
        setExpandedState((prevState) => prevState.map((item, idx) => (idx === index ? isOn : item)));
    };

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: {
        target: { checked: boolean | ((prevState: boolean) => boolean) };
    }) => {
        setChecked(event.target.checked);
        items.map((item, index) => setExpanded(index, !checked));
    };

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={checked} onChange={handleChange} />}
                    label="Expand All"
                    sx={{ mb: 1 }}
                />
            </FormGroup>
            {items.map((item, index) => (
                <Accordion
                    key={`accordion.${index}`}
                    disabled={item.disabled || false}
                    expanded={expandedState[index]}
                    onClick={() => handleExpanded(index)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`accordion-panel-content.${index}`}
                        id={`accordion-panel-header.${index}`}
                    >
                        <Typography variant='h5' color='grey.500'>{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>{item.children}</AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};
