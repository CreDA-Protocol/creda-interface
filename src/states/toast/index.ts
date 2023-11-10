import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../index";
import {addTransaction} from "../transactions/actions";
import {useCallback} from "react";
import {removePopup} from "../application/actions";
export enum ToastStatus {
    success=0,
    warning=1,
    error=2
}
interface ToastState {
    type:ToastStatus,
    content:string
}

const initialState:{
    toasts:ToastState[]
} = {
    toasts:[]
}

export const toastSlice = createSlice({
    name:"toast",
    initialState,
    reducers:{
        addToast:(state,action:PayloadAction<ToastState>)=>{
            state.toasts.push(action.payload)
        },
        popToast:(state)=>{
            state.toasts.shift()
        },
    }
})

export const {addToast,popToast} = toastSlice.actions

export function useAddToast(){
    const dispatch = useDispatch<AppDispatch>()
    return useCallback((type?:ToastStatus,content?:string)=>{
        if(type!==ToastStatus.warning && type!==ToastStatus.success && type!==ToastStatus.error){
            return;
        }
        if(!content){
            return
        }
        dispatch(addToast({type,content}))
    },[dispatch])

}
// returns a function that allows removing a popup via its key
export function usePopToast() {
    const dispatch = useDispatch()
    return useCallback(
        () => {
            dispatch(popToast())
        },
        [dispatch]
    )
}
export default toastSlice.reducer
