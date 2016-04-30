var cryptex = require('cryptex');
var restify = require('restify');
var Knex = require('knex');

var knex;

function userHandler (req, res, next) {
  knex('user').count('* as userCount').then(function (result) {
    if(result.length < 1) {
      return 0;
    } else {
      return result[0].userCount;
    }
  }).then(function (count) {
    res.send({count: count});
  }).catch(function (err) {
    res.send(500, err);
  });
}

function configuring () {
  return cryptex.getSecret('postgresql_connection_string').then(function (postgresql_connection_string) {
    knex = Knex({
      client: 'pg',
      connection: postgresql_connection_string,
    });
  });
}

function listening () {
  return new Promise(function (resolve) {
    // ToDo: verify db schema version
    var server = restify.createServer();
    server.pre(restify.CORS());
    server.get('/users', userHandler);
    server.listen(process.env.PORT || 1719, function () {
      resolve(server);
    });
  });
}

function serving () {
  return configuring().then(function () {
    return listening();
  });
}

module.exports = {
  serving: serving
};