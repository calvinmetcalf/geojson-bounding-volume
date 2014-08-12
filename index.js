module.exports = caclulateVolume;
function caclulateVolume(geom) {
  var coords = geom.coordinates;
  if (geom.type === 'Point') {
    return slice(geom.coordinates);
  }
  if (geom.type === 'GeometryCollection') {
    var glen = geom.geometries.length;
    coords = new Array(glen);
    var gi = -1;
    while (++gi < glen) {
      if (geom.geometries[gi].type === 'Point') {
        coords[gi] = slice(geom.geometries[gi].coordinates);
      } else if (geom.geometries[gi].type  === 'GeometryCollection') {
        coords[gi] = caclulateVolume(geom.geometries[gi]);
      } else {
        coords[gi] = calculate(geom.geometries[gi].coordinates);
      }
    }
  }
  return calculate(coords);
}
function calculate(coords){
  // Flatten coords as much as possible
  while (Array.isArray(coords[0][0])) {
    coords =  Array.prototype.concat.apply([], coords);
  }

  // Calculate the enclosing bounding box of all coordinates
  var j = 0;
  var acc = slice(coords[0]);
  var coordsLen = coords.length;
  var coord, i;
  var len;
  while (++j < coordsLen) {
    i = -1;
    len = min(min(acc[0].length, acc[1].length), coords[j].length);
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
function min(a, b) {
  if (b > a) {
    return a;
  } else {
    return b;
  }
}