import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../shared/hooks/redux'
import { loggedOut } from '../model/auth-slice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state.auth.user)
  const logout = useCallback(() => {
    dispatch(loggedOut())
    queryClient.clear()
  }, [dispatch, queryClient])

  return {
    user,
    isAuthenticated: Boolean(user),
    logout,
  }
}
