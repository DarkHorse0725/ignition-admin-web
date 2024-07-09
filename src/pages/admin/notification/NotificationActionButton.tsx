import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { ActionIcon } from '@/components/icons';
import { APIClient } from '@/core/api';
import { addOneUnread } from '@/store/features/notificationSlice';

interface NotificationActionButtonProps {
    notificationId: string,
    isRead?: boolean,
    markAsRead: (notificationId: string) => void,
    updateRowData: (notificationID: string) => void,
}

const apiClient = APIClient.getInstance();

export default function NotificationActionButton({ notificationId, isRead = false, markAsRead, updateRowData }: NotificationActionButtonProps) {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleMarkAsRead = () => {
        markAsRead(notificationId);
        handleClose();
    }

    const markAsUnread = async () => {
        try {
            await apiClient.notification.markAsUnread(notificationId);
            updateRowData(notificationId);
            dispatch(addOneUnread())
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <IconButton
                type="button"
                id={id}
                aria-controls={id}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <ActionIcon />
            </IconButton>
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'action-button' }}
            >
                {
                    isRead ?
                        <MenuItem onClick={markAsUnread}>Mark as unread</MenuItem>
                        :
                        <MenuItem onClick={handleMarkAsRead}>Mark as read</MenuItem>
                }
            </Menu>
        </div>
    );
}