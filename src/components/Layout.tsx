import * as React from 'react';
import {WithStyles, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons//Menu';
import HomeIcon from '@material-ui/icons//Home';
import DoneIcon from '@material-ui/icons//Done';
import SettingsApplicationsIcon from '@material-ui/icons//SettingsApplications';
import FlagIcon from '@material-ui/icons//Flag';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import NavItem from './NavItem';
import Badge from '@material-ui/core/Badge';
import {connect} from 'react-redux';
import Play from '../pages/Play';
import Proxy from '../pages/Proxy';
import Home from '../pages/Home';
import {Redirect, Route, Switch} from 'react-router';
import GamesNav from './GamesNav';
import {Theme} from '@material-ui/core';
import withTracker from './WithTracker';


const drawerWidth = 240;

interface ProxyIconProps {
  proxyOk: boolean;
}
export const VisualProxyIcon: React.SFC<ProxyIconProps> = (props) => {
  return (
    <Badge  badgeContent={props.proxyOk?<DoneIcon style={{color:'darkgreen'}}/>:''} color='default'>
      <SettingsApplicationsIcon/>
    </Badge>
  );
};

const proxyIconMapStateToProps = (state) => ({
  proxyOk: !! (state.proxy && state.proxy.verified)
});
export const ProxyIcon = connect(proxyIconMapStateToProps)(VisualProxyIcon);
const decorate = withStyles((theme: Theme)=>({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden' as 'hidden',
    position: 'relative' as 'relative',
    display: 'flex',
    width: '100%'
  },
  appBar: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 'auto',
    right: 0,
    marginLeft: drawerWidth,
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      paddingLeft: 2*theme.spacing.unit
    },
  },
  navIconHide: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: '100vh',
    [theme.breakpoints.up('lg')]: {
      position: 'fixed' as 'fixed',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflow: 'auto' as 'auto',
    [theme.breakpoints.up('lg')]: {
      marginLeft: drawerWidth,
    }
  }
}));


export interface LayoutProps {
  children?: any;
}

export interface AppFrameState {
  mobileDrawerOpen: boolean;
}


type AppFramePropsWithStyles = LayoutProps &
  WithStyles<'root'|'appBar'|'navIconHide'| 'toolbar' | 'drawerPaper'| 'content'>;

class LayoutFrame extends React.Component<AppFramePropsWithStyles, AppFrameState> {
  state = {
    mobileDrawerOpen: false
  };

  handleDrawerToggle = () => {
    this.setState({
      mobileDrawerOpen: ! this.state.mobileDrawerOpen
    });
  }

  closeDrawer = () => {
    this.setState({
      mobileDrawerOpen: false
    });
  }

  render() {
    let { classes, theme } = this.props;
    const drawer = (
      <div>
        <div className={classes.toolbar}/>
        <Divider/>
        <List onClick={this.closeDrawer}>
          <NavItem
            text="Home"
            path="/"
            icon={<HomeIcon/>}
          />
          <NavItem
            text="Set Up Proxy"
            subText="api proxy settings"
            path="/proxy"
            icon={<ProxyIcon/>}
          />
          <NavItem
            text="Play"
            path="/play"
            icon={<FlagIcon/>}
          />
          <Divider/>
          <GamesNav/>
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar disableGutters={!this.state.mobileDrawerOpen}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon/>
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              noWrap={true}
            >
              <Switch>
                <Route exact={true} path="/" render={()=>'Home'}/>
                <Route exact={true} path="/proxy" render={()=>'Proxy'}/>
                <Route path="/play" render={()=>'Play'}/>
                <Route render={()=>'Title'}/>
              </Switch>
            </Typography>
          </Toolbar>
        </AppBar>

        <Hidden lgUp={true}>
          <Drawer
            variant="temporary"
            anchor={(theme && theme.direction === 'rtl')? 'right': 'left'}
            open={this.state.mobileDrawerOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown={true} implementation="css">
          <Drawer
            variant="permanent"
            open={true}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Switch>
            <Route exact={true} path="/" component={withTracker(Home)}/>
            <Route exact={true} path="/proxy" component={withTracker(Proxy)}/>
            <Route path="/play" component={withTracker(Play)} />
            <Redirect to=""/>
          </Switch>
        </main>

      </div>
    );
  }
}

export default decorate<LayoutProps>(LayoutFrame);