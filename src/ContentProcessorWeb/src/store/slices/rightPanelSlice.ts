import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import httpUtility from '../../Services/httpUtility';

import { toast } from "react-toastify";

interface RightPanelState {
    fileHeaders: any;
    rLoader: boolean;
    blobURL: string;
    rError: string | null;
}

export const fetchContentFileData = createAsyncThunk<any, { processId: string | null }>('/contentprocessor/processed/files/', async ({ processId }, { rejectWithValue }): Promise<any> => {
    const url = '/contentprocessor/processed/files/' + processId;
    try {
        const response = await httpUtility.headers(url);

        if (!response.ok) throw new Error("Failed to fetch file");
        const blob = await response.blob();
        const blobURL = URL.createObjectURL(blob);
        const headers = response.headers;
        if (!headers) {
            throw new Error("Failed to fetch headers");
        }
        const headersObject = Object.fromEntries(headers.entries());
        return { headers: headersObject, blobURL: blobURL };
    }
    catch (error) {
        return rejectWithValue({
            success: false,
            message: JSON.parse('Failed to fetch file')
        });
    }

});


const initialState: RightPanelState = {
    fileHeaders: {},
    blobURL: '',
    rLoader: false,
    rError: ''
};

const rightPanelSlice = createSlice({
    name: 'Right Panel',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        //Fetch Dropdown values
        builder
            .addCase(fetchContentFileData.pending, (state) => {
                state.fileHeaders = {}
                state.blobURL = '';
                state.rLoader = true;
                state.rError = '';
            })
            .addCase(fetchContentFileData.fulfilled, (state, action: PayloadAction<any>) => {
                state.fileHeaders = action.payload.headers;
                state.blobURL = action.payload.blobURL;
                state.rLoader = false;
            })
            .addCase(fetchContentFileData.rejected, (state, action) => {
                //console.log('Error : ', action.error.message)
                state.rLoader = false;
                state.rError = action.error.message || 'An error occurred';
                toast.error(action.error.message || 'Failed to fetch file');
            });

    },
});

export const { } = rightPanelSlice.actions;
export default rightPanelSlice.reducer;
