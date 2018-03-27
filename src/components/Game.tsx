import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import {WithStyles} from 'material-ui';
import {connect} from 'react-redux';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import {Maze, Point, TpGameState} from '../dashthroughmaze/dash';
import {MazeComponent} from './Maze';
import {nextMoveAction} from '../actions/actions';

const decorate = withStyles((theme) => ({
  root: {
    padding: theme.spacing.unit
  },
  gameControls: {
    display: 'flex',
    margin: `${theme.spacing.unit} 0`
  },
  button: {
    margin: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  }
}));

export interface GameProps {
  mazeId: string;
  controlsEnabled: boolean;
  maze: Maze;
  domokun: Point;
  pony: Point;
  exitPath: Point[];
  escapeRoute: Point[]|undefined;
  gameState: TpGameState;
  proxyUrl: string;
  handleNextMove: (proxyUrl: string,
                   maze: Maze,
                   pony: Point,
                   exitPath: Point[],
                   escapeRoute: Point[] | undefined
  ) => void;
}

export interface GameState {
  play: boolean;
  playTimer?: number;
}

type GamePropsExt = GameProps & WithStyles<'root'|'gameControls'|'button'|'playIcon'>;

const MOVE_TIMEOUT = 2000;

class GameComponent extends React.Component<GamePropsExt, GameState> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      play: false
    };
  }

  schelduleNextMove = () => {
    if (this.state.playTimer) {
      clearTimeout(this.state.playTimer);
    }
    if (this.state.play) {
      let t = setTimeout(this.handleNextMove, MOVE_TIMEOUT as  (number|undefined));
      this.setState({
        playTimer: t
      });
    }
  }

  cancelNextMove = () => {
    if (this.state.playTimer) {
      clearTimeout(this.state.playTimer);
      this.setState({
        playTimer: undefined
      });
    }
  }

  handleNextMove = () => {
    if (this.props.handleNextMove) {
      const {
        proxyUrl,
        maze,
        pony,
        exitPath,
        escapeRoute,
      } = this.props;
      this.props.handleNextMove(
        proxyUrl,
        maze,
        pony,
        [...exitPath],
        escapeRoute? [...escapeRoute] : escapeRoute
        );
    }
    this.schelduleNextMove();
  }

  handlePlayButton = () => {
    this.setState({
      play: !this.state.play
    },            ()=>this.schelduleNextMove());
  }

  componentDidMount() {
    this.schelduleNextMove();
  }

  componentWillUnmount() {
    this.cancelNextMove();
  }

  componentWillReceiveProps(nextProps: GamePropsExt) {
    if (nextProps.gameState.state !== 'Active' && nextProps.gameState.state !== 'active') {
      this.cancelNextMove();
      this.setState({
        play: false
      });
    }
  }


  render() {
    const {classes,mazeId, maze, pony, domokun, controlsEnabled, gameState, escapeRoute} = this.props;
    const {play} = this.state;
    const {handlePlayButton, handleNextMove} = this;
    const activeState = (gameState.state === 'Active' || gameState.state === 'active');
    const controlsEnabledExt = controlsEnabled && activeState;
    let exitPath = this.props.exitPath as Point[] | undefined;
    if (escapeRoute) {
      exitPath = undefined;
    }
    let hiddenUrl = gameState['hidden-url'];
    if (hiddenUrl) {
      hiddenUrl = `https://ponychallenge.trustpilot.com${hiddenUrl}`;
    }
    return (
      <Paper className={classes.root}>
        <div>
          <Typography variant="body1">Game id: {mazeId}</Typography>
          <Typography variant="body1">
            Game state: {gameState.state} - {gameState['state-result']}
            {hiddenUrl && <span> Hidden url: <a href={hiddenUrl} target={'_blank'}>{hiddenUrl}</a></span>}
          </Typography>
        </div>
        <div className={classes.gameControls}>
          <IconButton className={classes.button} onClick={handlePlayButton} disabled={!activeState}>
            {play? <PauseIcon className={classes.playIcon}/>:<PlayArrowIcon className={classes.playIcon}/>}
          </IconButton>
          <IconButton className={classes.button} onClick={handleNextMove} disabled={!controlsEnabledExt}>
            <SkipNextIcon/>
          </IconButton>
        </div>
        <MazeComponent
          maze={maze}
          pony={pony}
          domokun={domokun}
          exit={maze.exit}
          exitPath={exitPath}
          escapeRoute={escapeRoute}
        />
      </Paper>
    );
  }
}

export const VisualGame = decorate(GameComponent);

const mapStateToProps = (state, ownProps) => {
  const s = state.games.games[ownProps.mazeId] as {
    name: string;
    maze: Maze;
    pony: Point;
    domokun: Point;
    exitPath: Point[];
    escapeRoute: Point[] | undefined;
    gameState: TpGameState;
    controlsEnabled: boolean;
  };
  return {
    proxyUrl: ((state.proxy && state.proxy.url) || '') as string,
    controlsEnabled: s.controlsEnabled,
    maze: s.maze,
    domokun: s.domokun,
    pony: s.pony,
    exitPath: s.exitPath,
    escapeRoute: s.escapeRoute,
    gameState: s.gameState
  };
};

const mapDispathToProps = (dispatch, ownProps) => ({
  handleNextMove:
    (proxyUrl: string,
     maze: Maze,
     pony: Point,
     exitPath: Point[],
     escapeRoute: Point[] | undefined
    ) =>

      dispatch(nextMoveAction(
        proxyUrl,
        ownProps.mazeId,
        maze,
        pony,
        exitPath,
        escapeRoute))
});

export default connect(mapStateToProps, mapDispathToProps)(VisualGame);