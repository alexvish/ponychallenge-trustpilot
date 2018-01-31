Pony dash (Throough the maze)
=============================

Ok, here we have some algorightms.

Those alrorightms are implemetned as  a form of typescript library, because I would probably want to make some nice UI around it,
if I have a time. As ponychallenge api seem to be not-so-open to Cross Origin requests, so I would have to proxy api
calls to do UI.


The solution to the problem I have is this one:
1. Build an exit path between pony and exit.
2. Follow the exit path with Pony until the exit is reached {2a} or (Domocun is on next cell of path or on adjusted connected cell {2b}).
   - 2a => win
   - 2b => Build the longest escape path from the current pony cell. The length of escape path cannot be more then width*height.
      While (Domocun follow pony) Push current cell to exit path, make one step on escape path, wait for Domocun turn.
      Return to 2 or be eaten.


It "looks" like API generated mazes are "prefect" ones -  they have a only one path between each two cells 
(this is based on couple of tries).

These are implications:

1. In non-prefect maze there could be more then one path to exit. How to find the shortest one do you know? 
2. In non-prefect maze pony have more ways to escape from domokun: pony strategy could be to run around 
   cycle, followed by domokun.


Implementation notes
--------------------

In file "dash.ts":
The most important class is Maze.

Maze is created (constructor) and updated (method update) from TrustPilot's maze definition.
update does not change structure of maze, only updates pony and domokun locations.

Maze has methods for generating exit path: `exitPath` and escape route: `escapeRoute`. 
Also, method `isDomokunNearPoint` is used to test if next point of exit path is 
safe.

Usage is:

1. Generate maze
2. Generate exit path for pony.
3. For each path element: test it with `isDomokunNearPoint`: if yes: generate escape route and follow it.
4. Go back go exitPath when domokun go away.


Method `exitPath` uses depth-first search to build the path. I use 
WITE/GRAY/BLACK variant which is overkill for this task (but still work). For undirected
graphs it is enogh to have WHITE/BLACK or NOT_VISITED/VISITED variant.

Method `escapeRoute` builds longest escape route using a sort of breath first traversal

Tests
-----

As UI is not ready, the only way to play with this are tests.
TestDash.test.ts provide the way to run game against trust pilot api.

Run tests with
```
npm run test
```

