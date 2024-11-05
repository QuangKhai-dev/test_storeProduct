import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
}


const getAllDataAPI = createAsyncThunk()

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {}
});

export const { } = storeSlice.actions

export default storeSlice.reducer