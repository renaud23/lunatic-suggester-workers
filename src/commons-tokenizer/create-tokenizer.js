import tokenizer from 'string-tokenizer';
import removeAccents from 'remove-accents';
import prepareStringIndexation from './prepare-string-indexation';
import softTokenizer from './soft-tokenizer';
import defaultStopWords from './stop-words';
import filterStemmer from './filter-stemmer';
import filterLength from './filter-length';

function defaultTokenizeIt(string) {
	return [prepareStringIndexation(string)];
}

export function tokensToArray(tokenized) {
	return Object.entries(tokenized).reduce(function (a, [k, values]) {
		if (k.startsWith('pattern')) {
			if (typeof values === 'string') {
				return [...a, values];
			}
			return [...a, ...values];
		}
		return a;
	}, []);
}

function filterStopWords(tokens, stops = defaultStopWords) {
	const mapSW = stops.reduce(function (a, w) {
		return { ...a, [w]: undefined };
	}, {});
	return tokens.reduce(function (a, t) {
		if (t in mapSW) {
			return a;
		}
		return [...a, t];
	}, []);
}

function createTokenizer(fields = []) {
	const FIELDS_TOKENIZER_MAP = fields.reduce(function (a, f) {
		const { name, rules = [], min, language = 'French', stopWords } = f;
		if (rules === 'soft') {
			return { ...a, [name]: softTokenizer };
		}
		if (rules.length) {
			const tokenRules = rules.reduce(function (a, pattern, index) {
				return { ...a, [`pattern${name}${index}`]: pattern };
			}, {});

			return {
				...a,
				[name]: function (string) {
					const what = tokenizer().input(string).tokens(tokenRules).resolve();
					const words = filterStopWords(
						filterStemmer(filterLength(tokensToArray(what), min), language),
						stopWords
					);

					return words;
				},
			};
		}
		return { ...a, [name]: defaultTokenizeIt };
	}, {});

	return function (field, entity) {
		const { name } = field;
		const tokenizeIt = FIELDS_TOKENIZER_MAP[name];
		const value = `${entity[name]}`;
		const what = tokenizeIt(removeAccents(`${value}`).toLowerCase());
		return what;
	};
}

function createEntityTokenizer(fields) {
	const tokenizer = createTokenizer(fields);
	return function (entity) {
		return fields.reduce(function (a, field) {
			return [...a, ...tokenizer(field, entity)];
		}, []);
	};
}

export default createEntityTokenizer;
