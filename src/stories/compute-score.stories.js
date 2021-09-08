import React, { useEffect, useState, useCallback } from 'react';
import createStore from '../commons-idb/open-or-create-db';
import clearStore from '../commons-idb/clear-store';
import appendStore from '../store-index/append';
import insertEntity from '../commons-idb/insert-entity';
import * as CONSTANTES from '../commons-idb/constantes';
import searching from '../searching';
import { storeInfo, fetchNafRev2 } from './naf-rev2';

const idbVersion = '1';

export function ComputeScore() {
  const [db, setDb] = useState(undefined);
  const [search, setSearch] = useState('cultur taba');
  useEffect(function () {
    async function init() {
      setDb(await createStore(storeInfo.name, idbVersion));
    }
    init();
  }, []);

  const fillStore = useCallback(
    function () {
      async function load() {
        const entities = await fetchNafRev2();
        await clearStore(db, CONSTANTES.STORE_DATA_NAME);
        await clearStore(db, CONSTANTES.STORE_INFO_NAME);
        await appendStore(storeInfo, idbVersion, storeInfo.fields, entities, console.log);
        await insertEntity(db, CONSTANTES.STORE_INFO_NAME, storeInfo);
      }
      if (db) {
        load();
      }
    },
    [db]
  );

  const onSearch = useCallback(
    function () {
      async function doIt() {
        const results = await searching(search, storeInfo.name, '1');
        console.log(results);
      }

      doIt();
    },
    [search]
  );

  return (
    <>
      <input type="button" onClick={fillStore} value="Fill Store!" />
      <div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="button" value="Search" onClick={onSearch} />
      </div>
    </>
  );
}

const story = {
  title: 'compute-score',
  component: () => null,
  parameters: {},
};

export default story;
