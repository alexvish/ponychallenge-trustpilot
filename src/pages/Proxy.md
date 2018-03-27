Trustpilot api endpoint cannot be used in this application directly, 
because it does not publish [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) headers.

A local proxy, that enreach trustpilot api responses with needed proxy headers
can be easily be set up, using scripts from this repository:
```sh

# Clone this repository
$ git clone https://github.com/alexvish/ponychallenge-trustpilot.git

# Execute npm install
$ npm install

# Start api proxy
$ npm run proxy

```

Now paste proxy url into the form below, and press "Test" button.