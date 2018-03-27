
import * as React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withNotes } from '@storybook/addon-notes';


import {MazeCellComponent, MazeComponent} from '../../components/Maze';
import * as dash from '../../dashthroughmaze/dash';

import mazeCellComponentMarkdown from './MazeCellComponent.md';
import mazeComponentMarkdown from './MazeComponent.md';
import createMaze, {tpMaze} from './testmaze';


const renderCellGroup = (x,y,description:string,walls:number,exitPath:boolean, escapeRoute: boolean) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={25} y={25} width={200} fontFamily={'monospace'}>{description}</text>
      <MazeCellComponent x={0} y={0} walls={walls} exit={exitPath} escape={escapeRoute}/>
    </g>
  );
};


storiesOf('Maze', module)
  .add('Cell walls', withNotes(mazeCellComponentMarkdown)(() => {
    return (
      <div>
        <h1>Cell walls</h1>
        <div>Cell walls are implemented with stroke-dasharay css property on rect svg element. <br/>
          CSS style is named <code>walls-<i>N</i></code> where <i>N</i> is a number,
          produced when constants <code>dash.TOP, dash.LEFT, dash.BOTTOM, dash.RIGHT</code> are
          combined with <code>OR</code> operator. <br/>
          'dash' is <code>import * as dash from '../dashthroughmaze/dash';</code></div>
        <svg width="800" height="400" style={{marginTop:20}}>
          {renderCellGroup(0,0,'None',0, true, false)}
          {renderCellGroup(200,0,'TOP',dash.TOP, true, false)}
          {renderCellGroup(400,0,'LEFT',dash.LEFT, true, false)}
          {renderCellGroup(600,0,'TOP|LEFT',dash.TOP|dash.LEFT, true, false)}

          {renderCellGroup(0,100,'BOTTOM',dash.BOTTOM, true, false)}
          {renderCellGroup(200,100,'TOP|BOTTOM',dash.TOP|dash.BOTTOM, true, false)}
          {renderCellGroup(400,100,'LEFT|BOTTOM',dash.LEFT|dash.BOTTOM, true, false)}
          {renderCellGroup(600,100,'TOP|LEFT|BOTTOM',dash.TOP|dash.LEFT|dash.BOTTOM, true, false)}

          {renderCellGroup(0,200,'RIGHT',dash.RIGHT, true, false)}
          {renderCellGroup(200,200,'TOP|RIGHT',dash.TOP|dash.RIGHT, true, false)}
          {renderCellGroup(400,200,'LEFT|RIGHT',dash.LEFT|dash.RIGHT, true, false)}
          {renderCellGroup(600,200,'TOP|LEFT|RIGHT',dash.TOP|dash.LEFT|dash.RIGHT, true, false)}

          {renderCellGroup(0,300,'BOTTOM|RIGHT',dash.BOTTOM|dash.RIGHT, true, false)}
          {renderCellGroup(200,300,'TOP|BOTTOM|RIGHT',dash.TOP|dash.BOTTOM|dash.RIGHT, true, false)}
          {renderCellGroup(400,300,'LEFT|BOTTOM|RIGHT',dash.LEFT|dash.BOTTOM|dash.RIGHT, true, false)}
          {renderCellGroup(600,300,'TOP|LEFT|BOTTOM|RIGHT',dash.TOP|dash.LEFT|dash.BOTTOM|dash.RIGHT, true, false)}
        </svg>
      </div>
    );
  }))
  .add('Cell Types', withNotes(mazeCellComponentMarkdown)(() => {
    return (
      <div>
        <h1>Cell Types</h1>
        <div>Maze cell can be a "normal" cell, cell on exit path and cell on escape route</div>
        <svg width="600" height="100" style={{marginTop:20}}>
          {renderCellGroup(0,0,'Normal',dash.TOP|dash.LEFT|dash.BOTTOM|dash.RIGHT, false, false)}
          {renderCellGroup(200,0,'Exit path',dash.TOP|dash.LEFT|dash.BOTTOM|dash.RIGHT, true, false)}
          {renderCellGroup(400,0,'Escape route',dash.TOP|dash.LEFT|dash.BOTTOM|dash.RIGHT, false, true)}
        </svg>
      </div>
    );
  }))
  .add('Maze', withNotes(mazeComponentMarkdown)(()=> {
    let maze = createMaze();
    return <MazeComponent maze={maze} exit={maze.exit} pony={maze.pony} domokun={maze.domokun}/>;
  }))
  .add('Calculated Maze Exit Path', withNotes(mazeComponentMarkdown)(()=> {
    let maze = createMaze();
    let exitPath = maze.exitPath();
    return <MazeComponent maze={maze} exit={maze.exit} pony={maze.pony} domokun={maze.domokun} exitPath={exitPath}/>;
  })).add('Calculated Maze Escape Route', withNotes(mazeComponentMarkdown)(()=> {
    let newTpMaze = {... tpMaze};
    newTpMaze.pony = [3 + 6 * newTpMaze.size[0]];
    let maze = new dash.Maze(newTpMaze);
    let escapeRoute = maze.escapeRoute();
    return (
      <MazeComponent maze={maze} exit={maze.exit} pony={maze.pony} domokun={maze.domokun} escapeRoute={escapeRoute}/>
    );
  })).add('Pony Move', withNotes(mazeComponentMarkdown)(()=> {
    let maze = createMaze();

    interface MazePonyMoveProps {maze: dash.Maze; p1: dash.Point; p2: dash.Point;}
    class MazePonyMove extends React.Component<MazePonyMoveProps,{pony: dash.Point;}> {
      intervalId: any;
      constructor(props: MazePonyMoveProps) {
        super(props);
        this.state = {pony: props.p1};
      }

      componentWillMount() {
        this.setState({pony: this.props.p1});
        this.intervalId = setInterval(()=> {
          if (dash.eqPoint(this.state.pony, this.props.p1)) {
            this.setState({pony: this.props.p2});
          } else {
            this.setState({pony: this.props.p1});
          }
        },                            2000);
      }

      componentWillUnmount() {
        clearInterval(this.intervalId);
      }

      render() {
        return (
          <MazeComponent
            maze={this.props.maze}
            exit={this.props.maze.exit}
            pony={this.state.pony}
            domokun={this.props.maze.domokun}
          />
        );
      }
    }


    return <MazePonyMove maze={maze} p1={{x:11, y:14}} p2={{x: 12, y: 14}}/>;
  }));




