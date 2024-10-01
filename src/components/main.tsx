'use client';

import MapCanvas from '@/components/map';
import { years as yearsList } from '@/data/lc.json';
import { Context } from '@/module/store';
import { Option, Status, Urls } from '@/module/type';
import { FeatureCollection } from 'geojson';
import { Map } from 'maplibre-gl';
import { useState } from 'react';
import Legend from './legend';
import Panel from './panel';

export default function Main({
  defaultStates: { firstUrlDict, defaultYear },
}: {
  defaultStates: { firstUrlDict: Urls; defaultYear: number };
}) {
  const [years, setYears] = useState(
    yearsList.map((year) => new Object({ value: year, label: String(year) }) as Option),
  );
  const [year, setYear] = useState(years.filter((x) => x.value == defaultYear)[0]);
  const [map, setMap] = useState<Map>();
  const [status, setStatus] = useState<Status>({ message: 'Loading app...', type: 'process' });
  const [urlDict, setUrlDict] = useState<Record<string, Urls>>({
    [String(defaultYear)]: firstUrlDict,
  });
  const [geojson, setGeojson] = useState<FeatureCollection<any>>();

  const lcId = 'lc';
  const agbId = 'agb';
  const roiId = 'roi';

  const layers = [
    { label: 'AGB (C Ton/Ha)', value: agbId },
    { label: 'Land cover', value: lcId },
  ];

  const [layer, setLayer] = useState(layers[1]);

  const states = {
    firstUrlDict,
    urlDict,
    setUrlDict,
    lcId,
    agbId,
    years,
    setYears,
    year,
    setYear,
    map,
    setMap,
    status,
    setStatus,
    layers,
    layer,
    setLayer,
    geojson,
    setGeojson,
    roiId,
  };

  return (
    <Context.Provider value={states}>
      <Legend />
      <MapCanvas />
      <Panel />
    </Context.Provider>
  );
}
