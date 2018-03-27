// <editor-fold desc="Proxy Actions...">
/* Action types */

import {MazeInitData} from '../api/api';
import {Maze, Point, TpGameState, TpMaze} from '../dashthroughmaze/dash';

export type SET_PROXY_URL_ACTION_TYPE = 'proxy/setProxyUrl';
export const SET_PROXY_URL_ACTION_TYPE: SET_PROXY_URL_ACTION_TYPE = 'proxy/setProxyUrl';

export type VERIFY_PROXY_URL = 'proxy/verifyProxyUrl';
export const VERIFY_PROXY_URL: VERIFY_PROXY_URL = 'proxy/verifyProxyUrl';

export type SET_TEST_BUTTON_STATE = 'proxy/setTestButtonState';
export const SET_TEST_BUTTON_STATE: SET_TEST_BUTTON_STATE = 'proxy/setTestButtonState';

/* Action definitions */
export type SetProxyUrlAction = {
  type: SET_PROXY_URL_ACTION_TYPE;
  url: string;
};

export type ProxyUrlVerifiationResult = {
  success: boolean;
  error?: any;
};

export type VeryfyProxyUrlAction = {
  type: VERIFY_PROXY_URL;
  url: string;
  verificationResult?: ProxyUrlVerifiationResult;
};

export type SetProxyTestButtonStateAction = {
  type: SET_TEST_BUTTON_STATE;
  enabled: boolean;
};

export type ProxyActions = SetProxyUrlAction | VeryfyProxyUrlAction | SetProxyTestButtonStateAction;


/* Action creators */
export function setProxyUrl(url: string): SetProxyUrlAction {
  return {
    type: SET_PROXY_URL_ACTION_TYPE,
    url: url
  };
}

export function verifyProxyAction(url: string, verificationResult?: ProxyUrlVerifiationResult): VeryfyProxyUrlAction {
  return {
    type: VERIFY_PROXY_URL,
    url: url,
    verificationResult: verificationResult
  };
}

export function setProxyTestButtonState(enabled: boolean): SetProxyTestButtonStateAction {
  return {
    type: SET_TEST_BUTTON_STATE,
    enabled: enabled
  };
}
// </editor-fold>

// <editor-fold desc="Notification Actions..." >
/* Action types */

export type SHOW_NOTIFICATION_ACTION_TYPE = 'notification/show';
export const SHOW_NOTIFICATION_ACTION_TYPE: SHOW_NOTIFICATION_ACTION_TYPE = 'notification/show';


export type HIDE_NOTIFICATION_ACTION_TYPE = 'notification/hide';
export const HIDE_NOTIFICATION_ACTION_TYPE: HIDE_NOTIFICATION_ACTION_TYPE = 'notification/hide';

/* Action definitions */

export type ShowNotificationAction = {
  type: SHOW_NOTIFICATION_ACTION_TYPE;
  message: string;
  hideTimer?: number;
};

export type HideNotificationAction = {
  type: HIDE_NOTIFICATION_ACTION_TYPE
};

export type NotificationActions = ShowNotificationAction | HideNotificationAction;


/* Action creators */

export function showNotificaitonAction(message:string): ShowNotificationAction {
  return {
    type: SHOW_NOTIFICATION_ACTION_TYPE,
    message: message
  };
}

export function hideNotificationAction(): HideNotificationAction {
  return {
    type: HIDE_NOTIFICATION_ACTION_TYPE
  };
}

// </editor-fold>


// <editor-fold desc="Play Actions..." >
/* Action types */
export type INIT_MAZE_BUTTON_STATE_ACTION_TYPE = 'play/InitMazeButtonState';
export const INIT_MAZE_BUTTON_STATE_ACTION_TYPE: INIT_MAZE_BUTTON_STATE_ACTION_TYPE = 'play/InitMazeButtonState';


export type INIT_MAZE_REQUEST_ACTION_TYPE = 'play/InitMazeRequest';
export const INIT_MAZE_REQUEST_ACTION_TYPE: INIT_MAZE_REQUEST_ACTION_TYPE = 'play/InitMazeRequest';


export type INIT_MAZE_SUCCESS_ACTION_TYPE = 'play/InitMazeSuccess';
export const INIT_MAZE_SUCCESS_ACTION_TYPE: INIT_MAZE_SUCCESS_ACTION_TYPE = 'play/InitMazeSuccess';

export type GAME_CONTROLS_STATE_ACTION_TYPE = 'play/gameControlsState';
export const GAME_CONTROLS_STATE_ACTION_TYPE:GAME_CONTROLS_STATE_ACTION_TYPE = 'play/gameControlsState';

export type NEXT_MOVE_ACTION_TYPE = 'play/nextMove';
export const NEXT_MOVE_ACTION_TYPE:NEXT_MOVE_ACTION_TYPE = 'play/nextMove';

export type MOVE_DONE_ACTION_TYPE = 'play/moveDone';
export const MOVE_DONE_ACTION_TYPE:MOVE_DONE_ACTION_TYPE = 'play/moveDone';

/* Action definitions */

export type InitMazeButtonStateAction = {
  type: INIT_MAZE_BUTTON_STATE_ACTION_TYPE,
  enabled: boolean;
};

export type InitMazeRequestAction = {
  type: INIT_MAZE_REQUEST_ACTION_TYPE;
  proxyUrl: string;
  payload: MazeInitData;
};

export type InitMazeSuccessAction = {
  type: INIT_MAZE_SUCCESS_ACTION_TYPE,
  proxyUrl: string;
  mazeId: string;
  maze: TpMaze;
  initData: MazeInitData;
};

export type GameControlsStateAction = {
  type: GAME_CONTROLS_STATE_ACTION_TYPE,
  mazeId: string;
  enabled: boolean;
};

export type NextMoveAction = {
  type: NEXT_MOVE_ACTION_TYPE,
  proxyUrl: string;
  mazeId: string;
  maze: Maze;
  pony: Point;
  exitPath: Point[];
  escapeRoute: Point[] | undefined;
};

export type MoveDoneAction = {
  type: MOVE_DONE_ACTION_TYPE;
  mazeId: string;
  maze: Maze;
  pony: Point;
  domokun: Point;
  exitPath: Point[];
  escapeRoute: Point[] | undefined;
  gameState: TpGameState;
};

export type PlayActions =
  InitMazeButtonStateAction
  | InitMazeRequestAction
  | InitMazeSuccessAction
  | GameControlsStateAction
  | NextMoveAction
  | MoveDoneAction;


/* Action creators */

export function initMazeButtonStateAction(enabled: boolean): InitMazeButtonStateAction {
  return {
    type: INIT_MAZE_BUTTON_STATE_ACTION_TYPE,
    enabled: enabled
  };
}

export function initMazeRequestAction(proxyUrl: string, payload: MazeInitData): InitMazeRequestAction {
  return {
    type: INIT_MAZE_REQUEST_ACTION_TYPE,
    proxyUrl: proxyUrl,
    payload: payload
  };
}

export function initMazeSuccessAction(
  proxyUrl: string,
  mazeId: string,
  maze: TpMaze,
  initData: MazeInitData
): InitMazeSuccessAction {

  return {
    type: INIT_MAZE_SUCCESS_ACTION_TYPE,
    proxyUrl: proxyUrl,
    mazeId: mazeId,
    maze: maze,
    initData: initData,
  };
}

export function gameControlsStateAction(mazeId: string, enabled: boolean): GameControlsStateAction {
  return {
    type: GAME_CONTROLS_STATE_ACTION_TYPE,
    mazeId: mazeId,
    enabled: enabled
  };
}

export function nextMoveAction (proxyUrl: string,
                                mazeId: string,
                                maze: Maze,
                                pony: Point,
                                exitPath: Point[],
                                escapeRoute: Point[]| undefined
): NextMoveAction {
  return {
    type: NEXT_MOVE_ACTION_TYPE,
    mazeId: mazeId,
    proxyUrl: proxyUrl,
    maze: maze,
    pony: pony,
    exitPath: exitPath,
    escapeRoute: escapeRoute
  };
}

export function moveDone(
  mazeId: string,
  maze: Maze,
  pony: Point,
  domokun: Point,
  exitPath: Point[],
  escapeRoute: Point[] | undefined,
  gameState: TpGameState
): MoveDoneAction {

  return {
    type: MOVE_DONE_ACTION_TYPE,
    mazeId: mazeId,
    maze: maze,
    pony: pony,
    domokun: domokun,
    exitPath: exitPath,
    escapeRoute:escapeRoute,
    gameState: gameState
  };
}
// </editor-fold>




