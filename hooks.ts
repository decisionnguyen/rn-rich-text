import { ModuleState, LoginMethod } from "./types";
import { useCallback } from "react";
import { AuthCheckService, AuthResult } from "./services/AuthCheck";
import { useSelector, useDispatch } from "react-redux";
import {
  onBaseAccountLoggedOut,
  onBaseAccountLoggedIn,
  resetStoreData
} from "./store/auth";
import useAsyncFn from "@base/core/hooks/useAsyncFn";
import AuthService from "./services/Auth";

export const useOpenMasterApp = () => {
  return useCallback(AuthCheckService.goToMasterApp, []);
};

export const useAuth = () => {
  return useSelector((state: ModuleState) => {
    return state.auth;
  });
};

export const useResetStoreData = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(resetStoreData()), []);
};

export const useLoggedOut = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(onBaseAccountLoggedOut()), []);
};

export const useLoggedIn = () => {
  const dispatch = useDispatch();
  return useCallback(
    (authResult: AuthResult, method?: LoginMethod) =>
      dispatch(
        onBaseAccountLoggedIn({
          result: authResult,
          method
        })
      ),
    []
  );
};

export const useInstalled = () => {
  return useCallback(async () => {
    const installed = await AuthCheckService.canOpenIosApp();
    return installed;
  }, []);
};

export const useLogout = () => {
  return useAsyncFn(AuthService.logout);
};
