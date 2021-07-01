import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searching from './src/searching';

self.onmessage = function (e) {
  const { searh, name, version, max } = e.data;
  searching(searh, name, version, max).then(function (result) {
    self.postMessage(result);
  });
};
