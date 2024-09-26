'use client';

import MapCanvas from '@/components/map';
import { years as yearsList } from '@/data/lc.json';
import { Context } from '@/module/store';
import { Option, Status } from '@/module/type';
import { Map } from 'maplibre-gl';
import { useState } from 'react';
import Panel from './panel';

export default function Main({
  defaultStates: { firstUrl, defaultYear },
}: {
  defaultStates: { firstUrl: string; defaultYear: number };
}) {
  const [years, setYears] = useState(
    yearsList.map((year) => new Object({ value: year, label: String(year) }) as Option),
  );
  const [year, setYear] = useState(years.filter((x) => x.value == defaultYear)[0]);
  const [map, setMap] = useState<Map>();
  const [status, setStatus] = useState<Status>({ message: 'Loading app...', type: 'process' });
  const [urlDict, setUrlDict] = useState({ [String(defaultYear)]: firstUrl });
  const lcId = 'lc';

  const states = {
    firstUrl,
    urlDict,
    setUrlDict,
    lcId,
    years,
    setYears,
    year,
    setYear,
    map,
    setMap,
    status,
    setStatus,
  };

  return (
    <Context.Provider value={states}>
      <MapCanvas />
      <Panel />
    </Context.Provider>
  );
}
