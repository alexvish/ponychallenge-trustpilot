import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {FormLabel, FormControlLabel, FormControl, Radio, RadioGroup} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {connect} from 'react-redux';
import CheckProxyOk from './CheckProxyOk';
import {MazeInitData} from '../api/api';
import {initMazeRequestAction} from '../actions/actions';
import MenuItem from '@material-ui/core/MenuItem';

export type MazeRequestPayload = MazeInitData;


const decorate = withStyles((theme) => ({
  root: {
    padding: '50px 20px'
  },
  row: {
    display: 'flex' as 'flex',
    alignItems: 'baseline' as 'baseline',
    margin: `${theme.spacing.unit}px 0`
  },
  selField: {
    width: 80,
    margin: theme.spacing.unit
  },

  selMenu: {
    width: 80
  },

  rGroup: {
    margin: `${theme.spacing.unit}px 0`
  }

}));

function rangeMenuItems(len: number, from: number) {
  return Array(len).fill(1).map((e,i)=> i+from)
    .map(i=> (<MenuItem key={i} value={i}>{i}</MenuItem>));
}

export interface GameInitFormProps {
  proxyUrl: string;
  onStart: (proxyUrl: string, req: MazeRequestPayload) => void;
}





type GameInitFormPropsExt = GameInitFormProps & WithStyles<'root'|'row'|'selField'|'selMenu'|'rGroup'>;

class GameInitFormComponent extends React.Component<GameInitFormPropsExt, MazeRequestPayload> {
  constructor(props: any, context?: any) {
    super(props, context);
  }

  componentWillMount() {
    this.setState({
      'maze-width': 15,
      'maze-height': 15,
      'maze-player-name': 'pinkie pie',
      difficulty: 1
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    } as MazeRequestPayload);
  }

  handleStart = event => {
    if (this.props.onStart) {
      this.props.onStart(this.props.proxyUrl, {...this.state});
    }
  }

  render() {
    const {classes} = this.props;
    return (
      <Paper className={classes.root}>
        <CheckProxyOk />
        <div className={classes.row}>
          <FormLabel >Maze Dimensions:</FormLabel>
          <TextField
            id="width"
            name="maze-width"
            label="Width"
            className={classes.selField}
            select={true}
            value={this.state['maze-width']}
            onChange={this.handleChange('maze-width')}
            SelectProps={{
              MenuProps: {
                className: classes.selMenu
              }
            }}
          >
            {rangeMenuItems(11,15)}
          </TextField>
          <FormLabel>X</FormLabel>
          <TextField
            id="height"
            name="maze-height"
            label="Height"
            className={classes.selField}
            select={true}
            value={this.state['maze-height']}
            onChange={this.handleChange('maze-height')}
            SelectProps={{
              MenuProps: {
                className: classes.selMenu
              }
            }}
          >
            {rangeMenuItems(11,15)}
          </TextField>
        </div>
        <FormControl component="fieldset">
          <FormLabel>Pony:</FormLabel>
          <RadioGroup
            aria-label="pony name"
            name="maze-player-name"
            className={classes.rGroup}
            value={this.state['maze-player-name']}
            onChange={this.handleChange('maze-player-name')}
          >
            <FormControlLabel value="fluttershy" control={<Radio />} label="Fluttershy" />
            <FormControlLabel value="pinkie pie" control={<Radio />} label="Pinkie Pie" />
          </RadioGroup>
        </FormControl>
        <div className={classes.row}>
          <FormLabel >Difficulty:</FormLabel>
          <TextField
            id="difficulty"
            name="difficulty"
            className={classes.selField}
            select={true}
            value={this.state['difficulty']}
            onChange={this.handleChange('difficulty')}
            SelectProps={{
              MenuProps: {
                className: classes.selMenu
              }
            }}
          >
            {rangeMenuItems(10,1)}
          </TextField>
        </div>
        <div className={classes.row}>
          <Button onClick={this.handleStart} variant="raised" color="primary">Start</Button>
        </div>
      </Paper>
    );
  }
}

export const VisibleGameInitForm = decorate(GameInitFormComponent);

const mapStateToProps = state => ({
  proxyUrl: ((state.proxy && state.proxy.url) || '') as string
});

const mapDispatchToProps = (dispatch) => ({
  onStart: (proxyUrl: string, form: MazeRequestPayload) => { dispatch(initMazeRequestAction(proxyUrl, form)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(VisibleGameInitForm);