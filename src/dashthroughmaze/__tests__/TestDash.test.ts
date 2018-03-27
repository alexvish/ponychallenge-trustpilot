

import { initializeTestRunner } from './TestDashRunner';


it('play', done=> {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

  initializeTestRunner()
    .then( testRunner => testRunner.run())
    .then( testRunner => {
      console.log('Result: ', testRunner.state);
      done();
    }).catch(reason => {
      console.error(reason);
      done();
    });
});