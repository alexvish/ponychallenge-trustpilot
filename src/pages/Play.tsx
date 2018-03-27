import * as React from 'react';

import GameInitForm from '../components/GameInitForm';
import Game from '../components/Game';
import {Redirect, Route, Switch} from 'react-router';
import {connect} from 'react-redux';


export interface GameOrRedirectProps {
  mazeId: string;
  mazeState: any;
}
export class VisibleGameOrRedirect extends React.Component<GameOrRedirectProps> {
  render() {
    const {mazeState, mazeId} = this.props;
    if (mazeState === undefined) {
      return (<Redirect to="/play"/>);
    } else {
      return (<Game mazeId={mazeId} />);
    }
  }
}

export const GameOrRedirect = connect((state:any, ownProps:any)=>({
  mazeState: state.games.games[ownProps.mazeId]
}))(VisibleGameOrRedirect);


class Play extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/play" exact={true} component={GameInitForm}/>
        <Route
          path="/play/:mazeId"
          component={({match}) => (
            <GameOrRedirect mazeId={match.params.mazeId}/>
            )}
        />
      </Switch>
    );
  }
}


export default Play;