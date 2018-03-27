
export interface TpGameState {
  state: 'Active'| 'active' |'won'|'over';
  'state-result': string;
  'hidden-url'?: string;
}

export interface TpMaze {
  pony: number[];
  domokun: number[];
  'end-point': number[];
  size: number[];
  difficulty: number;
  data: ('west'|'north')[][];
  maze_id: string;
  'game-state': TpGameState;
}

export const TOP=1;
export const LEFT=2;
export const BOTTOM=4;
export const RIGHT=8;

export interface Point {
  x: number;
  y: number;
}

export function eqPoint(a: Point|undefined, b: Point|undefined) {
  if (a === undefined) {
    return b === undefined;
  }
  if (b === undefined) {
    return false;
  }
  return a.x === b.x && a.y === b.y;
}

export function toStringKey(p: Point): string {
  return 'x: ' + p.x + ' ,y: ' + p.y;
}

export function moveDirection(from: Point, to: Point): string|undefined {
  if (to.x === from.x) {
    if (to.y === from.y - 1) {
      return 'north';
    }
    if (to.y === from.y + 1) {
      return 'south';
    }
  }
  if (to.y === from.y) {
    if (to.x === from.x - 1) {
      return 'west';
    }
    if (to.x === from.x + 1) {
      return 'east';
    }
  }
  return undefined;
}

interface DfsContext {
  currentPath: Point[];
  visitedCells:{
    [pointStringKey: string]: boolean /*always true*/;
  };
}

/*
 * Maze made for humans, not for computers
 */
export class Maze {
  private _id: string;
  private _width: number;
  private _height: number;
  private _cells: number[][];
  private _exit: Point;
  private _pony: Point;
  private _domokun: Point;

  constructor(tpMaze: TpMaze) {
    this._id = tpMaze.maze_id;
    this._width = tpMaze.size[0];
    this._height = tpMaze.size[1];
    this._pony = this.toPoint(tpMaze.pony[0]);
    this._domokun = this.toPoint(tpMaze.domokun[0]);
    this._exit = this.toPoint(tpMaze['end-point'][0]);
    this._cells = [];
    for (let x = 0; x < this.width; x++) {
      let col:number[] = [];
      for (let y = 0; y < this.height; y++) {
        let tpCellData = tpMaze.data[y * this.width + x];
        let cell = 0;
        if (x === 0) {
          cell |= LEFT;
        }
        if (x === this.width - 1) {
          cell |= RIGHT;
        }
        if (y === 0) {
          cell |= TOP;
        }
        if (y === this.height - 1) {
          cell |= BOTTOM;
        }
        for (let tpBorder of tpCellData) {
          if (tpBorder === 'north') {
            cell |= TOP;
          }
          if (tpBorder === 'west') {
            cell |= LEFT;
          }
        }
        col.push(cell);
      }
      this._cells.push(col);
    }
    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        if (x < this.width - 1) {
          if ((this._cells[x+1][y] & LEFT) !== 0) {
            this._cells[x][y] |= RIGHT;
          }
        }
        if (y < this.height - 1) {
          if ((this._cells[x][y + 1] & TOP) !== 0) {
            this._cells[x][y] |= BOTTOM;
          }
        }
      }
    }
  }

  update(tpMaze: TpMaze) {
    this._pony = this.toPoint(tpMaze.pony[0]);
    this._domokun = this.toPoint(tpMaze.domokun[0]);
  }

  get id(): string {
    return this._id;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get exit(): Point {
    return this._exit;
  }

  get pony(): Point {
    return this._pony;
  }

  get domokun(): Point {
    return this._domokun;
  }

  getCell(x: number, y: number): number {
    return this._cells[x][y];
  }

  possibleMoveLocations(from:Point):Point[] {
    let result:Point[] = [];
    if ((this._cells[from.x][from.y] & TOP) === 0) {
      result.push({x: from.x, y: from.y - 1});
    }
    if ((this._cells[from.x][from.y] & LEFT) === 0) {
     result.push({x: from.x -1, y: from.y});
    }
    if ((this._cells[from.x][from.y] & BOTTOM) === 0) {
      result.push({x: from.x, y: from.y + 1});
    }
    if ((this._cells[from.x][from.y] & RIGHT) === 0) {
      result.push({x: from.x + 1, y: from.y});
    }
    return result;
  }

  isDomokunNearPoint(pointToMoveTo:Point): boolean {
    let domokunMuves = [...this.possibleMoveLocations(this.domokun), this.domokun];
    return domokunMuves.some(p => eqPoint(pointToMoveTo, p));
  }

  escapeRoute(): Point[] {
    let routes: Point[][] = [[this.pony]];
    while(true) {
      let newRoutes: Point[][] = [];
      for(let r of routes) {
        let last:Point = r[r.length - 1];
        // do not go to point near domokun
        let filterOut:Point[] = [this.domokun, ...this.possibleMoveLocations(this.domokun)];
        // and do not go back escape route
        if (r.length > 1) {
          filterOut.push(r[r.length - 2]);
        }
        let extensions = this.possibleMoveLocations(last).filter( p => {
          return !filterOut.some( filterP => {
            return eqPoint(filterP,p);
          });
        });
        let x = extensions.map(extP => {
          let res = r.slice(0);
          res.push(extP);
          return res;
        });
        newRoutes = newRoutes.concat(x);
      }
      if (newRoutes.length === 0) {
        return routes[0];
      }
      // probably, cycle: maze is not prefect. route is long enough
      if (newRoutes[0].length > this.width * this.height) {
        return newRoutes[0];
      }
      routes = newRoutes;
    }
  }

  exitPath():Point[] {
    return this.dfsExitPath(this.pony, {currentPath:[], visitedCells:{}}) || [];
  }

  dfsExitPath (p: Point, dfsContext: DfsContext ): Point[] | undefined {
    // mark current visited
    dfsContext.visitedCells[toStringKey(p)] = true;
    // push current to path
    dfsContext.currentPath.push(p);

    if (eqPoint(p, this.exit)) {
      // found exit
      return dfsContext.currentPath.slice(0); // clone array
    }
    let reachable: Point[] = this.possibleMoveLocations(p);
    // filter out visited
    reachable = reachable.filter(nextP => !dfsContext.visitedCells[toStringKey(nextP)]);
    for (let next of reachable) {
      let path = this.dfsExitPath(next,dfsContext);
      if (path) {
        return path;
      }
    }
    // remove point from current path
    dfsContext.currentPath.pop();
    return undefined;
  }

  toPoint(loc: number):Point {
    return {
      x: loc % this.width,
      y: Math.floor(loc/this.width)
    };
  }
}
