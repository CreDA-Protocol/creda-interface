import { useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NetworkTypeContext } from "../../contexts";
import { AppDispatch, AppState } from "../index";
import { setIsDark } from "../theme/actions";
import { setIsWalkThrough } from "../walkthrough/actions";
import {
  ApplicationModal,
  PopupContent,
  addPopup,
  removePopup,
  setOpenModal,
  setOpenWarnning
} from "./actions";

export function useOutScale(): number {
  return useSelector((state: AppState) => state.application.outScale);
}
export function useBlockNumber(): number | undefined {
  const { chainId } = useContext(NetworkTypeContext);

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1]
  );
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector(
    (state: AppState) => state.application.openModal
  );
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => dispatch(setOpenModal(open ? null : modal)),
    [dispatch, modal, open]
  );
}

export function useOpenModal(modal: ApplicationModal): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal]);
}

export function useCloseModals(): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch]);
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}

export function useToggleSettingsMenu(): () => void {
  return useToggleModal(ApplicationModal.SETTINGS);
}

export function useShowClaimPopup(): boolean {
  return useModalOpen(ApplicationModal.CLAIM_POPUP);
}

export function useToggleShowClaimPopup(): () => void {
  return useToggleModal(ApplicationModal.CLAIM_POPUP);
}

export function useToggleSelfClaimModal(): () => void {
  return useToggleModal(ApplicationModal.SELF_CLAIM);
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }));
    },
    [dispatch]
  );
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }));
    },
    [dispatch]
  );
}

// get the list of active popups
export function useActivePopups(): AppState["application"]["popupList"] {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}
export function useToasts(): AppState["toast"]["toasts"] {
  const list = useSelector((state: AppState) => state.toast.toasts);
  return useMemo(() => list, [list]);
}
export function useWarnning(): AppState["application"]["openWarnning"] {
  const warnning = useSelector(
    (state: AppState) => state.application.openWarnning
  );
  return warnning;
}
export function useOpenWarnning(open: boolean): () => void {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setOpenWarnning(open)), [dispatch, open]);
}
export function useTheme(): AppState["theme"]["isDark"] {
  return useSelector((state: AppState) => state.theme.isDark);
}
export function useChangeTemeDark(): () => void {
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useTheme();
  return useCallback(() => dispatch(setIsDark(!isDark)), [dispatch, isDark]);
}
export function useWalkThrough(): (key: Number) => void {
  const dispatch = useDispatch();

  return useCallback(
    (key: Number) => {
      dispatch(setIsWalkThrough(key));
    },
    [dispatch]
  );
}
export function useWalkThroughStep(): AppState["walkThrough"]["isWalkThrough"] {
  return useSelector((state: AppState) => state.walkThrough.isWalkThrough);
}
