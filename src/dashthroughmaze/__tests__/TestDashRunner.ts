import {eqPoint, Maze, moveDirection, Point, TpMaze} from '../dash';
import {generateMaze, getMaze, movePony, printMaze} from './test-api-calls';
import {isUndefined} from 'util';



export class TestRunner {
  private _maze: Maze;
  private _exitPath:Point[];
  private _escapeRoute: Point[]|undefined;
  private _state: 'running' | 'win'| 'loose';
  private _currentPonyLocation: Point;


  constructor(tpMaze: TpMaze) {
    this._maze = new Maze(tpMaze);
    this._exitPath = this._maze.exitPath();
    this._currentPonyLocation = this._exitPath.shift();
  }

  run(): Promise<TestRunner> {
    let loop = () => {
      if(!this.isRunning()) {
        return Promise.resolve(this);
      }
      return this.move().then(()=>loop());
    };
    return loop();
  }

  checkState() {
    if (eqPoint(this._maze.domokun,this._maze.pony)) {
      this._state = 'looze';
    } else if (eqPoint(this._maze.exit, this._maze.pony)) {
      this._state = 'win';
    } else {
      this._state = 'running'
    }
  }

  isRunning() : boolean {
    this.checkState();
    return this.state === 'running'
  }



  move(): Promise<TestRunner> {
    let nextPoint:Point;
    if (this._maze.isDomokunNearPoint(this._exitPath[0])) {
      console.log('Domokun on my way!!!!');
      if (isUndefined(this._escapeRoute)) {
        console.log('Create escape route');
        this._escapeRoute = this._maze.escapeRoute();
        this._escapeRoute.shift();
      }
      if (this._escapeRoute.length == 0) {
        //we loosing
        console.log('No way out!!!');
        nextPoint = this._exitPath.shift();
      } else {
        console.log('Follow escape route');
        nextPoint = this._escapeRoute.shift();
        this._exitPath.unshift(this._currentPonyLocation);
      }
    } else {
      this._escapeRoute = undefined;
      nextPoint = this._exitPath.shift();
    }
    let direction = moveDirection(this._currentPonyLocation, nextPoint);
    if (isUndefined(direction)) {
      let f = this._currentPonyLocation;
      let t = nextPoint;
      return Promise.reject(`No move from (${f.x}, ${f.y}) to (${t.x}, ${t.y}))`)
    }
    return movePony(this._maze.id, direction).then(result => {
      return getMaze(this._maze.id)
        .then(tpMaze => {
          this._maze.update(tpMaze);
          if (!eqPoint(nextPoint, this._maze.pony)) {
            let e = nextPoint;
            let a = this._maze.pony;
            return Promise.reject(`Wrong move through api. expected: (${e.x}, ${e.y}) actual: (${a.x}, ${a.y})`);
          }
          this._currentPonyLocation = this._maze.pony;
          console.log('Move. pony: ', this._maze.pony, 'domokun:', this._maze.domokun, 'move result:', result );
          return Promise.resolve(this);
        })
    });
  }

  get state() {
    return this._state;
  }
}


export function initializeTestRunner(): Promise<TestRunner> {
  return generateMaze()
    .then(mazeId => {
      printMaze(mazeId);
      return mazeId;
    })
    .then(mazeId => getMaze(mazeId))
    .then(tpMaze => new TestRunner(tpMaze));
}