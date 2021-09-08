import { openDb, idbBulkInsert, CONSTANTES } from '../commons-idb';
import MESSAGES from './store-messages';
import insertTokensStore from './insert-tokens-store';
import { createTokenizer } from '../commons-tokenizer';

function prepareEntities(fields, entities, log) {
  const tokenizer = createTokenizer(fields);

  let done = 0;
  const size = 1000;
  const max = entities.length;

  return entities.map(function (suggestion) {
    const { id } = suggestion;
    if (id) {
      const tokensCount = tokenizer(suggestion);
      const tokens = Object.keys(tokensCount);
      done++;
      if (done % size === 0 || done === max) {
        log({
          message: {
            ...MESSAGES.indexBatch,
            max,
            done,
            percent: (done / max) * 100,
          },
        });
      }
      return { id, suggestion, tokensCount, tokens };
    } else throw new Error(`Missing id on entity.`);
  }, []);
}

function createTokensMap(entities) {
  const map = {};
  entities.forEach(function ({ tokens }) {
    tokens.forEach(function (token) {
      if (token in map) {
        map[token] = { value: token, count: map[token].count + 1 };
      } else {
        map[token] = { value: token, count: 1 };
      }
    });
  });

  return map;
}

async function fillTokensStore(db, tfIdf, entities, log) {
  if (tfIdf) {
    const tokensMap = createTokensMap(entities);
    insertTokensStore(db, tokensMap, log);
  }
}

async function append(storeInfo, version, entities, log = () => null) {
  try {
    const { name, tfIdf, fields } = storeInfo;
    const prepared = prepareEntities(fields, entities, log);
    const db = await openDb(name, version);

    log({ message: MESSAGES.startInsertBatch });
    await idbBulkInsert(db, CONSTANTES.STORE_DATA_NAME, function (args) {
      const { message } = args;
      log({ message });
    })(prepared);
    log({ message: MESSAGES.insertBatchDone });
    fillTokensStore(db, tfIdf, prepared, log);
    log({ message: MESSAGES.done });
    return 'success';
  } catch (e) {
    log({ message: 'Une erreur est survenue. Consulter la log !' });
    throw e;
  }
}

export default append;
