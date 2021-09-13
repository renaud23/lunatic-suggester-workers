import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { append } from './src/store-index';

self.onmessage = function (e) {
  function log(message) {
    self.postMessage(message);
  }
  const { name, stopWords, version, fields, entities } = e.data;
  append({ name, stopWords, fields }, version, entities, log).then(function () {
    self.postMessage('success');
  });
};
