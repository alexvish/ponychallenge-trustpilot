import * as React from 'react';
import {showNotificaitonAction} from '../actions/actions';
import {connect} from 'react-redux';
import {replace} from 'react-router-redux';

interface CheckProxyOkProps {
  proxyOk: boolean;
  notify: (message: string) => void;
}

export class VisibleCheckProxyOk extends React.Component<CheckProxyOkProps> {
  componentWillMount() {
    if (!this.props.proxyOk) {
      this.props.notify('Set up Proxy first');
    }
  }

  render() {
    return '';
  }
}

const mapStateToProps = (state) => ({
  proxyOk: !! (state.proxy && state.proxy.verified)
});

const mapDispatchToProps = (dispatch) => ({
  notify: (message) => {
    dispatch(showNotificaitonAction(message));
    dispatch(replace('/proxy'));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VisibleCheckProxyOk);