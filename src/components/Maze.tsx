import * as React from 'react';
import { Motion, spring, Style } from 'react-motion';

import * as dash from '../dashthroughmaze/dash';

import './Maze.css';

export interface MazeMarkerProps {
  x: number;
  y: number;
  marker: string;
  className?: string;
}

export const MazeMarkerComponent: React.SFC<MazeMarkerProps> = (props) => {
    let className = 'marker';
    if (props.className) {
      className += ' ' + props.className;
    }
    let xSvgCoord = 50 + props.x * 30;
    let ySvgCoord = 50 + props.y * 30;
    let s: Style = { x: spring(xSvgCoord), y: spring(ySvgCoord) };
    return (
      <Motion style={s}>
        {interpolatingStyle =>
          <text x={interpolatingStyle.x as number} y={interpolatingStyle.y as number} className={className}>
            {props.marker}
          </text>}
      </Motion>
    );
};

export interface MazeCellProps {
  /*
   * Cell coordinates are in 'cell space'. Each cell is 30x20 svg rect, with staring pont 35x35
   * cell with coordinates 2x3 will be rendered at 35 + 2*30, 35 + 3*30
   *
   */
  x: number;
  y: number;
  /*
   * walls - valid values: 0..15: the number is produced with OR of constants TOP,LEFT,BOTTOM,RIGHT defined in
   * ../dashthrouhgmaze/dash
   */
  walls: number;
  /*
   * Is this cell on exit path: change background to blue
   */
  exit: boolean;
  /*
   * Is this cell on escape path: change background to red
   */
  escape: boolean;
}

export const MazeCellComponent: React.SFC<MazeCellProps> = (props) => {
    let classNames = 'cell';
    classNames += ' walls-' + props.walls;
    if (props.exit) {
      classNames += ' cell-exit';
    }
    if (props.escape) {
      classNames += ' cell-escape';
    }

    return (
      <rect x={35 + props.x * 30} y={35 + props.y * 30} width="30" height="30" className={classNames}/>
    );
};

export interface MazeComponentProps {
  maze?: dash.Maze;
  pony?: dash.Point;
  domokun?: dash.Point;
  exit?: dash.Point;
  exitPath?: dash.Point[];
  escapeRoute?: dash.Point[];
}

export const MazeComponent: React.SFC<MazeComponentProps> = (props) => {
  if (props.maze) {
    let maze = props.maze;
    let xCoordMarkers = Array.from(new Array(maze.width), (val, index) => {
      return (<MazeMarkerComponent x={index} y={-1} marker={`${index}`} key={`x-${index}`}/>);
    });
    let yCoordMarkers = Array.from(new Array(maze.height), (val, index) => {
      return (<MazeMarkerComponent x={-1} y={index} marker={`${index}`} key={`y-${index}`}/>);
    });
    let mazeCells: JSX.Element[] = [];

    let exitPath = props.exitPath;
    let escapeRoute = props.escapeRoute;

    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        let onExitPath = false;
        let onEscapeRoute = false;
        if (exitPath) {
          onExitPath = exitPath.some(p => p.x === x && p.y === y);
        }
        if (escapeRoute) {
          onEscapeRoute = escapeRoute.some(p => p.x === x && p.y === y);
        }

        mazeCells.push((
          <MazeCellComponent
            x={x}
            y={y}
            walls={maze.getCell(x, y)}
            escape={onEscapeRoute}
            exit={onExitPath}
            key={`cell(${x},${y})`}
          />
        ));
      }
    }

    let markers: JSX.Element[] = [];
    if (props.exit) {
      markers.push(<MazeMarkerComponent key="exit" x={props.exit.x} y={props.exit.y} marker={'E'}/>);
    }
    if (props.pony) {
      markers.push(<MazeMarkerComponent key="pony" x={props.pony.x} y={props.pony.y} marker={'P'}/>);
    }
    if (props.domokun) {
      markers.push(<MazeMarkerComponent key="domokun" x={props.domokun.x} y={props.domokun.y} marker={'D'}/>);
    }
    const pixelWidth = maze.width * 30 + 70;
    const pixelHeight = maze.height * 30 + 70;
    return (
      <svg
        style={{
          width: '100%',
          maxWidth: pixelWidth
        }}
        preserveAspectRatio='xMinYMin meet'
        viewBox={`0 0 ${pixelWidth} ${pixelHeight}`}
      >
          {xCoordMarkers}
          {yCoordMarkers}
          {mazeCells}
          {markers}
      </svg>
    );
  } else {
    return (<svg/>);
  }
};
