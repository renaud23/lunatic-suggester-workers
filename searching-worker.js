import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searching from './src/searching';

self.onmessage = function (e) {
  const { search, name, version, max } = e.data;
  searching(search, name, version, max).then(function (result) {
    self.postMessage(result);
  });
};
