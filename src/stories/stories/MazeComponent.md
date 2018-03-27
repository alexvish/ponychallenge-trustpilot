# MazeComponent
MazeComponent is a react stateless functional component.

The following component properties are supported:

```$typescript
import * as dash from '../dashthroughmaze/dash'


export interface MazeComponentProps {
  maze?: dash.Maze;
  pony?: dash.Point;
  domokun?: dash.Point;
  exit?: dash.Point;
  exitPath?: dash.Point[];
  escapeRoute?: dash.Point[];
}
```