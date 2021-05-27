import { StateType } from "typesafe-actions";
import { RawUserInterface } from "@base/core/types";
import { AuthResult } from "./services/AuthCheck";

export enum LoginMethodEnum {
  AUTO = "auto",
  MANUALLY = "manually"
}

export type LoginMethod =
  | LoginMethodEnum.AUTO
  | LoginMethodEnum.MANUALLY
  | undefined;

export enum AUTH_STAGES {
  INITIAL = "INITIAL",
  UNSIGNED = "UNSIGNED",
  SIGNED = "SIGNED",
  CHECKING = "CHECKING",
  ERROR = "ERROR",
  EXPIRED = "EXPIRED"
}

export enum AUTH_EVENTS {
  LOGGED_OUT = "LOGGED_OUT",
  LOGGED_IN_OTHER = "LOGGED_IN_OTHER",
  LOGGED_IN = "LOGGED_IN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  START_CHECK = "START_CHECK"
}

export interface RegistryClient {
  client_key: string;
  client_secret: string;
}

export interface SystemInfo {
  id: string;
  hid: string;
  token: string;
  path: string;
  name: string;
}

export interface ClientInfo {
  access: string;
  user_id: string;
  access_token: string;
  ns: string;
  nstoken: string;
  intercom: string;
  intercom_android: string;
  intercom_ios: string;
}

export interface LoginPayload {
  system?: SystemInfo;
  sys_url: string;
  share_url: string;
  socket_url: string;
  client?: ClientInfo;
  viewer?: RawUserInterface;
  people: RawUserInterface[];
  emoji: any;
  applist: any;
}

export interface AuthenticationParams {
  client_key: string;
  access_token: string;
  client_auth: number;
}

export interface Credentials {
  clientKey: string;
  clientSecret: string;
  accessToken: string;
  sysUrl: string;
  intercomToken: string;
  systemName: string;
}

export interface AuthState {
  stage: AUTH_STAGES;
  method: LoginMethod;
  client_key: string | undefined;
  access_token: string | undefined;
  share_url: string;
  socket_url: string;
  sys_url: string;
  intercom_token: string;
  firebase_token: string;
  system: string;
}

export type ModuleState = StateType<
  typeof import("./store/rootReducers").default
>;

export interface AuthResultPayload {
  result: AuthResult;
  method: LoginMethod;
}
