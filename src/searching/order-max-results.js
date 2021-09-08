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

export default finalize;
