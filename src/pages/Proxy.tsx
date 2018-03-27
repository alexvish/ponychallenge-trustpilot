import * as React from 'react';

import ProxyMarkdown from './Proxy.md';
import ProxyForm from '../components/ProxyForm';
import {WithStyles} from 'material-ui';


class Proxy extends React.Component<WithStyles<'formRow'|'textField'>> {
  render() {
    return (
      <div>
        <ProxyMarkdown/>
        <ProxyForm/>
      </div>);
  }
}

export default Proxy;