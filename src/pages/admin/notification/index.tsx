// Libraries import
import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Grid, TableHeaderRow, VirtualTable, } from "@devexpress/dx-react-grid-material-ui";
import { Column } from "@devexpress/dx-react-grid";
import dayjs from "dayjs";

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { SpreadSheet, TableHeader } from "@/components/Table";
import { Notification } from "@/types";
import { Card } from "@/components/atoms/Card";
import NotificationActionButton from "./NotificationActionButton";
import { useSelectorNotification } from "@/store/hook";
import { TablePaginationV2 } from "@/components/Table/PaginationV2";
import { removeAllUnread, removeOneUnread } from "@/store/features/notificationSlice";

const apiClient = APIClient.getInstance();

const tableColumnExtensions = [
    { columnName: '_id', width: 380 },
    { columnName: 'project', width: 320 },
    { columnName: 'action', width: 100 },
]

const CustomTableText = ({ children, isRead, onClick }: { children: ReactNode, isRead: boolean, onClick?: () => void }) => {
    const textColor = onClick ? (isRead ? "primary.dark" : "primary.main") : (isRead ? "grey.500" : "text.primary");
    return (
        <Typography
            color={textColor}
            sx={{
                fontStyle: isRead ? "italic" : "normal",
                cursor: onClick ? "pointer" : "auto",
                fontWeight: isRead ? "normal" : "bold",
            }}
            onClick={() => onClick && onClick()}
        >
            {children}
        </Typography>
    )
}

const TextButton = ({ children, onClick, disabled }: { children: ReactNode, onClick: () => void, disabled: boolean }) => {
    return (
        <Button
            sx={{
                border: "none",
                background: "none",
                padding: 0,
                "&:disabled": { background: "none" }
            }}
            onClick={onClick}
            disabled={disabled}
        >
            <Typography
                color={disabled ? "text.disabled" : "text.primary"}
                variant="body3"
                sx={{ textDecoration: 'underline' }}
            >
                {children}
            </Typography>
        </Button>
    )
}

const Notifications: NextPageWithLayout = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { unreadCount } = useSelectorNotification();
    const [userScreenHeight, setUserScreenHeight] = useState(0);
    const [notificationList, setNotificationList] = useState<Notification[]>([]);

    // Table
    const [isUnreadFiltered, setIsUnreadFiltered] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Adjust table height based on screen height
        setUserScreenHeight(window.innerHeight);
        const handleResize = () => {
            setUserScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getNotificationList = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.notification.list(
                isUnreadFiltered
                    ? { page: currentPage + 1, status: 'unread' }
                    : { page: currentPage + 1 }
            );
            const { data, total } = response;
            setNotificationList(data);

            const totalPages = Math.ceil(total / 10);
            setTotalPages(totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, isUnreadFiltered]);

    useEffect(() => {
        getNotificationList()
    }, [getNotificationList])

    const updateRowData = useCallback((notificationID: string) => {
        const newNotificationList = notificationList.map((notification) => {
            if (notificationID === notification._id) { notification.isRead = !notification.isRead }
            return notification;
        });
        setNotificationList(newNotificationList);
    }, [notificationList]);

    const updateAllListAsRead = useCallback(() => {
        const newNotificationList = notificationList.map((notification) => {
            notification.isRead = true;
            return notification;
        });
        setNotificationList(newNotificationList);
    }, [notificationList]);

    const markAllAsRead = async () => {
        try {
            await apiClient.notification.markAllAsRead();
            if (isUnreadFiltered) { // if user is on unread page, refresh the list
                getNotificationList();
            } else { // if user is on all page, update the row data (does not call api)
                updateAllListAsRead();
            }
            dispatch(removeAllUnread())
        } catch (error) {
            console.error(error);
        }
    }

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await apiClient.notification.markAsRead(notificationId);
            if (isUnreadFiltered) { // if user is on unread page, refresh the list
                // if user is on first page or notificationList is not empty, refresh the list (call api)
                if (currentPage === 0 || notificationList.length > 1) {
                    getNotificationList();
                } else { // if user is on other page, go to previous page (call api)
                    setCurrentPage((prev) => prev - 1);
                }
            } else { // if user is on all page, update the row data (does not call api)
                updateRowData(notificationId);
            }
            dispatch(removeOneUnread())
        } catch (error) {
            console.error(error);
        }
    }, [currentPage, dispatch, getNotificationList, isUnreadFiltered, notificationList.length, updateRowData]);

    const columns: Column[] = useMemo(() => [
        {
            name: '_id',
            title: 'Notification',
            getCellValue: (row) => (
                <CustomTableText
                    isRead={row.isRead}
                    onClick={() => {
                        router.push(`projects/${row.project._id}`)
                        markAsRead(row._id)
                    }}
                >
                    Project {row.project.name.length > 28 ? `${row.project.name.slice(0, 25) + "..."}` : row.project.name} has new Proposal
                </CustomTableText>
            ),
        },
        {
            name: 'project',
            title: 'Project',
            getCellValue: (row) => (
                <CustomTableText
                    isRead={row.isRead}
                    onClick={() => {
                        router.push(`projects/${row.project._id}`)
                        markAsRead(row._id)
                    }}
                >
                    {row.project.name.length > 51 ? `${row.project.name.slice(0, 48) + "..."}` : row.project.name}
                </CustomTableText>
            ),
        },
        {
            name: 'brand',
            title: 'Brand',
            getCellValue: (row) => (
                <CustomTableText isRead={row.isRead}>
                    {row.project.brand}
                </CustomTableText>
            ),
        },
        {
            name: 'createdAt',
            title: 'Date',
            getCellValue: (row) => (
                <CustomTableText isRead={row.isRead}>
                    {dayjs(row.createdAt).format('MM/DD/YYYY HH:mm')}
                </CustomTableText>
            ),
        },
        {
            name: 'action',
            title: 'Action',
            getCellValue: (row) => (
                <Box sx={{ cursor: "pointer" }}>
                    <NotificationActionButton notificationId={row._id} markAsRead={markAsRead} updateRowData={updateRowData} isRead={row.isRead} />
                </Box>
            )
        }
    ], [markAsRead, router, updateRowData]);

    return (
        <Stack
            spacing={2}
            sx={{ ml: 2 }}
        >
            <Card>
                <Stack spacing={2}>
                    <Typography color="primary.main" variant="h4">Notification</Typography>
                </Stack>
            </Card>
            <Card>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 3,
                }}>
                    <Box sx={{ display: 'flex', alignItems: "center", gap: 3 }}>
                        <Typography
                            variant={isUnreadFiltered ? "h5" : "h4"}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                setIsUnreadFiltered(false)
                                setCurrentPage(0)
                            }}
                        >
                            All
                        </Typography>
                        <Typography
                            variant={isUnreadFiltered ? "h4" : "h5"}
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                setIsUnreadFiltered(true)
                                setCurrentPage(0)
                            }}
                        >
                            Unread
                        </Typography>
                    </Box>
                    <TextButton onClick={markAllAsRead} disabled={unreadCount === 0}>
                        Mark all as read
                    </TextButton>
                </Box>
                <Grid
                    rows={notificationList}
                    columns={columns}
                    getRowId={(row: any) => row._id}
                >

                    <VirtualTable
                        columnExtensions={tableColumnExtensions}
                        tableComponent={SpreadSheet}
                        height={userScreenHeight - 289}
                        messages={{
                            noData: (
                                isLoading ?
                                    "Loading..."
                                    :
                                    "No data"
                            ),
                        }}
                    />

                    <TableHeaderRow rowComponent={TableHeader} />

                </Grid>

                {
                    // only show pagination when there are more than 1 page
                    totalPages > 1 && (
                        <TablePaginationV2
                            totalPages={totalPages}
                            currentPage={currentPage + 1}
                            onCurrentPageChange={(page: number) => setCurrentPage(page - 1)}
                        />
                    )
                }

            </Card>
        </Stack>
    )
}

Notifications.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

export default Notifications;