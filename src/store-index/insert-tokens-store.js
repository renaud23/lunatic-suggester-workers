import { idbBulkInsert, CONSTANTES } from '../commons-idb';

async function updateTokensStore(db, tokensMap, log) {
  const tokens = Object.values(tokensMap);
  await idbBulkInsert(db, CONSTANTES.STORE_TOKENS_NAME, log)(tokens);
}

export default updateTokensStore;
