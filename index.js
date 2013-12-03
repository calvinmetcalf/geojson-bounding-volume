function geometryVolume(geometry){
  var mins = [];
  var maxes = [];
  function test(coordinate){
    coordinate.forEach(function(v, i){
      if(i>mins.length){
        mins.push(v);
      }else if(mins[i]>v){
          mins[i] = v;
      }
      if(i>maxes.length){
        maxes.push(v);
      }else if(maxes[i]<v){
        maxes[i] = v;
      }
    });
  }
  function innerTest(coords){
    coords.forEach(test);
  }
  switch(geometry.type){
    case 'Point':
      test(geometry.coordinates);
      break;
    case 'MultiPoint':
    case 'LineString':
      geometry.coordinates.forEach(test);
      break;
    case 'MultiLineString':
    case 'Polygon':
      geometry.coordinates.forEach(innerTest);
      break;
    case 'MultiPolygon':
      geometry.coordinates.forEach(function(coords){
        coords.forEach(innerTest);
      });
      break;
    case 'GeometryCollection':
      geometries.forEach(function(geome){
        geometryVolume(geom).forEach(test);
      });
      break;
  }
  return [mins,maxes];
}

module.exports = function(feature){
  if(feature.type === 'Feature'){
    return geometryVolume(feature.geometry);
  }else if(feature.type === 'FeatureCollection'){
    return geometryVolume({
      type:'GeometryCollection',
      geometries:feature.features.map(function(v){
        return v.geometry;
      });
    })
  }
}