import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { profileAPI } from '../../services/api'

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try { const r = await profileAPI.get(); return r.data.user }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch profile') }
})

export const updateProfile = createAsyncThunk('profile/update', async (data, { rejectWithValue }) => {
  try { const r = await profileAPI.update(data); return r.data.user }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update profile') }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: { name: '', email: '', occupation: '', role: 'Student', monthlyGoal: 80 },
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    clearUpdateSuccess(state) { state.updateSuccess = false },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProfile.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; state.updateSuccess = false })
      .addCase(updateProfile.rejected, (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(updateProfile.fulfilled, (state, { payload }) => { state.loading = false; state.data = payload; state.updateSuccess = true })
  }
})

export const { clearUpdateSuccess, clearError } = profileSlice.actions
export default profileSlice.reducer

export const selectProfile = (s) => s.profile.data
export const selectProfileLoading = (s) => s.profile.loading
export const selectProfileError = (s) => s.profile.error
export const selectUpdateSuccess = (s) => s.profile.updateSuccess
