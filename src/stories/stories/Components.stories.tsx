import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {VisibleProxyForm} from '../../components/ProxyForm';
import { action } from '@storybook/addon-actions';
import {VisibleGameInitForm} from '../../components/GameInitForm';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect, Provider} from 'react-redux';
import rNotification from '../../reducer/notification';
import {showNotificaitonAction} from '../../actions/actions';
import {combineReducers, createStore} from 'redux';
import Notification from '../../components/Notification';
import {VisualGame} from '../../components/Game';
import createMaze from './testmaze';
import Trustpilot from '../../components/Trustpilot';

interface NotificationCallFormState {
    message: string;
    timeout: number;
}

interface NotificationCallFormProps {
    onDisplayRequest:(state: NotificationCallFormState) => void;
}


export class VisibleNotificationCallForm extends React.Component<NotificationCallFormProps, NotificationCallFormState> {
    componentWillMount() {
        this.setState({
          message: 'My Message',
          timeout: 5000
        });
    }
    handleChange = (name, isNumber:boolean)=>event=> {
        let val = event.target.value;
        if (isNumber) {
            val = parseInt(val,10);
            if (isNaN(val)) {
                return;
            }
        }
        this.setState({[name]:val} as NotificationCallFormState);
    }

    handleDisplayRequest = () => {
        if (this.props.onDisplayRequest) {
            this.props.onDisplayRequest({...this.state});
        }
    }

    render() {
      const {message} = this.state;
      return (
        <div>
            <div style={{display: 'flex', margin: 8}}>
                <TextField
                  style={{margin: 8, width: 500}}
                  value={message}
                  label="message"
                  onChange={this.handleChange('message',false)}
                />
            </div>
            <div style={{margin: 8}}>
                <Button
                  style={{margin: 8}}
                  variant="raised"
                  color="primary"
                  onClick={this.handleDisplayRequest}
                  value="Display"
                >
                    Display
                </Button>
            </div>
        </div>
      );
    }
}

export const NotificationCallForm = connect(()=>({}),(dispatch)=>({
  onDisplayRequest: (state: NotificationCallFormState) => { dispatch(showNotificaitonAction(state.message)); }
}) )(VisibleNotificationCallForm);

storiesOf('Components', module)
  .add('Proxy Form',()=> {
    return (
      <div>
        <h3>Empty proxy form</h3>
        <VisibleProxyForm
          proxyUrl=""
          testButtonEnabled={true}
          proxyVerified={false}
          onProxyUrlChange={action('empty-proxy-url-change')}
          onProxyVerify={action('empty-proxy-verify')}
        />
        <h3>With Url</h3>
        <VisibleProxyForm
          proxyUrl="http://localhost:4040/"
          proxyVerified={false}
          testButtonEnabled={true}
          onProxyUrlChange={action('proxy-url-change')}
          onProxyVerify={action('proxy-verify')}
        />
        <h3>With Url: Verified</h3>
        <VisibleProxyForm
          proxyUrl="http://localhost:4040/"
          proxyVerified={true}
          testButtonEnabled={true}
          onProxyUrlChange={action('proxy-url-change')}
          onProxyVerify={action('proxy-verify')}
        />
      </div>
    );
  })
  .add('Game Init Form', () => {
    // Component depend on proxy verified state
    let store = createStore((state = {proxy: {url: '', verified: true}}) =>state);
    return (
      <Provider store={store}>
        <VisibleGameInitForm proxyUrl={''} onStart={action('on-start')}/>
      </Provider>
    );
  }).add('Notificaiton', ()=> {
    let store = createStore(combineReducers({
      ...rNotification
    }));


    return (
      <Provider store={store}>
        <div>
          <NotificationCallForm/>
          <Notification/>
        </div>
      </Provider>
    );
  })
  .add('Game', () => {
    let maze = createMaze();
    let exitPath = maze.exitPath();
    let pony = maze.pony;
    let domokun = maze.domokun;
    return (
      <VisualGame
        maze={maze}
        exitPath={exitPath}
        handleNextMove={action('next-move')}
        pony={pony}
        domokun={domokun}
        mazeId="test"
        proxyUrl={"none"}
        escapeRoute={undefined}
        controlsEnabled={true}
        gameState={{
          state: 'Active',
          'state-result': 'test',
        }}
      />);
  })
  .add('Trustpilot', () => (<Trustpilot/>));