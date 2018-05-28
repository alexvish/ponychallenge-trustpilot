import * as React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-roboto';
import 'highlight.js/styles/github-gist.css';
import Notification from './components/Notification';
import Layout from './components/Layout';
import {Route} from 'react-router';
import * as ReactGA from 'react-ga';

class App extends React.Component {
  componentDidMount() {
    ReactGA.initialize('UA-5906307-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }


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
