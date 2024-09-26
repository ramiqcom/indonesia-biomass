import { lcLayer } from '@/module/layer';
import { Context } from '@/module/store';
import { RasterTileSource } from 'maplibre-gl';
import { useContext } from 'react';
import { Select } from './input';
import Legend from './legend';

export default function Panel() {
  const { status } = useContext(Context);

  return (
    <div
      style={{
        width: '25%',
      }}
    >
      <div
        style={{
          padding: '2vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1vh',
          textAlign: 'center',
        }}
      >
        <YearsSelect />
        <Legend />
        {status.message}
      </div>
    </div>
  );
}

function YearsSelect() {
  const { years, year, setYear, map, lcId, status, setStatus, urlDict, setUrlDict } =
    useContext(Context);
  return (
    <Select
      options={years}
      value={year}
      disabled={status.type == 'failed'}
      onChange={async (value) => {
        try {
          setStatus({ type: 'process', message: 'Loading data...' });
          setYear(value);

          let url: string;
          if (urlDict[String(value.value)]) {
            url = urlDict[String(value.value)];
          } else {
            url = await lcLayer(value.value);
            urlDict[String(value.value)] = url;
            setUrlDict(urlDict);
          }

          const source = map.getSource(lcId) as RasterTileSource;
          source.setTiles([url]);
          setStatus({ type: 'success', message: 'Data loaded' });
        } catch ({ message }) {
          setStatus({ type: 'failed', message });
        }
      }}
    />
  );
}
