import distance from 'damerau-levenshtein';

function finalize(withScore, max = 30) {
  return withScore
    .sort(function (a, b) {
      if (a.score > b.score) {
        return -1;
      }
      if (a.score < b.score) {
        return 1;
      }
      return 0;
    })
    .slice(0, max);
}

function merge(results) {
  return Object.values(results).reduce((a, l) => [...a, ...l], []);
}

function createDocMap(data, map = {}) {
  const [current, ...rest] = data;

  if (current) {
    const { id } = current;
    if (!(id in map)) {
      return createDocMap(rest, { ...map, [id]: { ...current, __count: 1 } });
    }
    return createDocMap(rest, { ...map, [id]: { ...current, __count: map[id].__count + 1 } });
  }
  return map;
}

function compute(results) {
  const listOfDocs = Object.values(results);
  //
  // const docsMap = createDocMap(merge(results));
  // Object.values(docsMap).forEach(function(){});

  //
  const searchTokens = Object.values(results);
  const mapResults = {};

  searchTokens.forEach(function (t) {});

  listOfDocs.forEach(function (docs) {
    docs.forEach(function (doc) {
      const { id } = doc;
      if (id in mapResults) {
        mapResults[id].score++;
      } else {
        mapResults[id] = { ...doc, score: 1 };
      }
    });
  });

  return finalize(Object.values(mapResults));
}

export default compute;
