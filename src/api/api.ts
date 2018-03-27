import fetch from 'cross-fetch';
import {TpMaze} from '../dashthroughmaze/dash';

const MAZE_PATH='/pony-challenge/maze';
const HEALTH_PATH='/health';

function url(base: string, path: string):string {
  return new URL(path, base).toString();
}

export interface VerifyApiResult {
  verified: boolean;
}

export interface ApiCallParams extends RequestInit {
  baseUrl: string;
  path: string;
}



export async function verifyApi(proxyUrl: string): Promise<VerifyApiResult> {
  let healthUrl = url(proxyUrl,HEALTH_PATH);
  let res = await fetch(healthUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{}'
  });

  let result: VerifyApiResult = {
    verified: false
  };
  if (res.status !== 200) {
    throw new Error(`Verify call: Status is not 200 OK. Status: ${res.status}`);
  }
  let allowedMethods = res.headers && res.headers.get('Access-Control-Allow-Methods');
  if (! allowedMethods ) {
    throw new Error(`Verify call: No header Access-Control-Allow-Methods`);
  }
  if (allowedMethods.toUpperCase().indexOf('POST') < 0) {
    throw new Error(`Verify call: POST not allowed with header Access-Control-Allow-Methods: ${allowedMethods}`);
  }
  result.verified = true;
  return result;
}

export interface MazeInitData {
  'maze-width': number;
  'maze-height': number;
  'maze-player-name': string;
  difficulty: number;
}



export async function initMaze(proxyUrl: string, initData: MazeInitData): Promise<string> {
  let mazeInitUrl = url(proxyUrl, MAZE_PATH);
  let response = await fetch(mazeInitUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(initData)
  });
  if (!response.ok) {
    throw new Error();
  }
  let data = await response.json() as {
    maze_id: string;
  };
  return data.maze_id;
}

export async function getMaze(proxyUrl: string, mazeId: string): Promise<TpMaze> {
  let getMazeUrl = url(proxyUrl, `${MAZE_PATH}/${mazeId}`);
  let response = await fetch(getMazeUrl, {
    method: 'GET',
  });
  if (response.status !== 200) {
    throw new Error(`Get maze call: Status is not 200 OK. Status: ${response.status}`);
  }
  return await response.json() as TpMaze;
}

export async function move(proxyUrl: string, mazeId: string, direction:string ): Promise<any> {
  let mazeUrl = url(proxyUrl, `${MAZE_PATH}/${mazeId}`);
  let response = await fetch(mazeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({direction: direction})
  });
  if (response.status !== 200) {
    throw new Error(`move pony call: Status is not 200 OK. Status: ${response.status}`);
  }
  return await response.json();
}

