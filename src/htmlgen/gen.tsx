import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router';
import App from '../App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import {Theme} from 'material-ui';
import JssProvider from 'react-jss/lib/JssProvider';
import {GenerateClassName, SheetsRegistry} from 'jss';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';

const theme = createMuiTheme();

interface ComponentProps {
  location: string;
  baseName: string;
  theme: Theme;
  sheetsRegistry: SheetsRegistry;
  generateClassName: GenerateClassName<any>;
}

const defaultState = {
  games: {
    games: {}
  }
};

export const Component: React.SFC<ComponentProps> = (props)=> {
  let store = createStore( (state = defaultState) => state );
  return (
    <Provider store={store}>
      <JssProvider registry={props.sheetsRegistry} generateClassName={props.generateClassName}>
        <MuiThemeProvider theme={props.theme}>
          <StaticRouter location={props.location} basename={props.baseName}>
            <App/>
          </StaticRouter>
        </MuiThemeProvider>
      </JssProvider>
    </Provider>
  );
};


interface HtmlProps {
  title: string;
  baseName: string;
  css: string[];
  js: string[];
}

export const Html:React.SFC<HtmlProps> = (props)=> {
  let cssLinks = props.css.map(s=>(<link href={s} rel="stylesheet"/>));
  let jsScripts = props.js.map(s=>(<script type="text/javascript" src={s}/>));
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
        <meta name="theme-color" content="#000000"/>
        <link rel="manifest" href={`${props.baseName}/manifest.json`}/>
        <link rel="shortcut icon" href={`${props.baseName}/favicon.ico`}/>
        <title>{props.title}</title>
        {cssLinks}
        <style id="jss-server-side">@@REPLACE_STYLES@@</style>
      </head>
      <body>
        <div id="root">@@REPLACE_APP@@</div>
        {jsScripts}
      </body>
    </html>);
};

function renderHtmlReplacement(title: string, baseName: string, css: string[], js: string[], location: string) {
  return ReactDOMServer.renderToStaticMarkup(
    <Html title={title} baseName={baseName} css={css} js={js} />);
}

export function renderComponent(location: string, baseName: string):{app:string; styles:string;} {
  const sheetsRegistry = new SheetsRegistry();
  const generateClassName = createGenerateClassName();

  let app = ReactDOMServer.renderToString(
    <Component
      location={location}
      baseName={baseName}
      theme={theme}
      sheetsRegistry={sheetsRegistry}
      generateClassName={generateClassName}
    />);
  let styles = sheetsRegistry.toString();
  return {app, styles};
}


export default function render(locals: any): string {
  try {
    const baseName = locals.basename;

    let assets = Object.keys(locals.webpackStats.compilation.assets)
      .filter(value => !value.match(/htmlgen/)).map(s => baseName + '/' + s);
    let css = assets.filter(value => value.match(/\.css$/));
    let js = assets.filter(value => value.match(/\.js$/));

    const location = locals.path;


    let html = renderHtmlReplacement(locals.title, baseName, css, js, location);

    const {app, styles} = renderComponent(location,baseName);
    html = html.replace('@@REPLACE_STYLES@@', styles);
    html = html.replace('@@REPLACE_APP@@', app);

    return '<!DOCTYPE html>' + html;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
