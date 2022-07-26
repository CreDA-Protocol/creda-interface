import { createAction } from '@reduxjs/toolkit'

export type PopupContent = {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  I18N,
  DOC
}

// 更新滑点
export const updateOutScale = createAction<{ outScale: number }>('application/updateOutScale')
export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'application/addPopup'
)
export const removePopup = createAction<{ key: string }>('application/removePopup')
export const setOpenWarnning = createAction<boolean>('application/setOpenWarnning')
export const changeThemeToDark = createAction<boolean>('application/themeDark')
