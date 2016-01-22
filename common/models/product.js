var Promise = require('bluebird');
var distance = require('google-distance');
var async = require('async');

module.exports = function(Product) {
  Product.query = function (location, time, query, distance, cb) {
    // Set the distance to the distance sent in or default to 10km
    var maxDistance = distance || 10;
    // Convert the distance to radians. The radius of the earth is 6371km
    //maxDistance /= 6371;

    // Get the coordinates of the user
    var coords = [];
    coords[0] = '-0.121366'; // longitude
    coords[1] = '51.514275'; // latitude

    Product.find({where :
      {
        tags: { inq: [query] },
        location : {
          near: coords,
          maxDistance: maxDistance
        }
      }, limit: 5})
    .then(function(docs) {
      if (!docs.length) {
        cb(null, 'nothing found based on your query');
      } else {
        cb(null, docs);
      }
    })
    .catch(function(err) {
      console.log('error' +err);
    });

  };

  Product.remoteMethod(
    'query',
    {
      accepts: [
        {arg: 'location', type: 'array'},
        {arg: 'time', type: 'string'},
        {arg: 'query', type: 'string'},
        {arg: 'distance', type: 'number'}
      ],
      returns: {arg: 'result', type: 'array'},
      http: {path: '/search', verb: 'get'}
    }
  );

};
