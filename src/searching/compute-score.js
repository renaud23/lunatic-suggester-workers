import * as levenshtien from 'damerau-levenshtein';

function findBestSimilarity(tokens, token) {
	return tokens.reduce((max, t) => {
		const { similarity } = levenshtien(t, token);
		return Math.max(max, similarity);
	}, 0);
}

function appendBestSimilarity(results) {
	return Object.entries(results).reduce(function (a, entry) {
		// results : {token: suggestions, ...}
		const [token, suggestions] = entry;
		const withSimilarity = suggestions.map(function (suggestion) {
			const { tokens } = suggestion;
			const similarity = findBestSimilarity(tokens, token);
			return { ...suggestion, similarity };
		});
		return { ...a, [token]: withSimilarity };
	}, {});
}

function appendCount(withSim) {
	const idWidthCount = {};
	Object.values(withSim).forEach(function (suggestions) {
		suggestions.forEach(function (e) {
			const { id, similarity, suggestion } = e;
			if (id in idWidthCount) {
				const { count, similarities } = idWidthCount[id];
				idWidthCount[id] = {
					suggestion,
					count: count + 1,
					similarities: [...similarities, similarity],
				};
			} else {
				idWidthCount[id] = { suggestion, count: 1, similarities: [similarity] };
			}
		});
	});

	return idWidthCount;
}

function computeScore(e) {
	const { similarities, count } = e;
	const coefSim = similarities.reduce((c, s) => c * s, 1);
	return count * coefSim;
}

function appendScore(withCount) {
	return Object.values(withCount).map(function (e) {
		return { ...e, score: computeScore(e) };
	});
}

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

function compute(results) {
	return finalize(appendScore(appendCount(appendBestSimilarity(results))));
}

export default compute;
