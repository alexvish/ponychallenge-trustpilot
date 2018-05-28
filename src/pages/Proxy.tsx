import * as React from 'react';

import ProxyMarkdown from './Proxy.md';
import ProxyForm from '../components/ProxyForm';


class Proxy extends React.Component {
  render() {
    return (
      <div>
        <ProxyMarkdown/>
        <ProxyForm/>
      </div>);
  }
}

export default Proxy;