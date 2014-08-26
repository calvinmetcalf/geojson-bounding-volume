GeoJSON Minimum Bounding Volume
===

Calculates minimum bounding volumes for GeoJSON, returns bboxen (strictly axis aligned bounding boxen) in the format

```json
[
  [min1, min2, ...],
  [max1, max2, ...],
]
```

It is agnostic as to how many coordinates the geojson has and will use the coordinates with the lowest dimensionality.