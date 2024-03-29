import { createReducer, nanoid } from '@reduxjs/toolkit';
import {
  ApplicationModal,
  PopupContent,
  addPopup,
  changeThemeToDark,
  removePopup,
  setOpenModal,
  setOpenWarnning,
  updateBlockNumber,
  updateOutScale
} from './actions';

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly openModal: ApplicationModal | null
  readonly outScale: number
  readonly openWarnning: boolean | null
  readonly themeDark: boolean | null

}

const initialState: ApplicationState = {
  blockNumber: {},
  popupList: [],
  openModal: null,
  outScale: 0.001,
  openWarnning: false,
  themeDark: false
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateOutScale, (state, action) => {
      state.outScale = action.payload.outScale
    })
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload
    })
    .addCase(setOpenWarnning, (state, action) => {
      state.openWarnning = action.payload
    })
    .addCase(changeThemeToDark, (state, action) => {
      state.themeDark = action.payload
    })
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
      state.popupList = (key ? state.popupList.filter(popup => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs
        }
      ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
      state.popupList.forEach(p => {
        if (p.key === key) {
          p.show = false
        }
      })
    })
)
