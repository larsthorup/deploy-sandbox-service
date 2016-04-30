var api = require('./api');
api.serving().then(function (server) {
  console.log('API is running');
}).catch(function (err) {
  console.log('Error', err);
});