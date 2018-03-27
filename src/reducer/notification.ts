import {
  SHOW_NOTIFICATION_ACTION_TYPE,
  HIDE_NOTIFICATION_ACTION_TYPE, NotificationActions
} from '../actions/actions';

export const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

/* State shape */
export type NotificationState = {
  show: boolean;
  message?: string;
};


const defaultState: NotificationState = {
  show: false
};


export function reducer(state: NotificationState = defaultState, action: NotificationActions): NotificationState {
  switch(action.type) {
    case SHOW_NOTIFICATION_ACTION_TYPE:
      return {
        ...state,
        show: true,
        message: action.message,
      };
    case HIDE_NOTIFICATION_ACTION_TYPE:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
}

export default {notification: reducer};