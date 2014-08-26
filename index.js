module.exports = caclulateVolume;
function caclulateVolume(geom) {
  var coords = geom.coordinates;
  var i, len, tempCoords;
  if (geom.type === 'Point') {
    // the mins and maxes of a point are both the point
    return slice(geom.coordinates);
  }
   // we only care about the first (outer) ring for (Multi)Polygons
  if (geom.type === 'Polygon') {
    coords = coords[0];
  } else if (geom.type === 'MultiPolygon') {
    i = -1;
    len = coords.length;
    tempCoords = coords;
    coords = new Array(len);
    while (++i < len) {
      coords[i] = tempCoords[i][0];
    }
  }
  if (geom.type === 'GeometryCollection') {
    var glen = geom.geometries.length;
    coords = new Array(glen);
    var gi = -1;
    var gtype;
    while (++gi < glen) {
      gtype = geom.geometries[gi].type;
      // yeah not super DRY, but likely faster
      switch (gtype) {
        case 'Point':
          // slice the point
          len = geom.geometries[gi].coordinates.length;
          coords[gi] = [new Array(len)];
          i = -1;
          while (++i < len) {
            coords[gi][0][i] = geom.geometries[gi].coordinates[i];
          }
          break;
        case 'GeometryCollection':
          // yeah recursive, but will be less recursive then the data 
          coords[gi] = caclulateVolume(geom.geometries[gi]);
          break;
        case 'Polygon':
          // again you just care about the first one
          coords[gi] = calculate(geom.geometries[gi].coordinates[0]);
          break;
        case 'MultiPolygon':
          i = -1;
          len = geom.geometries[gi].coordinates.length;
          coords[gi] = new Array(len);
          while (++i < len) {
            coords[gi][i] = geom.geometries[gi].coordinates[i][0];
          }
          coords[gi] = calculate(coords[gi]);
          break;
        default:
          //line string and multieline string
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
    //acc[0] and acc[1] will always be the same length
    len = min(acc[0].length, coords[j].length);
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