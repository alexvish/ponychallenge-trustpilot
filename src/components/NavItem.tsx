import * as React from 'react';
import ListItem from 'material-ui/List/ListItem';
import ListItemIcon from 'material-ui/List/ListItemIcon';
import ListItemText from 'material-ui/List/ListItemText';
import * as PropTypes from 'prop-types';
import {History} from 'history';
import withStyles from 'material-ui/styles/withStyles';
import {WithStyles} from 'material-ui';
import {Route} from 'react-router';
// import {Link} from 'react-router-dom';

const decorate = withStyles((theme) => ({
  navActive: {
    background:  theme.palette.action.hover
  }
}));

export interface NavItemProps {
  icon?: React.ReactElement<any>;
  text: string;
  subText?: string;
  path: string;
}

function isNavClick( e: React.MouseEvent<HTMLInputElement>) {
  return !e.isDefaultPrevented() && e.button === 0 && !(!!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey));
}

class NavItem extends React.Component<NavItemProps & WithStyles<'navActive'>> {
  static contextTypes: React.ValidationMap<any> = {
    router: PropTypes.object.isRequired
  };

  handleClick = (e:React.MouseEvent<HTMLInputElement>) => {
    if (isNavClick(e)) {
      if (this.context && this.context.router && this.context.router.history) {
        const history = this.context.router.history as History;
        history.push(this.props.path);
      }
    }
  }

  render() {
    let icon:any = undefined;
    if (this.props.icon) {
      icon = (<ListItemIcon>{this.props.icon}</ListItemIcon>);
    }

    let text = <ListItemText primary={this.props.text} secondary={this.props.subText}/>;

    const routeChildren = ({location, match}) => {
      let classNames = '';
      if (match) {
        classNames += ' ' + this.props.classes.navActive;
      }


      return (
        <ListItem
          className={classNames}
          button={true}
          onClick={this.handleClick}
        >
          {icon}
          {text}
        </ListItem>);
    };

    return (
      <Route exact={true} path={this.props.path} children={routeChildren}/>
    );
  }
}

export default decorate(NavItem);