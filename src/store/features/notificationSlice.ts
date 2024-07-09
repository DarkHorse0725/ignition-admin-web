import { createSlice } from '@reduxjs/toolkit'

interface NotificationState {
    unreadCount: number;
}

const initialState: NotificationState = {
    unreadCount: 0,
};

export const notificationSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        updateUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        // minus 1 from unreadCount
        removeOneUnread: (state) => {
            state.unreadCount -= 1;
        },
        addOneUnread: (state) => {
            state.unreadCount += 1;
        },
        removeAllUnread: (state) => {
            state.unreadCount = 0;
        }
    },
})

export const { updateUnreadCount, removeOneUnread, addOneUnread, removeAllUnread } = notificationSlice.actions
export default notificationSlice.reducer