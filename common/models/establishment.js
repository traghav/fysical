var Promise = require('bluebird');
var distance = require('google-distance');
var async = require('async');


module.exports = function(Establishment) {

  Establishment.query = function (location, time, query, distance, cb) {
    // Set the distance to the desirable distance or 10km
    var maxDistance = distance || 10;
    // Convert the distance to radians. The radius of the earth is 6371km
    maxDistance /= 6371;

    // Get the coordinates of the user
    var coords = [];
    coords[0] = '23.600800037384033';
    coords[1] = '46.76758746952729';

    Establishment.find({where :
      {
        brand: query,
        location : {
          near: coords,
          maxDistance: maxDistance
        }
      }, limit: 5})
    .then(function(docs){
      // Return the results.
      if (!docs.length) {
        cb(null, 'nothing found based on your query');
      } else {
        cb(null, docs);
      }
    })
    .catch(function(err){
      console.log('error' + err);
    });

  };

  Establishment.remoteMethod(
    'query',
    {
      accepts: [
        {arg: 'location', type: 'string'},
        {arg: 'time', type: 'string'},
        {arg: 'query', type: 'string'},
        {arg: 'distance', type: 'number'}
      ],
      returns: {arg: 'result', type: 'array'},
      http: {path: '/locations', verb: 'get'}
    }
  );

};
