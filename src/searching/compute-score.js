import finalize from './order-max-results';

async function compute(results) {
  const listOfDocs = Object.values(results);
  const mapResults = {};

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
