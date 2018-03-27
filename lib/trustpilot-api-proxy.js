const express = require('express'),
      morgan = require('morgan'),
      request = require('request');

const config = {
  tpApiBaseUrl: 'https://ponychallenge.trustpilot.com',
  port: 4040
};

const app = express();
app.use(morgan('combined'));


app.all('*',(req,res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Expose-Headers': 'Content-Length, Access-Control-Allow-Methods',
    'Access-Control-Max-Age': '-1'
  });
  if (req.method === 'OPTIONS' || req.path === '/health') {
    //CORS preflight
    res.status(200).send();
  } else {
    r = request({
      baseUrl : config.tpApiBaseUrl,
      uri: req.path
    });
    r.on('error',(err) => {
      console.log(`${new Date().toISOString()} - error`, err);
      res.sendStatus(502)
    });
    req.pipe(r).pipe(res);
  }
});




server = app.listen(config.port, function() {
  console.log(`${new Date().toISOString()} - Started proxy server on port ${config.port}`);
});


