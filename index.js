module.exports = caclulateVolume;
function caclulateVolume(geom) {
  var coords = geom.coordinates;
  if (geom.type === 'Point') {
    return slice(coords);
  }
  if (geom.type === 'GeometryCollection') {
    var glen = geom.geometries.length;
    coords = new Array(glen);
    var gi = -1;
    while (++gi < glen) {
      coords[gi] = caclulateVolume(geom.geometries[gi]);
    }
  }

  // Flatten coords as much as possible
  while (Array.isArray(coords[0][0])) {
    coords =  Array.prototype.concat.apply([], coords);
  }

  // Calculate the enclosing bounding box of all coordinates
  var j = 0;
  var acc = slice(coords[0]);
  var coordsLen = coords.length;
  var coord, i;
  var len = acc[0].length;
  while (++j < coordsLen) {
    i = -1;
    while (++i < len) {
      if (coords[j][i] < acc[0][i]) {
        acc[0][i] = coords[j][i];
      }
      if (coords[j][i] > acc[1][i]) {
        acc[1][i] = coords[j][i];
      } 
    }
  }
  return acc;
}
function slice(array) {
  var i = -1;
  var len = array.length;
  var out = [new Array(len), new Array(len)];
  while (++i < len) {
    out[0][i] = out[1][i] = array[i];
  }
  return out;
}