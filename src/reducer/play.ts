/*State shape*/
import {
  GAME_CONTROLS_STATE_ACTION_TYPE,
  gameControlsStateAction,
  INIT_MAZE_BUTTON_STATE_ACTION_TYPE,
  INIT_MAZE_REQUEST_ACTION_TYPE,
  INIT_MAZE_SUCCESS_ACTION_TYPE,
  initMazeButtonStateAction,
  InitMazeRequestAction, InitMazeSuccessAction,
  initMazeSuccessAction,
  MOVE_DONE_ACTION_TYPE,
  moveDone,
  MoveDoneAction,
  NEXT_MOVE_ACTION_TYPE,
  NextMoveAction,
  PlayActions,
  showNotificaitonAction
} from '../actions/actions';
import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import * as API from '../api/api';
import {Maze, moveDirection, Point, TpGameState} from '../dashthroughmaze/dash';
import {push} from 'react-router-redux';
import {isUndefined} from "util";

type GamesState = {
  games: {
    [mazeId: string]: {
      name: string;
      maze: Maze;
      pony: Point;
      domokun: Point;
      exitPath: Point[];
      escapeRoute: Point[] | undefined;
      gameState: TpGameState;
      controlsEnabled: boolean;
    }
  }
  initMazeButtonState: {
    enabled: boolean;
  }
};

export const defaultState: GamesState = {
  games: {},
  initMazeButtonState: {
    enabled: true
  }
};

function moveDoneReducer(state: GamesState, action: MoveDoneAction): GamesState {
  const {mazeId, maze, pony, domokun, exitPath, escapeRoute, gameState} = action;
  return {
    ...state,
    games: {
      ...state.games,
      [mazeId]: {
        ...state.games[mazeId],
        maze: maze,
        pony: pony,
        domokun: domokun,
        exitPath: exitPath,
        escapeRoute: escapeRoute,
        gameState: gameState
      }
    }
  };

}

function initMazeSuccessReducer(state: GamesState, action: InitMazeSuccessAction): GamesState {
  const {mazeId, maze, initData} = action;
  const player = initData['maze-player-name'];
  const width = initData['maze-width'];
  const height = initData['maze-height'];
  const difficulty = initData.difficulty;
  const name = `${player} (${width}X${height}) ${difficulty}`;

  const m = new Maze(maze);
  const pony = m.pony;
  const domokun = m.domokun;

  const gameState = maze['game-state'];
  const exitPath = m.exitPath();
  exitPath.shift();

  return {
    ...state,
    games: {
      ...state.games,
      [mazeId]: {
        name: name,
        maze: new Maze(maze),
        pony: pony,
        domokun: domokun,
        exitPath: exitPath,
        escapeRoute: undefined,
        gameState: gameState,
        controlsEnabled: true
      }
    }
  };

}

export function reducer(state: GamesState = defaultState, action: PlayActions ) {
  switch(action.type) {
    case INIT_MAZE_BUTTON_STATE_ACTION_TYPE:
      return {
        ...state,
        initMazeButtonState: {
          enabled: action.enabled
        }
      };
    case INIT_MAZE_SUCCESS_ACTION_TYPE:
      return initMazeSuccessReducer(state,action);

    case GAME_CONTROLS_STATE_ACTION_TYPE:
      return {
        ...state,
        games: {
          ...state.games,
          [action.mazeId]: {
            ...state.games[action.mazeId],
            controlsEnabled: action.enabled
          }
        }
      };
    case MOVE_DONE_ACTION_TYPE:
      return moveDoneReducer(state,action);
    default:
      return state;
  }
}

export function* initMaze(action: InitMazeRequestAction) {
  yield put(initMazeButtonStateAction(false));
  try {
    let {proxyUrl, payload} = action;
    let mazeId = yield call(API.initMaze, proxyUrl, payload);
    let tpMaze = yield call(API.getMaze, proxyUrl, mazeId);
    yield put(initMazeSuccessAction(proxyUrl, mazeId, tpMaze, payload));
    // redirect to game
    yield put(push(`/play/${mazeId}`));
  } catch (e) {
    let message = 'Init maze failed: ';
    if (typeof e === 'string') {
      message += e;
    } else if (typeof e.message === 'string') {
      message += e.message;
    }
    yield put(showNotificaitonAction(message));
  } finally {
    yield put(initMazeButtonStateAction(true));
  }
}

export function* move(action: NextMoveAction) {
  const {mazeId, proxyUrl, maze, exitPath} = action;

  yield put(gameControlsStateAction(mazeId, false));
  try {
    let {pony, escapeRoute} = action;

    let nextPoint: Point;
    if (maze.isDomokunNearPoint(exitPath[0])) {
      if (isUndefined(escapeRoute)) {
        escapeRoute = maze.escapeRoute();
        escapeRoute.shift();
      }
      if (escapeRoute.length === 0) {
        // we are loosing
        nextPoint = exitPath.shift() as Point;
      } else {
        nextPoint = escapeRoute.shift() as Point;
        exitPath.unshift(pony);
      }
    } else {
      escapeRoute = undefined;
      nextPoint = exitPath.shift() as Point;
    }
    let direction = moveDirection(pony, nextPoint);
    if (isUndefined(direction)) {
      let f = pony;
      let t = nextPoint;
      throw new Error(`No move from (${f.x}, ${f.y}) to (${t.x}, ${t.y}))`);
    }


    yield call(API.move, proxyUrl, mazeId, direction);
    const tpMaze = yield call(API.getMaze, proxyUrl, mazeId);
    maze.update(tpMaze);
    pony = maze.pony;
    const domokun = maze.domokun;
    const gameState = tpMaze['game-state'];

    yield put(moveDone(mazeId, maze, pony, domokun, exitPath, escapeRoute, gameState));
  } catch(e) {
    let message = 'Move failed: ';
    if (typeof e === 'string') {
      message += e;
    } else if (typeof e.message === 'string') {
      message += e.message;
    }
    yield put(showNotificaitonAction(message));
  } finally {
    yield put(gameControlsStateAction(mazeId, true));
  }
}

export const sagas = [
  takeEvery(INIT_MAZE_REQUEST_ACTION_TYPE,initMaze),
  takeLatest(NEXT_MOVE_ACTION_TYPE, move)
];

export default {games: reducer};