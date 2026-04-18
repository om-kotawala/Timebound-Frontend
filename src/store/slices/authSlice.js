import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

const TOKEN_KEY = 'tb_token'
const existingToken = localStorage.getItem(TOKEN_KEY)

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { const r = await authAPI.register(data); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed') }
})

export const sendOTP = createAsyncThunk('auth/sendOTP', async (email, { rejectWithValue }) => {
  try { const r = await authAPI.sendOTP(email); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to send OTP') }
})

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try { const r = await authAPI.verifyOTP(email, otp); return r.data }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Invalid OTP') }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try { const r = await authAPI.me(); return r.data.user }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Session expired') }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: existingToken,
    isAuthenticated: false,
    loading: false,
    error: null,
    step: 'email',
    pendingEmail: '',
    initialized: !existingToken,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.step = 'email'
      state.pendingEmail = ''
      state.initialized = true
      localStorage.removeItem(TOKEN_KEY)
    },
    setStep(state, { payload }) { state.step = payload },
    setPendingEmail(state, { payload }) { state.pendingEmail = payload },
    clearError(state) { state.error = null },
    setUser(state, { payload }) { state.user = payload },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null }
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload }

    builder
      .addCase(register.pending, pending)
      .addCase(register.rejected, rejected)
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(sendOTP.pending, pending)
      .addCase(sendOTP.rejected, rejected)
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false
        state.step = 'otp'
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.initialized = true
        localStorage.removeItem(TOKEN_KEY)
      })
      .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload
        state.isAuthenticated = true
        state.initialized = true
      })
      .addCase(verifyOTP.pending, pending)
      .addCase(verifyOTP.rejected, rejected)
      .addCase(verifyOTP.fulfilled, (state, { payload }) => {
        state.loading = false
        state.token = payload.token
        state.user = payload.user
        state.isAuthenticated = true
        state.initialized = true
        state.step = 'email'
        state.pendingEmail = ''
        localStorage.setItem(TOKEN_KEY, payload.token)
      })
  }
})

export const { logout, setStep, setPendingEmail, clearError, setUser } = authSlice.actions
export default authSlice.reducer

export const selectAuth = (s) => s.auth
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated
export const selectUser = (s) => s.auth.user
export const selectAuthLoading = (s) => s.auth.loading
export const selectAuthError = (s) => s.auth.error
export const selectAuthStep = (s) => s.auth.step
export const selectPendingEmail = (s) => s.auth.pendingEmail
export const selectAuthInitialized = (s) => s.auth.initialized
