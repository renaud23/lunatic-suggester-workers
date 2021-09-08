// store entities
export const STORE_DATA_NAME = 'store/entities';
export const STORE_INDEX_NAME = 'store/entities/index';
// parser and lexer info
export const STORE_INFO_NAME = 'store/info';
// for compute idf
export const STORE_TOKENS_NAME = 'store/tokens';
// various
export const MAX_STRING = String.fromCharCode(65535);
export const SEARCH_TYPES = {
  prefix: 'search/prefix',
  tokens: 'search/tokens',
};

const CONSTANTES = {
  STORE_DATA_NAME,
  STORE_INDEX_NAME,
  MAX_STRING,
  SEARCH_TYPES,
  STORE_INFO_NAME,
  STORE_TOKENS_NAME,
};

export default CONSTANTES;
