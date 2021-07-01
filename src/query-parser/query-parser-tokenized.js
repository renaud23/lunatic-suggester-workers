import tokenizer from 'string-tokenizer';
import removeAccents from 'remove-accents';
import {
	filterStemmer,
	filterLength,
	filterDouble,
} from '../commons-tokenizer';

function toArray(tokens) {
	return Array.isArray(tokens) ? tokens : [tokens];
}

function parser(
	query = '',
	{ language = 'French', pattern = /[\w]+/, min = 2 } = {}
) {
	const patternForTokens = { tokens: pattern };
	const { tokens } = tokenizer()
		.input(removeAccents(query).toLowerCase())
		.tokens(patternForTokens)
		.resolve();
	return filterDouble(
		filterStemmer(filterLength(toArray(tokens), min), language)
	);
}

export default parser;
