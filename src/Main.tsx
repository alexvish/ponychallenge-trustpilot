import * as React from 'react';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {sagas as playSagas} from './reducer/play';
import rPlay from './reducer/play';
import {all} from 'redux-saga/effects';
import rProxy, {sagas as proxySagas} from './reducer/proxy';
import createHistory from 'history/createBrowserHistory';
import rNotification from './reducer/notification';
import createSagaMiddleware from 'redux-saga';
import {routerReducer, routerMiddleware, ConnectedRouter} from 'react-router-redux';
import {Provider} from 'react-redux';
import App from './App';


const theme = createMuiTheme();


const reducers = {
  ...rProxy,
  ...rNotification,
  ...rPlay,
};


const composeEnhancers = (window && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) || compose;
const browserHistory = createHistory({basename: '/ponychallenge-trustpilot'});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  composeEnhancers(applyMiddleware( sagaMiddleware, routerMiddleware(browserHistory)))
);

sagaMiddleware.run(function* () {
  yield all([
    ...proxySagas,
    ...playSagas,
  ]);
});



class Main extends React.Component<{}> {
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <ConnectedRouter history={browserHistory}>
            <App/>
          </ConnectedRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default Main;