// import * as API from '../api/api';
import {
  ProxyActions,
  VeryfyProxyUrlAction,
  SET_PROXY_URL_ACTION_TYPE,
  VERIFY_PROXY_URL,
  SET_TEST_BUTTON_STATE,
  verifyProxyAction, showNotificaitonAction, setProxyTestButtonState
} from '../actions/actions';
import {call, put, takeEvery} from 'redux-saga/effects';
import * as API from '../api/api';

/* State shape */
type ProxyState = {
  url: string;
  verified: boolean;
  testButtonEnabled: boolean;
};

function verifyReducer(state: ProxyState, action: VeryfyProxyUrlAction): ProxyState {
  if (! action.verificationResult) {
    // not ready yet
    return state;
  }
  if (action.url !== state.url) {
    // url has changed while verification request have been sent
    return state;
  }
  return {
    ...state,
    verified: action.verificationResult.success
  };
}

const defaultState: ProxyState = { url: 'http://localhost:4040/', verified: false, testButtonEnabled: true};
/* reducer functions */
export function reducer(state: ProxyState = defaultState, action: ProxyActions): ProxyState {
  switch (action.type) {
    case SET_PROXY_URL_ACTION_TYPE:
      return {
        ...state,
        url: action.url,
        verified: false
      };
    case VERIFY_PROXY_URL:
      return verifyReducer(state, action);
    case SET_TEST_BUTTON_STATE:
      return {
        ...state,
        testButtonEnabled: action.enabled
      };
    default:
      return state;
  }
}

export function* verifyProxyUrlSaga(action: VeryfyProxyUrlAction) {
  yield put(setProxyTestButtonState(false));
  try {
    let url = action.url;
    let result = yield call(API.verifyApi, url);
    yield put(verifyProxyAction(url,{success: result.verified}));
  } catch (e) {
    let message = 'Test proxy url failed: ';
    if (typeof e === 'string') {
      message += e;
    } else if (typeof e.message === 'string') {
      message += e.message;
    }
    yield put(showNotificaitonAction(message));
  } finally {
    yield put(setProxyTestButtonState(true));
  }

}

export const sagas = [
  takeEvery(action=> action.type === VERIFY_PROXY_URL && ! (action.verificationResult),verifyProxyUrlSaga)
];

export default {proxy: reducer};