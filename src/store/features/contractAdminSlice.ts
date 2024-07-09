import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ACTIONS } from "@/types";

export interface contractAdminState {
    isProcessing: boolean;
    isRefetch: boolean;
    currentAction: ACTIONS | null;
    adminAddressToDelete: string;
    isAdminActive: boolean;
}

const initialState: contractAdminState = {
    isProcessing: false,
    isRefetch: false,
    currentAction: null,
    adminAddressToDelete: "",
    isAdminActive: false,
};

export const contractAdminSlice = createSlice({
    name: "contractAdmin",
    initialState,
    reducers: {
        setIsProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
        },
        setIsRefetch: (state, action: PayloadAction<boolean>) => {
            state.isRefetch = action.payload;
        },
        setCurrentAction: (state, action: PayloadAction<ACTIONS | null>) => {
            state.currentAction = action.payload;
        },
        setAdminAddressToDelete: (state, action: PayloadAction<string>) => {
            state.adminAddressToDelete = action.payload;
        },
        setIsAdminActive: (state, action: PayloadAction<boolean>) => {
            state.isAdminActive = action.payload;
        },
    },
});

export const {
    setIsProcessing,
    setIsRefetch,
    setCurrentAction,
    setAdminAddressToDelete,
    setIsAdminActive
} = contractAdminSlice.actions;

export default contractAdminSlice.reducer;