import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  selectProfile,
  selectProfileLoading,
  selectUpdateSuccess,
  fetchProfile,
  updateProfile,
  clearUpdateSuccess,
} from '../store/slices/profileSlice'

export const useProfile = () => {
  const dispatch = useDispatch()
  const profile = useSelector(selectProfile)
  const loading = useSelector(selectProfileLoading)
  const updateSuccess = useSelector(selectUpdateSuccess)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Profile updated!')
      dispatch(clearUpdateSuccess())
    }
  }, [updateSuccess, dispatch])

  const handleUpdate = useCallback(async (data) => {
    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) return true
    toast.error(result.payload || 'Failed to update')
    return false
  }, [dispatch])

  return { profile, loading, handleUpdate }
}
