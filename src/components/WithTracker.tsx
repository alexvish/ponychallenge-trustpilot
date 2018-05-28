import * as React from 'react';
import * as ReactGA from 'react-ga';
import {RouteProps} from 'react-router';

const trackPage = (page:string) => ReactGA.pageview('/ponychallenge-trustpilot' + page);

export const withTracker =  <P extends RouteProps>(WrappedComponent: React.ComponentType<P>) =>
  class WithTracker extends React.Component<P> {
     componentDidMount() {
       if (this.props && this.props.location) {
         trackPage(this.props.location.pathname);
       }
     }

     componentWillReceiveProps(nextProps:P) {
       if (
         this.props && this.props.location
         && nextProps && nextProps.location
         && (this.props.location !== nextProps.location)
       ) {
        trackPage(nextProps.location.pathname);
       }
     }

     render() {
       return <WrappedComponent {...this.props}/>;
     }
  };

export default withTracker;