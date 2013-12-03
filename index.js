function caclulateVolume(geom) {
  var coords = geom.coordinates;
  if (geom.type === 'Point') {
    return [coords, coords];
  }
  if (geom.type === 'GeometryCollection') {
    coords = geom.geometries.map(function(g) {
      return caclulateVolume(g);
    });

  // Flatten coords as much as possible
  while (Array.isArray(coords[0][0])) {
    coords = coords.reduce(function(a, b) {
      return a.concat(b);
    });
  };

  // Calculate the enclosing bounding box of all coordinates
  return coords.reduce(function (acc, coord) {
    if (acc === null) {
      return [coord, coord];
    }
    return [
    acc[0].map(function(a,i){
      return Math.min(a,coord[i]);
    }),
    acc[1].map(function(a,i){
      return Math.max(a,coord[i]);
    })
    ];
  }, null);
};

module.exports = caclulateVolume;