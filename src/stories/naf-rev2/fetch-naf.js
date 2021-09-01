/**
 * The way to fetch data. Each entity have an ID!
 * It for dealing with the append worker.
 * It also could be paged web service.
 */
async function fetchNaf(path = '') {
  const sbPath =
    process.env.NODE_ENV === 'development'
      ? `${path}/naf-rev2.json`
      : `/Lunatic/storybook/naf-rev2.json`;
  const response = await fetch(sbPath);
  const naf = await response.json();
  return Object.values(naf).map(function (rubrique) {
    const { code } = rubrique;
    return { ...rubrique, id: code };
  });
}

export default fetchNaf;
