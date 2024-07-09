import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton, useTheme } from '@mui/material';
import { EditIcon } from '@/components/icons';
import { USER_ACTIONS } from '@/types';

interface ACLActionButtonProps {
    handleEditButton: () => void,
    openDialog: () => void,
    executeSetEditingRow: () => void,
    setActionName: (actionName: string) => void,
    isDisabled: boolean,
    isAccountActive: boolean,
    isResetPasswordDisabled: boolean,
}

export default function ACLActionButton({ handleEditButton, openDialog, executeSetEditingRow, setActionName, isDisabled, isAccountActive, isResetPasswordDisabled }: ACLActionButtonProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = (actionName: string) => {
        executeSetEditingRow()
        openDialog()
        handleCloseMenu()
        setActionName(actionName)
    }

    const handleEdit = (actionName: string) => {
        handleEditButton()
        handleCloseMenu()
        setActionName(actionName)
    }

    return (
        <>
            <IconButton
                type="button"
                id="action-button"
                aria-controls={open ? 'action-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disabled={isDisabled}
            >
                <EditIcon fill={isDisabled ? theme.palette.action.disabledBackground : theme.palette.primary.main} />
            </IconButton>
            <Menu
                id="action-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'action-button',
                }}
            >
                <MenuItem onClick={() => handleEdit(USER_ACTIONS.EDIT)}>Edit</MenuItem>
                <MenuItem onClick={() => handleOpenDialog(USER_ACTIONS.RESET_PASSWORD)} disabled={isResetPasswordDisabled}>Reset Password</MenuItem>
                <MenuItem onClick={() => handleOpenDialog(USER_ACTIONS.RESET_2_FA)} disabled={!isAccountActive}>Reset 2FA</MenuItem>
                <MenuItem onClick={() => handleOpenDialog(USER_ACTIONS.REMOVE_ACCOUNT)}>Remove Account</MenuItem>
            </Menu>
        </>
    );
}