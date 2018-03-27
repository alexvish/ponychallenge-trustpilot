# MazeCellComponent

<code>MazeCellComponent</code> renders svg rect
Properties:
```$typescript
export interface MazeCellProps {
  /**
   * Cell coordinates are in 'cell space'. Each cell is 30x20 svg rect, with staring pont 35x35
   * cell with coordinates 2x3 will be rendered at 35 + 2*30, 35 + 3*30
   * 
   * */
  x: number; 
  y: number;
  /**
   * walls - valid values: 0..15: the number is produced with OR of constants TOP,LEFT,BOTTOM,RIGHT defined in ../dashthrouhgmaze/dash
   **/
  walls: number;
  /**
   * Is this cell on exit path: change background to blue 
   **/
  exit: boolean;
  /**
   * Is this cell on escape path: change background to red
   **/
  escape: boolean;
}

```