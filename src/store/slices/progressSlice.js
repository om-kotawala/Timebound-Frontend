
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { progressAPI } from '../../services/api'

export const fetchDailyProgress = createAsyncThunk('progress/daily', async (date, { rejectWithValue }) => {
  try { const r = await progressAPI.daily(date); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const fetchMonthlyProgress = createAsyncThunk('progress/monthly', async ({ month, year }, { rejectWithValue }) => {
  try { const r = await progressAPI.monthly(month, year); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

export const fetchYearlyProgress = createAsyncThunk('progress/yearly', async (year, { rejectWithValue }) => {
  try { const r = await progressAPI.yearly(year); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed') }
})

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    daily: { pct: 0, completed: 0, total: 0, pending: 0, data: [] },
    monthly: { pct: 0, daysWithTasks: 0, data: [] },
    yearly: { pct: 0, monthsWithData: 0, data: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyProgress.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDailyProgress.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchDailyProgress.fulfilled, (state, { payload }) => { state.daily = { ...state.daily, ...payload } })
      .addCase(fetchMonthlyProgress.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMonthlyProgress.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchMonthlyProgress.fulfilled, (state, { payload }) => { state.monthly = { ...state.monthly, ...payload } })
      .addCase(fetchYearlyProgress.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchYearlyProgress.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchYearlyProgress.fulfilled, (state, { payload }) => { state.yearly = { ...state.yearly, ...payload } })
      .addMatcher(
        (action) => action.type.startsWith('progress/') && action.type.endsWith('/fulfilled'),
        (state) => { state.loading = false }
      )
  }
})

export default progressSlice.reducer

export const selectDailyProgress = (s) => s.progress.daily
export const selectMonthlyProgress = (s) => s.progress.monthly
export const selectYearlyProgress = (s) => s.progress.yearly
export const selectProgressLoading = (s) => s.progress.loading

export const selectWeeklyChartData = createSelector(
  [(s) => s.progress.daily.data],
  (data) => data || []
)

export const selectMonthlyChartData = createSelector(
  [(s) => s.progress.monthly.data],
  (data) => data || []
)
