import prepareStringIndexation from './prepare-string-indexation';

function defaultTokenize(string) {
  return [prepareStringIndexation(string)];
}

export default defaultTokenize;
