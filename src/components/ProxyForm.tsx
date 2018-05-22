import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import Badge from '@material-ui/core/Badge';
import DoneIcon from '@material-ui/icons//Done';
import Paper from '@material-ui/core/Paper';
import {setProxyUrl,verifyProxyAction} from '../actions/actions';

const decorate = withStyles((theme)=>({
  formRow: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    alignItems: 'baseline' as 'baseline'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  doneIcon: {
    color: 'darkgreen'
  }
}));

export interface ProxyFormProps {
  proxyUrl: string;
  proxyVerified: boolean;
  testButtonEnabled: boolean;
  onProxyUrlChange: (proxyUrl:string) => void;
  onProxyVerify: (proxyUrl: string) => void;
}

type ProxyFormPropsExt = ProxyFormProps & WithStyles<'formRow'|'textField'|'doneIcon'>;

class ProxyFormComponent extends React.Component<ProxyFormPropsExt> {

  handleProxyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {onProxyUrlChange} = this.props;
    if (onProxyUrlChange) {
      onProxyUrlChange(e.target.value);
    }
  }

  handleProxyVerify = () => {
    const {onProxyVerify, proxyUrl} = this.props;
    if ( onProxyVerify ) {
      onProxyVerify(proxyUrl);
    }
  }

  handleCloseError = () => {
    this.setState({showError: false, error: undefined});
  }


  componentWillMount() {
    this.setState({
      showError: false
    });
  }

  render() {
    const {classes, proxyUrl, proxyVerified, testButtonEnabled} = this.props;
    return (
      <Paper style={{padding: '50px 20px'}}>
        <div className={classes.formRow}>
          <TextField
            name="proxyUrl"
            className={classes.textField}
            label="Proxy URL"
            value={proxyUrl}
            placeholder="http://localhost:4040/"
            onChange={this.handleProxyUrlChange}
          />
          <Badge  badgeContent={proxyVerified?<DoneIcon className={classes.doneIcon}/>:''} color='default'>
            <Button variant="raised" disabled={!testButtonEnabled} onClick={this.handleProxyVerify}>Test</Button>
          </Badge>
        </div>
      </Paper>
    );
  }
}

export const VisibleProxyForm = decorate(ProxyFormComponent);


const mapStateToProps = (state) => ({
  proxyUrl: ((state.proxy && state.proxy.url) || '') as string,
  proxyVerified: !! (state.proxy && state.proxy.verified),
  testButtonEnabled: !! (state.proxy && state.proxy.testButtonEnabled)
});

const mapDispatchToProps = (dispatch) => ({
  onProxyUrlChange: (proxyUrl: string) => dispatch(setProxyUrl(proxyUrl)),
  onProxyVerify: (proxyUrl: string) => dispatch(verifyProxyAction(proxyUrl))
});

export default connect(mapStateToProps, mapDispatchToProps)(VisibleProxyForm);