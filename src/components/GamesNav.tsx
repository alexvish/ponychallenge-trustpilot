import * as React from 'react';
import {connect} from 'react-redux';
import NavItem from './NavItem';
import {RouteComponentProps, withRouter} from 'react-router';

export interface GameNavComponentProps {
  games: {
    [mazeId: string]: {
      name: string;
    }
  };
}

export class GameNavComponent extends React.Component<GameNavComponentProps & RouteComponentProps<any>> {
  render() {
    let {games} = this.props;
    let items = Object.keys(games)
      .map(mazeId=> <NavItem text={games[mazeId].name} path={`/play/${mazeId}`} key={mazeId}/>);

    return items;
  }
}

const mapStateToProps = state => ({
  games: state.games.games
});

export default withRouter(
  connect(mapStateToProps)(GameNavComponent)
);