var Promise = require('bluebird');

module.exports = function(Establishment) {

  Establishment.query = function (location, time, query, cb) {
    Establishment.find({where : { brand: query }})
    .then(function(result){
      cb(null, result);
    })
    .catch(function(err){
      console.log('error');
    });

  };

  Establishment.remoteMethod(
    'query',
    {
      accepts: [
        {arg: 'location', type: 'string'},
        {arg: 'time', type: 'string'},
        {arg: 'query', type: 'string'},
      ],
      returns: {arg: 'result', type: 'array'},
      http: {path: '/locations', verb: 'get'}
    }
  );

};
