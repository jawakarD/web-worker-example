const Filters = {};

Filters.none = function none() {};

Filters.grayscale = ({data: d}) => {
  for (let i = 0; i < d.length; i += 4) {
    const [r, g, b] = [d[i], d[i + 1], d[i + 2]];

    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    d[i] = d[i + 1] = d[i + 2] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};

Filters.brighten = ({data: d}) => {
  for (let i = 0; i < d.length; ++i) {
    d[i] *= 1.2;
  }
};

Filters.threshold = ({data: d}) => {
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 90 ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
};

onmessage = e => {
  const {imageData, filter} = e.data;
  Filters[filter](imageData);
  postMessage(imageData);
};
