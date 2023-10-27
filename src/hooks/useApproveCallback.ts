import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: any,
  spender?: string
): [ApprovalState, () => Promise<void>] {

  const approvalState: ApprovalState = useMemo(() => {
    return ApprovalState.APPROVED
  }, [])

  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

  }, [amountToApprove, spender])

  return [approvalState, approve]
}
