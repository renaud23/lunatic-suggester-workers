import distance from 'damerau-levenshtein';
import { CONSTANTES } from '../commons-idb';
import finalize from './order-max-results';

function getNearestToken(doc, t) {
  const { tokens } = doc;
  return tokens.reduce(
    function ({ best, min }, n) {
      const { similarity } = distance(t, n);
      if (similarity < min && similarity > 0.5) {
        return { min: similarity, best: n };
      }
      return { min, best };
    },
    { min: Number.MAX_SAFE_INTEGER }
  ).best;
}

async function countDocs(db) {
  return new Promise(function (resolve) {
    const transaction = db.transaction(CONSTANTES.STORE_DATA_NAME, 'readonly');
    const store = transaction.objectStore(CONSTANTES.STORE_DATA_NAME);
    const countRequest = store.count();
    countRequest.onsuccess = function () {
      resolve(countRequest.result);
    };
  });
}

async function getIdf(db, t, nbDocs) {
  const transaction = db.transaction(CONSTANTES.STORE_TOKENS_NAME, 'readonly');
  const store = transaction.objectStore(CONSTANTES.STORE_TOKENS_NAME);

  return new Promise(function (resolve) {
    const request = store.get(t);
    request.onsuccess = function () {
      const { result } = request;
      if (result) {
        resolve(Math.log(nbDocs / result.count));
      } else {
        resolve(0);
      }
    };
  });
}

function listOfDocs(results) {
  const docs = Object.values(results).reduce((a, n) => [...a, ...n], []);
  const map = docs.reduce(function (next, doc) {
    const { id } = doc;

    if (id in doc) {
      return next;
    }
    return { ...next, [id]: doc };
  }, {});
  return Object.values(map);
}

async function compute(db, results) {
  const nbDocs = await countDocs(db);
  const qt = Object.keys(results);
  const docs = listOfDocs(results);
  const withScore = [];

  for (let i = 0; i < docs.length; i++) {
    const { tokensCount, tokens } = docs[i];
    let score = 0;
    for (let j = 0; j < qt.length; j++) {
      const t = qt[j];
      const nearest = getNearestToken(docs[i], t);
      if (nearest) {
        const tf = tokensCount[nearest].tf;
        const idf = await getIdf(db, nearest, nbDocs);
        score += tf * idf;
      }
    }

    withScore.push({ ...docs[i], score });
  }
  return finalize(withScore);
}

export default compute;
