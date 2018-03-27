
import * as https from 'https';
import { isUndefined } from 'util';
import { TpMaze } from '../dash';

const MAZE_INIT_DATA = {
  "maze-width": 17,
  "maze-height": 15,
  "maze-player-name": "fluttershy",
  "difficulty": 4
};

export function generateMaze(): Promise<string> {
  return new Promise((resolve,reject) => {

    let mazeInitJson = JSON.stringify(MAZE_INIT_DATA);

    let reqOptions = {
      host: 'ponychallenge.trustpilot.com',
      path: '/pony-challenge/maze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': mazeInitJson.length
      }
    };

    let req = https.request(reqOptions, (res) => {
      if (res.statusCode !== 200) {
        reject('Error: ' + reqOptions.path + ' : ' + res.statusMessage);
      }
      let data = '';
      res.on('data', d => { data += d; });
      res.on('error', err => reject(err));
      res.on('end', ()=> {
        try {
          let result = JSON.parse(data);
          let mazeId = result['maze_id'];
          if (isUndefined(mazeId)) {
            console.error('Invalid reply from /pony-challenge/maze', result);
            reject(new Error('No maze_id'));
          } else {
            resolve(mazeId);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    req.write(mazeInitJson);
    req.end();
  });
}

export function printMaze(mazeId: string): Promise<any> {
  return new Promise((resolve,reject) => {
    let reqOptions = {
      host: 'ponychallenge.trustpilot.com',
      path: '/pony-challenge/maze/' + mazeId + '/print',
    };

    let req = https.request(reqOptions, (res) => {
      if (res.statusCode !== 200) {
        reject('Error: ' + reqOptions.path + ' : ' + res.statusMessage);
      }
      let data = '';
      res.on('data', d => { data += d; });
      res.on('error', err => reject(err));
      res.on('end', ()=> {
        console.log('maze: ' + mazeId + '\n' + data);
        resolve();
      });
    });
    req.end();
  });
}


export function getMaze(mazeId: string): Promise<TpMaze> {
  return new Promise((resolve,reject) => {
    let reqOptions = {
      host: 'ponychallenge.trustpilot.com',
      path: '/pony-challenge/maze/' + mazeId,
    };

    let req = https.request(reqOptions, (res) => {
      if (res.statusCode !== 200) {
        reject('Error: ' + reqOptions.path + ' : ' + res.statusMessage);
      }
      let data = '';
      res.on('data', d => { data += d; });
      res.on('error', err => reject(err));
      res.on('end', ()=> {
        try {
          let tpMaze = JSON.parse(data) as TpMaze;
          return resolve(tpMaze);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.end();
  });
}

export function movePony(mazeId: string,direction: string): Promise<any> {
  return new Promise((resolve,reject) => {

    let mazeInitJson = JSON.stringify({
      "direction": direction
    });


    let reqOptions = {
      host: 'ponychallenge.trustpilot.com',
      path: '/pony-challenge/maze/' + mazeId,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': mazeInitJson.length
      }
    };

    let req = https.request(reqOptions, (res) => {
      if (res.statusCode !== 200) {
        reject('Error: in POST ' + reqOptions.path + ' : ' + res.statusMessage);
      }
      let data = '';
      res.on('data', d => { data += d; });
      res.on('error', err => reject(err));
      res.on('end', ()=> {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.write(mazeInitJson);
    req.end();
  });
}

