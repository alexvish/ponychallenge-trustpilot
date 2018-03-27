import * as React from 'react';
import './App.css';
import CssBaseline from 'material-ui/CssBaseline';
import 'typeface-roboto';
import 'highlight.js/styles/github-gist.css';
import Notification from './components/Notification';
import Layout from './components/Layout';
import {Route} from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div>
        <CssBaseline/>
        <Route path="/" component={Layout}/>
        <Notification/>
      </div>
    );
  }
}

export default App;
