require('chai').should();
var fixture = require('./fixture.json');
var gbv = require('../');

describe('gbv',function(){
  fixture.features.forEach(function (feature, i) {
    it(feature.geometry.type,function(){
      var a = gbv(feature.geometry);
      var b = a[0].concat(a[1]);
      b.should.deep.equal(feature.bbox, 'bboxes match');
    });
  });
});