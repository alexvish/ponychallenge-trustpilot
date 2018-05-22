import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons//Close';
import withStyles from '@material-ui/core/styles/withStyles';
import {WithStyles} from '@material-ui/core/styles';
import {hideNotificationAction} from '../actions/actions';
import {connect} from 'react-redux';


const decorate = withStyles(theme => ({
  closeIcon: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  }
}));

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: ()=> void;
}

class NotificationComponent extends React.Component<NotificationProps & WithStyles<'closeIcon'>> {
  handleClose = () => {
    const {onClose} = this.props;
    if (onClose) {
      onClose();
    }
  }

  render() {
    const {show,message,classes} = this.props;
    return (
      <Snackbar
        message={<span id="message">{message}</span>}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        autoHideDuration={5000}
        action={
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.closeIcon}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>}
        open={show}
        onClose={this.handleClose}
      />
    );
  }
}

export const VisibleNotification = decorate(NotificationComponent);

const mapStateToProps = (state)=>({
  message: String(state.notification && state.notification.message),
  show: !! (state.notification && state.notification.show)

});


const mapDispatchToProps = (dispatch) => ({
  onClose: () => { dispatch(hideNotificationAction()); }
});


export default connect(mapStateToProps, mapDispatchToProps)(VisibleNotification);